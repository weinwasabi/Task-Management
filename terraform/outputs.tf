output "api_base_url" {
  description = "NEXT_PUBLIC_API_BASE_URL for the client."
  value       = aws_apigatewayv2_api.main.api_endpoint
}

output "cognito_user_pool_id" {
  description = "NEXT_PUBLIC_COGNITO_USER_POOL_ID for the client."
  value       = aws_cognito_user_pool.main.id
}

output "cognito_user_pool_client_id" {
  description = "NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID for the client."
  value       = aws_cognito_user_pool_client.client.id
}

output "amplify_site_url" {
  description = "URL of the deployed web app."
  value       = local.amplify_site_url
}

output "amplify_app_id" {
  description = "Amplify app ID, for manual deploys and the Amplify console."
  value       = aws_amplify_app.client.id
}

output "ec2_instance_id" {
  description = "Instance to open with EC2 Instance Connect."
  value       = aws_instance.api.id
}

output "ec2_public_ip" {
  description = "Elastic IP of the Express API server."
  value       = aws_eip.api.public_ip
}

output "database_url" {
  description = "DATABASE_URL for server/.env on the EC2 instance. Replace PASSWORD with db_password, URL-encoded."
  value       = "postgresql://${var.db_username}:PASSWORD@${aws_db_instance.postgres.endpoint}/${var.db_name}?schema=public"
}

output "images_bucket_url" {
  description = "Public base URL for images in the S3 bucket."
  value       = "https://${aws_s3_bucket.images.bucket_regional_domain_name}"
}
