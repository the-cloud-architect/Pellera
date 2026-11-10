# VCF Add-on Exchange for VM Apps

[blueprint.yaml](blueprint.yaml) provisions an NGINX storefront, Python
checkout API, and PostgreSQL on three Ubuntu VMs. Import it as a VM Apps
template, supply the inputs below, and run the placement test before
deploying. Use a project-scoped release to make it available in the catalog.

| Input | Value |
| --- | --- |
| Ubuntu image mapping | Ubuntu 22.04 OVF with VMware Tools and cloud-init configured for the OVF datasource |
| Compute placement tag | Capability tag for the target vSphere cloud zone |
| DHCP network tag | Capability tag for the existing vSphere network |
| Checkout API IPv4 subnet | IPv4 CIDR that contains the API VM address used to reach PostgreSQL |
| PostgreSQL password | Fresh value with 32–64 ASCII letters, digits, hyphens, or underscores |

The [PostgreSQL password generator](../../../orchestrator/actions/generatePostgresPassword.py)
can supply the password through an Orchestrator action in the catalog form.

Each deployment needs three free DHCP addresses. If it stalls during VM
creation, check the last resource in deployment history and check its guest
IPv4 address in vCenter. In NSX, inspect the target subnet's IPAM Statistics
for DHCP pool usage. Check capacity again before retrying.

Open the Web VM on HTTP port 80. The API serves `/ready` on port 8080 and
connects to PostgreSQL on port 5432. Submit a demo checkout to verify all
three tiers. PostgreSQL stores requests on the database VM boot disk.
