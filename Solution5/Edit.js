"use strict";

function showEdit(index) {

    divEdit.style.display = "flex";

    spanEditX.onclick = btnEditOK_onclick;
    btnEditOK.onclick = btnEditOK_onclick;

    spanEditTitle.innerHTML = "View";

    var entry = gEntries[index];

    txtEmployeeID.value = entry.EmployeeID;
    txtHoursWorked.value = entry.HoursWorked;
    txtDateWorked.value = entry.DateWorked;
    chkBillable.checked = entry.Billable;
    txtDescription.value = entry.Description;

    return;

    function btnEditOK_onclick() {
        divEdit.style.display = "none";
    }
}
