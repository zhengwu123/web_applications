var gFriends;

function body_onload() {
	gFriends = [];
	btnSave.onclick = btnSave_onclick;
	getFriends();
	var date = new Date();
	txtDateWorked.valueAsDate = date;
	displayFriends(0, gFriends.length);
}

function btnSave_onclick() {

    //Check to make sure all the inputs are valid

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

    //Create a friend object using the inputs from the user
	var friend = {
	    EmployeeID: txtEmployeeID.value,
	    DateWorked: txtDateWorked.value,
	    HoursWorked: txtHoursWorked.value,
	    Description: txtDescription.value
	}

	gFriends.push(friend);
	saveFriends();
	displayFriends(gFriends.length - 1, gFriends.length);

	//Clear input fields
	txtHoursWorked.value = "";
	txtDescription.value = "";
	chkBillable.checked = false;

}

//Make sure the date is valid
function validDate(dateString) {

    var date = new Date(dateString);

    if (date === "Invalid Date") {
        return false;
    }

	return true;
}

//Make sure the hours are valid
function validHoursWorked(hrs) {
	var floatHrs = parseFloat(hrs);
	if(floatHrs <= 0 || hrs > 4.00) {
		return false;
	}
	if(floatHrs * 4 === parseInt(floatHrs * 4)) {
		return true;
	}
	return false;
}

function btnDelete_onclick() {

    if (confirm("Are you sure you want to delete this item?") === false) {
        return;
    }

	reset();
	gFriends.splice(this.Index, 1);
	saveFriends();
	displayFriends(0, gFriends.length);
}

//Save the hours array into localStorage
function saveFriends() {
	var json = JSON.stringify(gFriends); //Convert data array to a single string
	localStorage.setItem("Friends", json); //Store the string into local storage
	localStorage.setItem("InputtedEmployeeID", txtEmployeeID.value); //Also store the employee ID
}

//Load the friends list from localStorage
function getFriends() {
	var json = localStorage.getItem("Friends"); //Load the string we saved earlier
	var inputID = localStorage.getItem("InputtedEmployeeID"); //Load the employee ID we saved earlier
	if(inputID !== null) {
		txtEmployeeID.value = inputID;
	}
	if(json !== null) {
		gFriends = JSON.parse(json); //Convert the string we loaded into an array
	}
}

function reset() {
	for(var i = 0; i < gFriends.length; i++) {
		var divDoc = document.getElementById("divFriendsRow" + (i));
		divFriendsList.removeChild(divDoc);
	}
}

function displayFriends(start, end) {

    var i;

    for (i = start; i < end; i++) {
		var friend = gFriends[i];

		var row = document.createElement("div");
		var col1 = document.createElement("div");
		var col2 = document.createElement("div");
		var col3 = document.createElement("div");
		var col4 = document.createElement("div");
		var btn = document.createElement("button");

		row.className = "divFriendsRow";
		row.id = "divFriendsRow" + (i);

		col1.className = "divFriendsColl1";
		col2.className = "divFriendsColl2";
		col3.className = "divFriendsColl3";
		col4.className = "divFriendsColl4";

		btn.className = "btnDelete";
		btn.onclick = btnDelete_onclick;
		btn.innerHTML = "Delete";
		btn.Index = i;

		col1.innerHTML = friend.EmployeeID;
		col2.innerHTML = friend.DateWorked;
		col3.innerHTML = friend.HoursWorked;
		col4.innerHTML = friend.Description;

		row.appendChild(col1);
		row.appendChild(col2);
		row.appendChild(col3);
		row.appendChild(col4);
		row.appendChild(btn);

		divFriendsList.appendChild(row);
	}

    // Calculate total hours worked.

	var totalHoursWorked = 0;

	for (i = 0; i < gFriends.length; i++) {
	    totalHoursWorked += parseFloat(gFriends[i].HoursWorked);
	}

	lblTotalHoursWorked.innerHTML = "Total Hours Worked: " + totalHoursWorked.toFixed(2).toString();
}
