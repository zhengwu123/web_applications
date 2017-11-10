"use strict";

function body_onload() {
    window.onclick = window_onclick;
    showSignIn(signInSuccess);
    return;

    function signInSuccess() {

        // Init the UI.

        btnRefresh.onclick = btnRefresh_onclick;

        divEntriesHead1.onclick = divEntriesHead1_onclick;
        divEntriesHead2.onclick = divEntriesHead2_onclick;
        divEntriesHead3.onclick = divEntriesHead3_onclick;
        divEntriesHead4.onclick = divEntriesHead4_onclick;

        getEntries(displayEntries);
    }

    function btnRefresh_onclick() {
        getEntries(displayEntries);
    }

    function divEntriesHead1_onclick() {
        setSortOrder("1");
        getEntries(displayEntries);
    }

    function divEntriesHead2_onclick() {
        setSortOrder("2");
        getEntries(displayEntries);
    }

    function divEntriesHead3_onclick() {
        setSortOrder("3");
        getEntries(displayEntries);
    }

    function divEntriesHead4_onclick() {
        setSortOrder("4");
        getEntries(displayEntries);
    }

    function row_ondblclick() {
        showEdit(this.Index);
    }

    function setSortOrder(column) {

        var sortColumn = localStorageGet("sortColumn", "1");
        var sortAscDesc = localStorageGet("sortAscDesc", "a");

        // If we are now sorting on the same column as last time, toggle between ascending/descending.
        // Otherwise just set the new sort column.

        if (column === sortColumn) {
            if (sortAscDesc === "a") {
                localStorageSet("sortAscDesc", "d");
            }
            else {
                localStorageSet("sortAscDesc", "a");
            }
        }
        else {
            localStorageSet("sortColumn", column);
        }
    }

    function displayEntries() {

        setColumnHeadings();

        var totalHoursWorked = 0;

        divEntriesList.innerHTML = "";

        for (var i = 0; i < gEntries.length; i++) {

            var entry = gEntries[i];

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
            col2.innerHTML = dateFormat(new Date(entry.DateWorked));
            col3.innerHTML = parseFloat(entry.HoursWorked).toFixed(2);
            col4.innerHTML = entry.Description;

            row.ondblclick = row_ondblclick;

            row.appendChild(col1);
            row.appendChild(col2);
            row.appendChild(col3);
            row.appendChild(col4);

            divEntriesList.appendChild(row);

            totalHoursWorked += parseFloat(entry.HoursWorked);
        }

        lblTotalHoursWorked.innerHTML = "Total Hours Worked: " + totalHoursWorked.toFixed(2).toString();
    }

    function setColumnHeadings() {

        var sortColumn = localStorageGet("sortColumn", "1");
        var sortAscDesc = localStorageGet("sortAscDesc", "a");
        var arrow;

        divEntriesHead1.innerHTML = "Employee ID";
        divEntriesHead2.innerHTML = "Date";
        divEntriesHead3.innerHTML = "Hours";
        divEntriesHead4.innerHTML = "Description";

        if (sortAscDesc == "a") {
            arrow = " &uarr;"
        }
        else {
            arrow = " &darr;"
        }

        if (sortColumn === "1") {
            divEntriesHead1.innerHTML += arrow;
        }
        else if (sortColumn === "2") {
            divEntriesHead2.innerHTML += arrow;
        }
        else if (sortColumn === "3") {
            divEntriesHead3.innerHTML += arrow;
        }
        else if (sortColumn === "4") {
            divEntriesHead4.innerHTML += arrow;
        }
    }
}
