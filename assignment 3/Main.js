var Entrys = new Array();
window.onload = function() {
 //document.getElementById("datePicker").value = new Date().toISOString().substring(0, 10);
 if(!localStorage.getItem("ValidUser")){
 	alert("You need to login to access this page.");
	document.location.href = 'SignIn.html';
 }
 if(localStorage.getItem("currentuser") != null){
 //document.getElementById("EmployeeID").value = localStorage.getItem("currentuser");
}
else{
	//alert("You need to login first to access this page.");
	//document.location.href = 'SignIn.html';
}
 renew();
}

window.onclose = function()
{
  localStorage.setItem("currentuser",null);
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

function refresh(){
var table = document.getElementById("myTableData");
while(table.rows.length > 0) {
  table.deleteRow(0);
}

	var keywords = document.getElementById("desKeywords").value;
	var start = new Date(document.getElementById("dateFrom").value).getTime();
	var end =  new Date(document.getElementById("dateEnd").value).getTime();
	Entrys = JSON.parse(localStorage.getItem("Entrys"));

	if(Entrys != null){

	for (var i = 0; i < Entrys.length; i++){
		var contains = Entrys[i].description.includes(keywords);
		var date =  new Date(Entrys[i].date).getTime();
		console.log(date);
		console.log(contains);

		if(date >= start && date <= end && contains){
    	    insert_row(Entrys[i]);
    	}
		}
		}
	}


function onSumbit(){
	var tmp = "" ;
	
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
    cell1.innerHTML = "<p ondblclick=\"onEdit(this);\">" + entry.EmployeeID +"</p>";
    cell2.innerHTML = "<p ondblclick=\"onEdit(this);\">" + entry.date +"</p>";
    cell3.innerHTML = "<p ondblclick=\"onEdit(this);\">" + entry.workhour +"</p>";
    cell4.innerHTML = "<p ondblclick=\"onEdit(this);\">" + entry.description +"</p>";
    //cell5.innerHTML = "<button class=\"cancelbutton\" type='button' onclick='onDelete(this);'>X</button>";
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

function onEdit(element){
	table = document.getElementById("myTableData");
	Entrys = JSON.parse(localStorage.getItem("Entrys"));
	var index = element.parentNode.parentNode.rowIndex;
	
	var entry = Entrys[Entrys.length -1 -index];
	console.log(entry.EmployeeID);
	localStorage.setItem("editID", entry.EmployeeID);
	localStorage.setItem("editHours", entry.workhour);
	localStorage.setItem("editDate",entry.date);
	localStorage.setItem("editDescription",entry.description);
	localStorage.setItem("deleteIndex",Entrys.length -1 -index);
	localStorage.setItem("edit",true);
	localStorage.removeItem("add",true);
	document.location.href = 'Edit.html';
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

function addnewEntry(){
	document.location.href = 'Edit.html';
	localStorage.setItem("add",true);
	localStorage.removeItem("edit",true);
}

