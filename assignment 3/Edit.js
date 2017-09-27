var Entrys = new Array();
window.onload = function() {
	if(localStorage.getItem("edit")){
		document.getElementById("deletebutton").disabled = false;
	}
	else{
		document.getElementById("deletebutton").disabled = true;
		document.getElementById("deletebutton").bgcolor = "#eff0f1";
	}
		if(localStorage.getItem("add")){
		document.getElementById("deletebutton").disabled = true;
	}

	 if(!localStorage.getItem("ValidUser")){
 	alert("You need to login to access this page.");
	document.location.href = 'SignIn.html';
 }
	if(sessionStorage.getItem("editDate") != null){
			document.getElementById("datePicker").value = sessionStorage.getItem("editDate");
	}else{
 document.getElementById("datePicker").value = new Date().toISOString().substring(0, 10);
}
 document.getElementById("EmployeeID").value = localStorage.getItem("editID");
 document.getElementById("workHours").value = localStorage.getItem("editHours");
 document.getElementById("description").value = localStorage.getItem("editDescription");
 renew();
}


function renew(){
var table = document.getElementById("myTableData");
while(table.rows.length > 0) {
  table.deleteRow(0);
}
var totalhours = 0;
	Entrys = JSON.parse(localStorage.getItem("Entrys"));
	if(Entrys != null){
	for (var i = 0; i < Entrys.length; i++){
			totalhours += parseInt(Entrys[i].workhour);
    	    insert_row(Entrys[i]);
    						//localStorage.removeItem(localStorage.key(i));
		}
	}
 document.getElementById("totalHours").innerHTML = totalhours;
}

    	


function onSumbit(){
	var tmp = "" ;
	if(localStorage.getItem("add")){
		document.getElementById("deletebutton").disabled = true;
	if(!document.getElementById("EmployeeID").value){
		document.getElementById("EmployeeID").focus();
		alert("EmployeeID can not be Empty!");
//document.getElementById("EmployeeID").value = tmp;
}
else{
	if(document.getElementById("datePicker").value){
			if(validate_date(document.getElementById("datePicker").value)){
				//valid date
				if(!document.getElementById("workHours").value){
					//workhour  empty
					document.getElementById("workHours").focus();
					alert("Work hours can not be empty.");
					return;
				}
				else{
					//workhour not empty
					if(check_workHours(document.getElementById("workHours").value)){
					if(!(document.getElementById("description").value)){
						document.getElementById("description").focus();
							alert("description can not be empty.");
					}
					else{
						if(validate_description(document.getElementById("description").value)){
							//everything doing OK. save object into local storage

							var EmployeeID = document.getElementById("EmployeeID").value;
							var entry = new Object();
							entry.workhour = document.getElementById("workHours").value;
							entry.EmployeeID = EmployeeID;
							entry.date = document.getElementById("datePicker").value;
							entry.billable = document.getElementById("billable").checked == true;
							entry.description = document.getElementById("description").value;
							Entrys.push(entry);
							localStorage.setItem("EmployeeID", EmployeeID);
							localStorage.setItem("Entrys", JSON.stringify(Entrys));
							//reset fields
							document.getElementById("description").value = "";
							document.getElementById("billable").checked = false;
							document.getElementById("workHours").value = "";

							//loop through localstorage
							var table = document.getElementById("myTableData");
							while(table.rows.length > 0) {
  								table.deleteRow(0);
							}

							for (var i = 0; i < Entrys.length; i++){
							
    						insert_row(Entrys[i]);
    						//localStorage.removeItem(localStorage.key(i));
							}
							renew();

						}
					}
					}
				}
			}else{
				alert("invalid date format!");
				document.getElementById("datePicker").focus();
				return;
			}
	}
	else{
		alert("date can not be empty.");
		document.getElementById("datePicker").focus();
		return;
	}
	document.getElementById("EmployeeID").value = document.getElementById("EmployeeID").value;
	tmp = document.getElementById("EmployeeID").value;
}
}else if(localStorage.getItem("edit")){
	updateEntry();
	
}

}
var table;
function insert_row(entry) {
    table = document.getElementById("myTableData");
    var row = table.insertRow(0);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    //var cell5 = row.insertCell(4);
    cell1.innerHTML = entry.EmployeeID;
    cell2.innerHTML = entry.date;
    cell3.innerHTML = entry.workhour;
    cell4.innerHTML = entry.description;
   // cell5.innerHTML = "<button class=\"cancelbutton\" type='button' onclick='onDelete(this);'>X</button>";
}

function onDelete(element){
	table = document.getElementById("myTableData");
	Entrys = JSON.parse(localStorage.getItem("Entrys"));
	var index = element.parentNode.parentNode.rowIndex;
	    if (confirm("Are you sure you want to delete this entry?") == true) {
	   Entrys.splice(Entrys.length-1-index, 1);
	localStorage.setItem("Entrys", JSON.stringify(Entrys));
	renew();
        
    } else {
        return;
    }

}
function updateEntry(){

table = document.getElementById("myTableData");
	Entrys = JSON.parse(localStorage.getItem("Entrys"));
	    if (confirm("Are you sure you want to Update this entry?") == true) {
	   Entrys[localStorage.getItem("deleteIndex")]

	   	if(!document.getElementById("EmployeeID").value){
		document.getElementById("EmployeeID").focus();
		alert("EmployeeID can not be Empty!");
//document.getElementById("EmployeeID").value = tmp;
}
else{
	if(document.getElementById("datePicker").value){
			if(validate_date(document.getElementById("datePicker").value)){
				//valid date
				if(!document.getElementById("workHours").value){
					//workhour  empty
					document.getElementById("workHours").focus();
					alert("Work hours can not be empty.");
					return;
				}
				else{
					//workhour not empty
					if(check_workHours(document.getElementById("workHours").value)){
					if(!(document.getElementById("description").value)){
						document.getElementById("description").focus();
							alert("description can not be empty.");
					}
					else{
						if(validate_description(document.getElementById("description").value)){
							//everything doing OK. save object into local storage

							Entrys[localStorage.getItem("deleteIndex")].workhour = document.getElementById("workHours").value;
							Entrys[localStorage.getItem("deleteIndex")].EmployeeID = document.getElementById("EmployeeID").value
							Entrys[localStorage.getItem("deleteIndex")].date = document.getElementById("datePicker").value;
							Entrys[localStorage.getItem("deleteIndex")].billable = document.getElementById("billable").checked == true;
							Entrys[localStorage.getItem("deleteIndex")].description = document.getElementById("description").value;
							localStorage.setItem("EmployeeID", EmployeeID);
							localStorage.setItem("Entrys", JSON.stringify(Entrys));
							//reset fields

							//loop through localstorage
							var table = document.getElementById("myTableData");
							while(table.rows.length > 0) {
  								table.deleteRow(0);
							}

							for (var i = 0; i < Entrys.length; i++){
							
    						insert_row(Entrys[i]);
    						//localStorage.removeItem(localStorage.key(i));
							}
							renew();

						}
					}
					}
				}
			}else{
				alert("invalid date format!");
				document.getElementById("datePicker").focus();
				return;
			}
	}
	else{
		alert("date can not be empty.");
		document.getElementById("datePicker").focus();
		return;
	}
	document.getElementById("EmployeeID").value = document.getElementById("EmployeeID").value;
	tmp = document.getElementById("EmployeeID").value;
}
	renew();
        
    } else {
        return;
    }

}
function Delete(){
table = document.getElementById("myTableData");
	Entrys = JSON.parse(localStorage.getItem("Entrys"));
	    if (confirm("Are you sure you want to delete this entry?") == true) {
	   Entrys.splice(localStorage.getItem("deleteIndex"), 1);
	localStorage.setItem("Entrys", JSON.stringify(Entrys));
	renew();
        
    } else {
        return;
    }

}

function validate_date(date){
	if (Date.parse(date)) {
	   //Valid date
	   return true;
	} else {
	  return false;
	}
}

function check_workHours(hours){
	if(hours<= 0 || hours >4){
		alert("work hours should between 1 to 4 hours");
		return false;
	}
	else{
		if(hours%0.25 != 0){
			alert("Invalid format, hours should only in 15 min intervals.");
			return false;
		}
	}
	return true;
}

function validate_description(description){
	if(description.length<20 || description.length == 0){
		alert("description should be at least 20 characters long.");
		return false;
	}
	return true;
}



