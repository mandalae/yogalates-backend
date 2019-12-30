variable "app_version" {
  type = string
}

provider "aws" {
  region = "eu-west-1"
}

data "aws_subnet_ids" "default" {
  vpc_id = "vpc-9980ebfd"
}

resource "aws_lambda_permission" "YogalatesBackend" {
  action        = "lambda:InvokeFunction"
  function_name = "${aws_lambda_function.YogalatesBackend.function_name}"
  principal     = "alexa-appkit.amazon.com"
}

resource "aws_lambda_function" "YogalatesBackend" {
  filename      = "artifact/yogalates-backend.zip"
  function_name = "HiveMonitoring2"
  role          = "arn:aws:iam::368263227121:role/service-role/skaaning-house-skill"
  handler       = "index.handler"
  source_code_hash = "${filebase64sha256("artifact/yogalates-backend.zip")}"
  runtime       = "nodejs12.x"

  vpc_config {
    subnet_ids = tolist(data.aws_subnet_ids.default.ids)
    security_group_ids = ["sg-0ceafc59639ad7c4b"]
  }
}

resource "aws_lambda_alias" "active" {
  name             = "ACTIVE"
  function_name    = "${aws_lambda_function.YogalatesBackend.arn}"
  function_version = "$LATEST"
}

resource "aws_lambda_alias" "version" {
  name             = "version-${var.app_version}"
  function_name    = "${aws_lambda_function.YogalatesBackend.arn}"
  function_version = "${aws_lambda_function.YogalatesBackend.version}"
}
