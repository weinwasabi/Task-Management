variable "aws_region" {
  description = "AWS region for every resource. Singapore is the closest region to users in the Philippines."
  type        = string
  default     = "ap-southeast-1"
}

variable "project_name" {
  description = "Prefix for resource names and the Project tag."
  type        = string
  default     = "task-management"
}

variable "ec2_instance_type" {
  description = "Instance type for the Express API server."
  type        = string
  default     = "t3.micro"
}

variable "db_engine_version" {
  description = "PostgreSQL major version for RDS."
  type        = string
  default     = "17"
}

variable "db_instance_class" {
  description = "RDS instance class."
  type        = string
  default     = "db.t3.micro"
}

variable "db_name" {
  description = "Database created in the RDS instance."
  type        = string
  default     = "projectmanagement"
}

variable "db_username" {
  description = "RDS master username."
  type        = string
  default     = "postgres"
}

variable "db_password" {
  description = "RDS master password. Set it with TF_VAR_db_password; Terraform does not save it in state or plan files."
  type        = string
  sensitive   = true
  ephemeral   = true

  validation {
    condition     = length(var.db_password) >= 8 && length(var.db_password) <= 128
    error_message = "db_password must be 8 to 128 characters."
  }
}

variable "db_password_version" {
  description = "Increase this number to send a changed db_password to RDS."
  type        = number
  default     = 1
}

variable "images_bucket_name" {
  description = <<-EOT
    Globally unique name for the public image bucket. The client hard-codes its
    image host in next.config.mjs, BoardView, and TaskCard; point those at this bucket.
  EOT
  type        = string
}

variable "github_repository_url" {
  description = "GitHub repository Amplify builds from, such as https://github.com/owner/repo. Leave null for manual Amplify deploys."
  type        = string
  default     = null
}

variable "github_access_token" {
  description = "GitHub personal access token Amplify uses to connect the repository. Required when github_repository_url is set."
  type        = string
  sensitive   = true
  default     = null
}

variable "amplify_branch_name" {
  description = "Git branch Amplify deploys."
  type        = string
  default     = "main"
}

variable "cors_allowed_origins" {
  description = "Browser origins allowed to call the API in addition to the Amplify site."
  type        = list(string)
  default     = ["http://localhost:3000"]
}
