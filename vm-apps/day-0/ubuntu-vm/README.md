# Ubuntu VM

Import [blueprint.yaml](blueprint.yaml) into VM Apps. Use an image mapping for
your Ubuntu 22.04 OVF with VMware Tools. Set an image default and hide that
field in the catalog form if all requesters use the same mapping.

Replace the example network choices and default with capability tags for
eligible VM networks. Each project needs placement access and each selected
network needs a free DHCP lease. The boot disk uses the size in the OVF.

Run the VM Apps template placement test before releasing a version. To share
the item across projects, enable organization sharing in the template settings
and add only this catalog item to a Content Sharing Policy for the intended
projects. The request form exposes Small, Medium, and Large compute presets.
