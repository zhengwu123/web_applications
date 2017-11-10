function body_onload() {

    // Make sure someone is signed in.

    gCurrentEmployeeID = sessionStorageGet("CurrentEmployeeID", null);

    if (gCurrentEmployeeID === null) {
        location.href = "SignIn.html";
        return;
    }

    // Init the UI.

    btnAddNew.onclick = btnAddNew_onclick;
    btnRefresh.onclick = btnRefresh_onclick;

    txtDescContains.value = sessionStorageGet("txtDescContains", "");
    txtDateFrom.value     = sessionStorageGet("txtDateFrom", "");
    txtDateThrough.value  = sessionStorageGet("txtDateThrough", "");
    chkShowCurrEmp.value  = sessionStorageGet("chkShowCurrEmp", false);

    getEntries();
    displayEntries();
}

function btnAddNew_onclick() {
	location.href = "Edit.html?mode=add";
}

function btnRefresh_onclick() {
	divEntriesList.innerHTML = "";
	displayEntries()

    // Save the search critera state.

	sessionStorageSet("txtDescContains", txtDescContains.value);
	sessionStorageSet("txtDateFrom"    , txtDateFrom.value);
	sessionStorageSet("txtDateThrough" , txtDateThrough.value);
	sessionStorageSet("chkShowCurrEmp" , chkShowCurrEmp.value);
}

function row_ondblclick() {
    location.href = "Edit.html?mode=edit&index=" + this.Index;
}

function displayEntries() {

    var totalHoursWorked = 0;

    for (var i = 0; i < gEntries.length; i++) {

        var entry = gEntries[i];

        if (descriptionContains(entry) && dateBetween(entry) && isCurrentEmployee(entry)) {

            var row = document.createElement("div");
            var col1 = document.createElement("div");
            var col2 = document.createElement("div");
            var col3 = document.createElement("div");
            var col4 = document.createElement("div");

            row.className = "divEntriesRow";
            row.Index = i;

            col1.className = "divEntriesCol1";
            col2.className = "divEntriesCol2";
            col3.className = "divEntriesCol3";
            col4.className = "divEntriesCol4";

            col1.innerHTML = entry.EmployeeID;
            col2.innerHTML = entry.DateWorked;
            col3.innerHTML = entry.HoursWorked;
            col4.innerHTML = entry.Description;

            row.ondblclick = row_ondblclick;

            row.appendChild(col1);
            row.appendChild(col2);
            row.appendChild(col3);
            row.appendChild(col4);

            divEntriesList.appendChild(row);

            totalHoursWorked += parseFloat(entry.HoursWorked);
        }
    }

    lblTotalHoursWorked.innerHTML = "Total Hours Worked: " + totalHoursWorked.toFixed(2).toString();
}

function descriptionContains(entry) {
    if (txtDescContains.value === "") {
        return true;
    }

    var searchFor = txtDescContains.value.toLowerCase();

    if (entry.Description.toLowerCase().includes(searchFor) === true) {
        return true;
    }
    
    return false;
}

function isCurrentEmployee(entry) {

    if (chkShowCurrEmp.checked === true) {
        if (entry.EmployeeID === gCurrentEmployeeID) {
            return true;
        }
        return false;
    }
    return true;
}


function dateBetween(entry) {

	if (validDate(txtDateFrom.value)) {
	    if (new Date(txtDateFrom.value) > new Date(entry.DateWorked)) {
			return false;
		}
	}

	if (validDate(txtDateThrough.value)) {
	    if (new Date(txtDateThrough.value) < new Date(entry.DateWorked)) {
			return false;
		}
	}

	return true;
}
