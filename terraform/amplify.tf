locals {
  amplify_site_url = "https://${var.amplify_branch_name}.${aws_amplify_app.client.default_domain}"
}

resource "aws_amplify_app" "client" {
  name         = var.project_name
  repository   = var.github_repository_url
  access_token = var.github_access_token
  platform     = "WEB_COMPUTE"

  build_spec = <<-YAML
    version: 1
    applications:
      - appRoot: client
        frontend:
          phases:
            preBuild:
              commands:
                # Next.js 16 needs Node.js 20.9 or newer.
                - nvm install 22
                # client/.env.local is committed with LocalStack settings; remove it
                # so the branch variables below are the only Cognito and API config.
                - rm -f .env.local
                - npm ci
            build:
              commands:
                - npm run build
          artifacts:
            baseDirectory: .next
            files:
              - "**/*"
          cache:
            paths:
              - .next/cache/**/*
              - node_modules/**/*
  YAML

  environment_variables = {
    AMPLIFY_MONOREPO_APP_ROOT = "client"
  }
}

resource "aws_amplify_branch" "main" {
  app_id      = aws_amplify_app.client.id
  branch_name = var.amplify_branch_name
  framework   = "Next.js - SSR"
  stage       = "PRODUCTION"

  # Set on the branch, not the app, because the API's CORS origins depend on the
  # app's domain and the app would otherwise depend on the API.
  environment_variables = {
    NEXT_PUBLIC_API_BASE_URL                = aws_apigatewayv2_api.main.api_endpoint
    NEXT_PUBLIC_COGNITO_USER_POOL_ID        = aws_cognito_user_pool.main.id
    NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID = aws_cognito_user_pool_client.client.id
  }
}
