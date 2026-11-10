# Grow a virtual machine disk

The [native vRO workflow](grow-a-virtual-machine-disk-0.2.4.workflow) grows an existing SCSI disk by a whole number of GiB. If the VM has snapshots, it adds a persistent disk of that size on the VM home datastore, using the first free slot on the selected controller. The workflow waits for the vCenter reconfiguration task. Guest partition and filesystem expansion are separate operations.

Version `0.2.4` passed an end-to-end VCFA All Apps catalog request. The numeric form grew Hard disk 1 at SCSI `0:0` from 60 to 70 GiB. A fresh read of vCenter inventory through vRO confirmed 70 GiB.

## Import and check the workflow

1. In vRO, open **Library → Workflows** and import the native workflow into the intended folder. The export retains the workflow ID. Check for that ID before importing into an instance that already has this workflow.
2. Confirm the vCenter plug-in and the built-in `com.vmware.library.vc.basic/vim3WaitTaskEnd` action are available. Register the intended vCenter endpoint in vRO and verify the shared session can see the test VM and reconfigure its virtual hardware.
3. Open **Inputs/Outputs** and compare the inputs below. The archive contains the executable workflow and input declarations. Rebuild the custom form separately.

| Workflow input | vRO type | Purpose |
| --- | --- | --- |
| `vm` | `VC:VirtualMachine` | Exact VM inventory object |
| `diskIndex` | `number` | Existing disk unit, 0–15 excluding 7 |
| `diskSize` | `number` | Whole GiB to add, 1–65,536 |
| `scsiBusNumber` | `number` | Existing SCSI controller bus, with a workflow default of 0 |
| `thinProvisioned` | `boolean` | Thin provision a new disk when the snapshot path applies |
| `datastore` | `VC:Datastore` | Legacy optional input. Leave unset in the catalog. The snapshot path uses the VM home datastore |
| `diskMode` | `VC:VirtualDiskMode` | Legacy input. Leave unset. New disks are persistent |

## Build the working input form

Open **vRO → Library → Workflows → Grow a virtual machine disk → Input Form → Request**. Add tabs named **VM** and **Disk information**. Drag the workflow inputs into the form so that their IDs and bindings come from the declarations. Leave `datastore` and `diskMode` off the form.

| Tab | Field ID | Label | Display | Required | Initial value and constraints |
| --- | --- | --- | --- | --- | --- |
| VM | `vm` | Virtual machine to which to add the disk | Value picker | Yes | No preset. Use the vCenter plug-in inventory |
| Disk information | `diskIndex` | Existing SCSI unit number | Decimal field | Yes | 0. Minimum 0, maximum 15. The workflow rejects 7 and fractional units |
| Disk information | `diskSize` | Capacity to add (GiB) | Decimal field | Yes | The live form displayed 0.01 as its UI minimum. Enter a whole number of at least 1 to run the workflow |
| Disk information | `scsiBusNumber` | SCSI controller bus number | Decimal field | No | 0. Minimum 0. Enter the bus from the existing disk address |
| Disk information | `thinProvisioned` | Use thin provisioning? | Checkbox | No | Unchecked |

Add a text element above the disk fields explaining that SCSI unit 7 is reserved. The running workflow also verifies that the selected address contains a virtual disk before issuing the vCenter task. Save the form and version the workflow.

## Publish the form and request a resize

In VCFA All Apps, add or verify the external vRO integration under **Administer → Connections → Integrations**. Use **Start Data Collection** after versioning if the workflow list is stale. In **Build & Deploy → Content Hub → Workflows**, select the workflow and choose **Publish to Catalog**.

| Publish field | Value |
| --- | --- |
| Workflow | Grow a virtual machine disk from the external vRO integration |
| Name | Grow a virtual machine disk |
| Description | Select a VM, enter the existing SCSI bus and unit from vSphere, and enter the whole GiB to add. If snapshots block expansion, the workflow adds a disk of that size |
| Icon | Default icon |
| Project | The authorized project for the test VM |
| Organization-wide and cross-organization sharing | Unchecked for a project-scoped item |
| Released version | Verify the imported or updated workflow revision |

To refresh an existing item, use **Catalog → item Actions → Edit → Save** after saving the workflow form. Open a fresh request to verify the published form. The request adds **Project** and **Deployment Name** on the VM tab. Select the intended project, give the request a unique name, and select the exact VM result. In **Disk information**, enter the SCSI bus, unit, whole GiB increment, and thin-provisioning choice. Check VCFA status and the vRO run log, then read the same disk’s capacity again. A successful request is additive. Check the current capacity and run history before retrying.

## Dynamic dropdown experiment in revision 0.2.3

The lookup populated the controller and disk labels in the catalog and read the post-resize capacity. The numeric dropdowns failed the catalog’s submit-time validation with valid zero values selected. The active catalog uses the numeric form above. Keep the lookup and this wiring for diagnostics.

| Action editor field | Value |
| --- | --- |
| Name | `listVmScsiChoices` |
| Module | `ca.convergelabs.pellera.vm` |
| Description | Read the SCSI buses, disk units, and capacities of the selected VM |
| Runtime | JavaScript |
| Return type | `Properties`, Array unchecked |
| Input 1 | `vm`, type `string`, Array unchecked |
| Input 2 | `scsiBus`, type `number`, Array unchecked |
| Script | Paste [listVmScsiChoices.js](../../actions/listVmScsiChoices.js) |

In a test revision, place `scsiBusNumber` before `diskIndex` on **Disk information**. Set their display type to **Dropdown**. For each, open **Values → Value options**, select **Orchestrator action**, and choose the lookup above. Leave **Default value** unset. Bind the action parameter `vm` to **Field → Virtual machine to which to add the disk**. Set `scsiBus` to **Constant → -1** for the controller and **Constant → -2** for the existing disk. The latter lists units across the selected VM. The controller and disk labels show their SCSI addresses so the requester can match the bus. Setting both dropdowns' required flag to **No** removed the initial zero warning in one preview but still failed submission. A future revision needs end-to-end validation of a submit-safe selection representation.

The catalog passes a serialized inventory reference, such as `{"type":"VC:VirtualMachine","id":"vc.example.com,id:vm-123"}`. The lookup accepts that JSON or the scoped ID as text, resolves it through vRO, and returns a single `Properties` map from option ID to label. A typed `VC:VirtualMachine` action argument received null from the catalog in this setup even though it worked in vRO preview. An `Array/Properties` containing separate `label` and `value` keys was flattened by the catalog data API. Broadcom describes a related serialization and validation issue for VCF Automation 9.1.0. The observed 9.1.1 lab failure did not expose a detailed client-side error, so its precise validation cause remains open. [Broadcom KB 445540](https://knowledge.broadcom.com/external/article/445540/custom-forms-fail-to-validate-with-error.html)
