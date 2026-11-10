if (vm == null) return new Properties();
var reference = String(vm);
if (reference.charAt(0) === "{") {
    var selection;
    try { selection = JSON.parse(reference); } catch (error) { return new Properties(); }
    if (!selection || selection.type !== "VC:VirtualMachine") return new Properties();
    reference = String(selection.id || "");
}
if (!/^[a-z0-9.-]+(?::[0-9]+)?,(?:id:)?vm-[0-9]+$/i.test(reference)) return new Properties();
vm = Server.findForType("VC:VirtualMachine", reference);
if (!vm || !vm.config || !vm.config.hardware || scsiBus == null) return new Properties();

var devices = vm.config.hardware.device;
var controllers = [];
var disksByController = {};
var gibInKiB = 1024 * 1024;
for (var i = 0; i < devices.length; i++) {
    var device = devices[i];
    if (device instanceof VcVirtualDisk) {
        var controllerKey = String(device.controllerKey);
        if (!disksByController[controllerKey]) disksByController[controllerKey] = [];
        disksByController[controllerKey].push(device);
    } else if (device.scsiCtlrUnitNumber != null && device.busNumber != null) {
        controllers.push(device);
    }
}
controllers.sort(function (a, b) { return Number(a.busNumber) - Number(b.busNumber); });

var choices = new Properties();
var labelsByUnit = {};
var requestedBus = Number(scsiBus);
for (var c = 0; c < controllers.length; c++) {
    var controller = controllers[c];
    var bus = Number(controller.busNumber);
    var disks = disksByController[String(controller.key)] || [];
    disks.sort(function (a, b) { return Number(a.unitNumber) - Number(b.unitNumber); });
    var summaries = [];
    for (var d = 0; d < disks.length; d++) {
        var disk = disks[d];
        var unit = Number(disk.unitNumber);
        if (unit < 0 || unit > 15 || unit === 7) continue;
        var size = Math.round(Number(disk.capacityInKB) * 100 / gibInKiB) / 100;
        var address = "SCSI " + bus + ":" + unit;
        summaries.push(address + " " + size + " GiB");
        if (requestedBus === bus || requestedBus === -2) {
            var label = disk.deviceInfo && disk.deviceInfo.label ? disk.deviceInfo.label : "Hard disk";
            if (!labelsByUnit[unit]) labelsByUnit[unit] = [];
            labelsByUnit[unit].push(label + " (" + address + ", " + size + " GiB)");
        }
    }
    if (requestedBus === -1 && summaries.length > 0) {
        var controllerLabel = controller.deviceInfo && controller.deviceInfo.label;
        choices.put(String(bus), (controllerLabel || "SCSI controller " + bus) + " | " + summaries.join(", "));
    }
}
for (var u = 0; u < 16; u++) {
    if (labelsByUnit[u]) choices.put(String(u), labelsByUnit[u].join(" | "));
}
return choices;
