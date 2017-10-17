"use strict";

function showEdit(mode, index, successCallback) {
    var entry;

    divEdit.style.display = "flex";

    btnEditSave.onclick = btnEditSave_onclick;
    spanEditX.onclick = btnEditCancel_onclick;
    btnEditCancel.onclick = btnEditCancel_onclick;
    btnEditDelete.onclick = btnEditDelete_onclick;

    if (mode === "edit") {

        spanEditTitle.innerHTML = "Edit";

        entry = gEntries[index];

        txtEmployeeID.value = entry.EmployeeID;
        txtHoursWorked.value = entry.HoursWorked;
        txtDateWorked.value = entry.DateWorked;
        chkBillable.checked = entry.Billable;
        txtDescription.value = entry.Description;

        btnEditDelete.disabled = false;
    }
    else {
        spanEditTitle.innerHTML = "Add";

        txtEmployeeID.value = gCurrentEmployeeID
        txtHoursWorked.value = "";
        var date = new Date();
        txtDateWorked.valueAsDate = date;
        txtDescription.value = "";
        btnEditDelete.disabled = true;
    }
    return;

    function btnEditSave_onclick() {

        // Check to make sure all the inputs are valid

        if (txtEmployeeID.value === "") {
            showAlert("Employee ID is required.");
            txtEmployeeID.focus();
            return;
        }

        if (!validHoursWorked(txtHoursWorked.value)) {
            showAlert("Hours Worked must be a valid number greater than zero and less than 4.00, and only in fifteen-minute intervals.");
            txtHoursWorked.focus();
            return;
        }

        if (!validDate(txtDateWorked.value)) {
        	showAlert("Date Worked is required.");
        	txtDateWorked.focus();
        	return;
        }

        if (txtDescription.value.length < 20) {
        	showAlert("Description is required and must be at least 20 characters long.");
        	txtDescription.focus();
        	return;
        }

        // Create a new entry object using the inputs from the user and either add it to the list,
        // or replace the exsiting entry in the list.

        var entry = {
        	EmployeeID: txtEmployeeID.value,
        	DateWorked: txtDateWorked.value,
        	HoursWorked: txtHoursWorked.value,
        	Billable: chkBillable.checked,
        	Description: txtDescription.value
        }

        if (mode === "add") {
        	gEntries.push(entry);
        }
        else {
        	gEntries[index] = entry;
        }

        saveEntries();
        divEdit.style.display = "none";
        successCallback();
    }

    function btnEditCancel_onclick() {
        divEdit.style.display = "none";
    }

    function btnEditDelete_onclick() {
        showConfirm(deleteYes, "Are you sure you want to delete this entry?");
        return;

        function deleteYes() {

            gEntries.splice(index, 1);
            saveEntries();
            divEdit.style.display = "none";
            successCallback();
        }
    }
	
    function validHoursWorked(hrs) {
	    var floatHrs = parseFloat(hrs);
	    if (floatHrs <= 0 || hrs > 4.00) {
		    return false;
	    }
	    if (floatHrs * 4 === parseInt(floatHrs * 4)) {
		    return true;
	    }
	    return false;
    }
}
