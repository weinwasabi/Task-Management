# Terraform

Creates the AWS resources for Task Management in `ap-southeast-1` (Singapore), the closest region to the Philippines.

| Service     | What it creates                                                                                 |
| ----------- | ----------------------------------------------------------------------------------------------- |
| EC2         | Amazon Linux 2023 instance for the Express API, an Elastic IP, and a VPC with one public subnet |
| RDS         | PostgreSQL in two private subnets, reachable only from the EC2 security group                   |
| API Gateway | HTTP API that forwards to Express and checks Cognito access tokens                              |
| Amplify     | Next.js SSR app built from `client/`, with the API and Cognito values set as branch variables   |
| S3          | Public-read image bucket the client loads pictures from                                         |
| Lambda      | Cognito post-confirmation trigger that creates the user row through `POST /users`               |
| Cognito     | User pool with username sign-in, a required email, and a browser app client                     |

## Apply

You need Terraform 1.11 or newer and AWS credentials for the target account.

```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars
export TF_VAR_db_password='choose-a-password'
terraform init
terraform plan
terraform apply
```

Terraform does not save `db_password`, so export it again before each `plan` or `apply`. To change it, export the new value and increase `db_password_version`.

S3 bucket names are global. The client hard-codes `pm-s3-images.s3.us-east-2.amazonaws.com` in `client/next.config.mjs`, `BoardView`, and `TaskCard`, but a bucket with that name already exists in `us-east-1`, so Terraform cannot create it. Set `images_bucket_name` to an unused name, then point those three references at the `images_bucket_url` output.

## After apply

1. Open the instance from `ec2_instance_id` with EC2 Instance Connect and follow `server/aws-ec2-instructions.md`. Put `PORT=80` and the `database_url` output, with `PASSWORD` replaced by your URL-encoded password, in `server/.env`.
2. Run `npx prisma migrate deploy` in `server/` on the instance. RDS is not reachable from outside the VPC.
3. Set `github_repository_url` and `TF_VAR_github_access_token`, then apply again to connect Amplify, or deploy the app manually from the Amplify console.

## Security limits

- Port 80 on the EC2 instance is open to the internet because API Gateway calls it over a public address. Requests sent straight to the Elastic IP skip the Cognito check.
- `POST /users` has no authorizer so the Lambda can call it before the user has a token.
- The Express API does not verify tokens itself; it relies on API Gateway's Cognito check.
