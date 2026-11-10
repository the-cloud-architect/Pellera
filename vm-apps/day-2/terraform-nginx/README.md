# Terraform NGINX endpoint check

[blueprint.yaml](blueprint.yaml) wraps the
[existing Terraform check](../../../terraform/nginx-monitor/) in a VM Apps
catalog request. It reads an existing endpoint and reports whether it
returns HTTP 200.

Connect the Git repository and Terraform runtime to your VM Apps project.
In the blueprint, replace `repositoryId` with the repository ID from your
VCFA integration and `commitId` with a Git commit that contains
`terraform/nginx-monitor`. Import and release the template, then request it
with an endpoint URL reachable from the Terraform runtime.
