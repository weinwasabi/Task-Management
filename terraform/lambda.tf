data "archive_file" "post_confirmation" {
  type        = "zip"
  source_file = "${path.module}/lambda/post-confirmation/index.mjs"
  output_path = "${path.module}/.build/post-confirmation.zip"
}

data "aws_iam_policy_document" "lambda_assume_role" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "post_confirmation" {
  name               = "${var.project_name}-post-confirmation"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume_role.json
}

resource "aws_iam_role_policy_attachment" "post_confirmation_logs" {
  role       = aws_iam_role.post_confirmation.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_cloudwatch_log_group" "post_confirmation" {
  name              = "/aws/lambda/${var.project_name}-post-confirmation"
  retention_in_days = 14
}

resource "aws_lambda_function" "post_confirmation" {
  function_name    = "${var.project_name}-post-confirmation"
  role             = aws_iam_role.post_confirmation.arn
  runtime          = "nodejs22.x"
  handler          = "index.handler"
  filename         = data.archive_file.post_confirmation.output_path
  source_code_hash = data.archive_file.post_confirmation.output_base64sha256
  # Cognito stops waiting for a trigger after 5 seconds.
  timeout = 5

  environment {
    variables = {
      API_BASE_URL = aws_apigatewayv2_api.main.api_endpoint
    }
  }

  depends_on = [
    aws_cloudwatch_log_group.post_confirmation,
    aws_iam_role_policy_attachment.post_confirmation_logs,
  ]
}

resource "aws_lambda_permission" "cognito_post_confirmation" {
  statement_id  = "AllowCognitoInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.post_confirmation.function_name
  principal     = "cognito-idp.amazonaws.com"
  source_arn    = aws_cognito_user_pool.main.arn
}
