resource "aws_s3_bucket" "images" {
  bucket = var.images_bucket_name
}

# The client loads profile pictures and task attachments straight from the
# bucket URL, so objects are publicly readable. ACLs stay blocked.
resource "aws_s3_bucket_public_access_block" "images" {
  bucket = aws_s3_bucket.images.id

  block_public_acls       = true
  ignore_public_acls      = true
  block_public_policy     = false
  restrict_public_buckets = false
}

data "aws_iam_policy_document" "images_public_read" {
  statement {
    sid       = "PublicReadObjects"
    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.images.arn}/*"]

    principals {
      type        = "*"
      identifiers = ["*"]
    }
  }
}

resource "aws_s3_bucket_policy" "images_public_read" {
  bucket = aws_s3_bucket.images.id
  policy = data.aws_iam_policy_document.images_public_read.json

  depends_on = [aws_s3_bucket_public_access_block.images]
}
