terraform {
  required_version = "= 1.5.5"
}

variable "nginx_url" {
  description = "Existing NGINX endpoint to monitor."
  type        = string
  default     = "http://10.4.2.56"
}

resource "terraform_data" "monitor_target" {
  input = {
    nginx_url = var.nginx_url
    purpose   = "Pellera Terraform runtime validation"
  }
}

output "monitor_target_url" {
  description = "Target for the monitoring workflow."
  value       = terraform_data.monitor_target.output.nginx_url
}
