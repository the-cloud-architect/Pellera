# Ubuntu with NGINX via AWX

[blueprint.yaml](blueprint.yaml) provisions one Ubuntu VM, then passes its
DHCP address to the AWX job template. Create the AWX job template with the
[Install NGINX playbook](../../../playbooks/install-nginx.yml) and configure
its machine credential in AWX.

Use an Ubuntu OVF that starts SSH and allows the AWX machine credential to
sign in with privilege escalation. Verify AWX can reach the guest network,
then select the image mapping, cloud-zone tag, network tag, and the VM Apps
Ansible Tower integration name. After deployment, check the AWX job result
and open the guest's HTTP endpoint on port 80.
