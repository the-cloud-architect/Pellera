# All Apps Day 0

- [VCF Add-on Exchange](vcf-add-on-exchange/blueprint.yaml) provisions the
  storefront and API as Supervisor workloads and PostgreSQL on a VM.
- [VCF Add-on Exchange VM Edition](vcf-add-on-exchange-vm/blueprint.yaml)
  provisions the storefront, API, and database on three Supervisor VMs.

Supply the target namespace, image, storage class, and network values for
your environment. Existing VCFA imports use the paths under [blueprints](../../blueprints/).
