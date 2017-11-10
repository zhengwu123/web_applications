"use strict";

var gServerRootUrl = "https://cs390-hw5.herokuapp.com/"
var gCurrentEmployeeID;
var gEntries;

function getEntries(successCallback) {

    gEntries = new Array();

    var sortColumn = localStorageGet("sortColumn", "1");
    var sortAscDesc = localStorageGet("sortAscDesc", "a");

    var queryString = "?";

    // Build the query string for sorting.

    if (sortColumn === "2") {
        queryString += "sortBy=DateWorked";
    }
    else if (sortColumn === "3") {
        queryString += "sortBy=HoursWorked";
    }
    else if (sortColumn === "4") {
        queryString += "sortBy=Description";
    }
    else {
        queryString += "sortBy=EmployeeID";
    }

    if (sortAscDesc === "a") {
        queryString += "&orderBy=asc";
    }
    else {
        queryString += "&orderBy=desc";
    }

    // Build the query string for the search criteria.

    if (txtDescContains.value !== "") {
        queryString += "&descContains=" + txtDescContains.value;
    }

    if (chkShowCurrEmp.checked === true) {
        queryString += "&forEmployeeID=" + gCurrentEmployeeID;
    }

    if (validDate(txtDateFrom.value)) {
        queryString += "&dateFrom=" + txtDateFrom.value;
    }

    if (validDate(txtDateThrough.value)) {
        queryString += "&dateTo=" + txtDateThrough.value;
    }

    // Call the server to fetch the matching entries.
    
    fetch(gServerRootUrl + "timelogs" + encodeURI(queryString))
        .then(checkResponse)
        .then(parseResponse)
        .catch(fetchError);
    return;

    function checkResponse(response) {

        if (response.ok !== true) {
            throw new Error("An unexpected network server error occurred.");
        }

        return response.json();
    }

    function parseResponse(json) {
        gEntries = json;
        successCallback();
    }

    function fetchError(error) {
        showAlert(error.message);
    }
}

function signinEmployee(employeeID, password, successCallback) {

    var credentials = { 
        employeeID: employeeID, 
        password: password 
    }

    fetch(gServerRootUrl + "auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(credentials)
    })
        .then(checkResponse)
        .then(parseResponse)
        .catch(fetchError);

    function checkResponse(response) {
        if (response.ok !== true) {
            if (response.status === 403) {
                throw new Error("Invalid Employee ID and/or Password.");
            }

            throw new Error("An unexpected network server error occurred.");
        }

        return response.json();
    }

    function parseResponse(json) {
        if (json.message === "success") {
            successCallback();
        }
        else {
            throw new Error(json.message);
        }
    }

    function fetchError(error) {
        showAlert(error.message);
    }
}

function validDate(dateString) {

    var date = new Date(dateString);

    if (date === "Invalid Date") {
        return false;
    }

    return true;
}

function dateFormat(dateValue) {

    // Return a string with date formatted as mm/dd/yyyy.

    var month = dateValue.getMonth() + 1;
    var day = dateValue.getDate();

    var dateString;

    dateString = month + "/";

    if (day < 10) {
        dateString += "0" + day;
    }
    else {
        dateString += day;
    }

    dateString += "/" + dateValue.getFullYear();

    return dateString;
}

function window_onclick(event) {
    if (event.target.className === "divModal" && event.target.id !== "divSignIn") {
        event.target.style.display = "none";
    }
}

function showAlert(message) {

    divAlertMessage.innerHTML = message;

    spanAlertX.onclick = btnAlertOK_onclick;
    btnAlertOK.onclick = btnAlertOK_onclick;

    divAlert.style.display = "flex";

    function btnAlertOK_onclick() {
        divAlert.style.display = "none";
    }
}

// These functions encapsulate local and session storage for consistencty and to simplify handling 
// default values.

function localStorageGet(token, defaultValue) {

    var value = localStorage.getItem(token);

    if (value === null) {
        return defaultValue;
    }

    return value;
}

function localStorageSet(token, value) {
    localStorage.setItem(token, value);
}
