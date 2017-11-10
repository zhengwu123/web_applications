var gMode;
var gIndex;
var gEntry;

function body_onload() {

    // Make sure someone is signed in.

    gCurrentEmployeeID = sessionStorageGet("CurrentEmployeeID", null);

    if (gCurrentEmployeeID === null) {
        location.href = "SignIn.html";
        return;
    }

    // Make sure we have the information we need.

    gMode = getQueryStringValue("mode", null);

    if (gMode !== "add" && gMode !== "edit") {
        location.href = "Main.html";
        return;
    }

    getEntries();

    if (gMode === "edit") {

        gIndex = getQueryStringValue("index", -1);
        if (tryParse(gIndex, 0) === false) {
            location.href = "Main.html";
            return;
        }

        gIndex = parseInt(gIndex);
        if (gIndex < 0 || gIndex > gEntries.length - 1) {
            location.href = "Main.html";
            return;
        }
    }

    // Init the UI.

	btnSave.onclick = btnSave_onclick;
	btnDelete.onclick = btnDelete_onclick;

	if (gMode === "edit") {
	    gEntry = gEntries[gIndex];

	    txtEmployeeID.value  = gEntry.EmployeeID;
	    txtHoursWorked.value = gEntry.HoursWorked;
	    txtDateWorked.value  = gEntry.DateWorked;
        chkBillable.checked  = gEntry.Billable;
	    txtDescription.value = gEntry.Description;

	    btnDelete.disabled = false;
    }
	else {
	    txtEmployeeID.value = gCurrentEmployeeID
	    var date = new Date();
	    txtDateWorked.valueAsDate = date;
	    btnDelete.disabled = true;
	}
}

function btnSave_onclick() {

    // Check to make sure all the inputs are valid

    if (txtEmployeeID.value === "") {
        alert("Employee ID is required.");
        txtEmployeeID.focus();
        return;
    }

    if (!validHoursWorked(txtHoursWorked.value)) {
        alert("Hours Worked must be a valid number greater than zero and less than 4.00, and only in fifteen-minute intervals.");
        txtHoursWorked.focus();
        return;
    }

    if (!validDate(txtDateWorked.value)) {
		alert("Date Worked is required.");
		txtDateWorked.focus();
		return;
	}

	if (txtDescription.value.length < 20) {
		alert("Description is required and must be at least 20 characters long.");
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
	if (gMode === "add") {


	    gEntries.push(entry);
	}
	else {
	    gEntries[gIndex] = entry;
	}

	saveEntries();
	location.href = "Main.html";
}

	function btnDelete_onclick() {

	    if (confirm("Are you sure you want to delete this entry?") === false) {
	        return;
	    }

	    gEntries.splice(gIndex, 1);
	    saveEntries();
	    location.href = "Main.html";
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
