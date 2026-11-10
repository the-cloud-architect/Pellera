# VM Apps Day 2

- [Terraform NGINX catalog template](terraform-nginx/) exposes the endpoint
  check as a VM Apps catalog request for an existing workload.
- [NGINX endpoint check](../../terraform/nginx-monitor/) uses Terraform to
  verify that an existing NGINX endpoint returns HTTP 200. Set
  `nginx_url` to your endpoint.
