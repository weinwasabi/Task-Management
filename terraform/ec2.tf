data "aws_ssm_parameter" "al2023_ami" {
  name = "/aws/service/ami-amazon-linux-latest/al2023-ami-kernel-default-x86_64"
}

data "aws_ec2_managed_prefix_list" "ec2_instance_connect" {
  name = "com.amazonaws.${var.aws_region}.ec2-instance-connect"
}

resource "aws_security_group" "api" {
  name        = "${var.project_name}-api"
  description = "Express API server"
  vpc_id      = aws_vpc.main.id
}

# API Gateway calls the server over the public internet from addresses that
# cannot be listed in a security group, so port 80 stays open.
resource "aws_vpc_security_group_ingress_rule" "api_http" {
  security_group_id = aws_security_group.api.id
  description       = "HTTP from API Gateway"
  cidr_ipv4         = "0.0.0.0/0"
  ip_protocol       = "tcp"
  from_port         = 80
  to_port           = 80
}

resource "aws_vpc_security_group_ingress_rule" "api_ssh" {
  security_group_id = aws_security_group.api.id
  description       = "SSH from EC2 Instance Connect"
  prefix_list_id    = data.aws_ec2_managed_prefix_list.ec2_instance_connect.id
  ip_protocol       = "tcp"
  from_port         = 22
  to_port           = 22
}

resource "aws_vpc_security_group_egress_rule" "api_all" {
  security_group_id = aws_security_group.api.id
  description       = "Package installs, Git, and RDS"
  cidr_ipv4         = "0.0.0.0/0"
  ip_protocol       = "-1"
}

resource "aws_instance" "api" {
  ami                    = data.aws_ssm_parameter.al2023_ami.insecure_value
  instance_type          = var.ec2_instance_type
  subnet_id              = aws_subnet.public.id
  vpc_security_group_ids = [aws_security_group.api.id]

  tags = {
    Name = "${var.project_name}-api"
  }

  lifecycle {
    # The server is set up by hand (server/aws-ec2-instructions.md), so a newer
    # AMI must not replace the instance.
    ignore_changes = [ami]
  }
}

# A fixed address keeps the API Gateway integration working after a stop/start.
resource "aws_eip" "api" {
  domain   = "vpc"
  instance = aws_instance.api.id

  tags = {
    Name = "${var.project_name}-api"
  }

  depends_on = [aws_internet_gateway.main]
}
