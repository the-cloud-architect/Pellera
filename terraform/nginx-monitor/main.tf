terraform {
  required_version = "= 1.5.5"

  required_providers {
    http = {
      source  = "hashicorp/http"
      version = "= 3.4.5"
    }
  }
}

provider "http" {}

variable "nginx_url" {
  description = "NGINX endpoint to verify."
  type        = string
  default     = "http://10.4.2.56"
}

data "http" "nginx" {
  url = var.nginx_url

  lifecycle {
    postcondition {
      condition     = self.status_code == 200
      error_message = "NGINX did not return HTTP 200."
    }
  }
}

output "nginx_status_code" {
  value = data.http.nginx.status_code
}
