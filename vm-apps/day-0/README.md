# VM Apps Day 0

- [Ubuntu VM](ubuntu-vm/) provisions one VM from an Ubuntu OVF image mapping
  with network and size choices.
- [Ubuntu with NGINX via AWX](nginx-awx/) provisions Ubuntu and runs the AWX
  Install NGINX job against the new guest.
- [VCF Add-on Exchange](vcf-add-on-exchange/) deploys the three-tier demo
  on vSphere VMs through a VM Apps template.
- [Install NGINX](../../playbooks/install-nginx.yml) is the AWX playbook
  used to configure NGINX during VM provisioning.
