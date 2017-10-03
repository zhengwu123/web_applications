
window.onload = function() {

    document.getElementById("background3").style.visibility='hidden';
    document.getElementById("background2").style.visibility='hidden';
    document.getElementById("alert_box").style.visibility='hidden';

    if(localStorage.getItem("currentuser") != null){
    document.getElementById("Employee_ID").value = localStorage.getItem("currentuser");
    document.getElementById("pass").focus();
  }

 initializeusers();

}



var usersArray;

function initializeusers(){
 // alert("do I farking beening called?");
   usersArray = new Array();
for (var i = 0; i < 5; i++){
  var user = new Object();
  user.EmployID = "user" + i;
  user.password = i;
    usersArray.push(user);
  }

  console.log(usersArray);

}

function checkValidUser(){
  var EmployeeID = document.getElementById("Employee_ID").value;
  var pass = document.getElementById("pass").value;

  if( EmployeeID == ""){
    document.getElementById("Employee_ID").focus();
    
     on_alert("EmployeeID can not be Empty!");
    return;
  }
  if(pass == ""){
    document.getElementById("pass").focus();
    on_alert("Password can not be Empty!");
    return;
  }
  if((EmployeeID === "user0" && pass === '0') ||
    (EmployeeID === "user1" && pass === '1') ||
    (EmployeeID === "user2" && pass === '2') ||
    (EmployeeID === "user3" && pass === '3') ||
    (EmployeeID === "user4" && pass === '4') ){

    if(document.getElementById("checkbox").checked == true){
      localStorage.setItem("currentuser", EmployeeID);
    }
    localStorage.setItem("ValidUser", true);
    sessionStorage.setItem("userSession", true);
    console.log(localStorage.getItem("ValidUser"));
    //document.location.href = 'Main.html';
    document.getElementById("login").style.visibility='hidden';
    document.getElementById("background3").style.visibility='visible';
    document.getElementById("background2").style.visibility='visible';
  }
  else{
    on_alert("Invalid EmployID or passowrd!");
    return;
  }
}
var Entrys = new Array();
window.onload = function() {
 //document.getElementById("datePicker").value = new Date().toISOString().substring(0, 10);
//checkLogin();
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
   on_alert("EmployeeID can not be Empty!");
//document.getElementById("EmployeeID").value = tmp;
}
else{
  if(document.getElementById("datePicker").value){
      if(validate_date(document.getElementById("datePicker").value)){
        //valid date
        if(!document.getElementById("workHours").value){
          //workhour  empty
          document.getElementById("workHours").focus();
          on_alert("Work hours can not be empty.");
          return;
        }
        else{
          //workhour not empty
          if(check_workHours(document.getElementById("workHours").value)){
          if(!(document.getElementById("description").value)){
            document.getElementById("description").focus();
              on_alert("description can not be empty.");
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
        on_alert("invalid date format!");
        document.getElementById("datePicker").focus();
        return;
      }
  }
  else{
    on_alert("date can not be empty.");
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
    on_alert("work hours should between 1 to 4 hours");
    return false;
  }
  else{
    if(hours%0.25 != 0){
      on_alert("Invalid format, hours should only in 15 min intervals.");
      return false;
    }
  }
  return true;
}

function validate_description(description){
  if(description.length<20 || description.length == 0){
    on_alert("description should be at least 20 characters long.");
    return false;
  }
  return true;
}

function addnewEntry(){
  document.location.href = 'Edit.html';
  localStorage.setItem("add",true);
  localStorage.removeItem("edit",true);
}


function checkLogin(){
if(!sessionStorage.getItem("userSession")){

  on_alert("You need to login to access this page.");
  document.location.href = 'SignIn.html';
 }
}


// Get the modal

var modal;
var span;
// When the user clicks the button, open the modal 
function on_alert(str) {
   modal = document.getElementById('myModal');

   span = document.getElementsByClassName("close")[0];
    modal.style.display = "block";
    document.getElementById('modal-body').innerHTML = str;
}

// When the user clicks on <span> (x), close the modal
function alert_close() {

    modal.style.display = "none";
}

function on_signin_close(){
  if(on_confirm("Are you sure to close this window?")){
  var signin_model = document.getElementById('login');
  signin_model.style.display = "none";
}else{
  return;
}

}

function on_filter_close(){
  if(on_confirm("Are you sure to close this window?")){
  var filter_model = document.getElementById('background3');
  filter_model.style.display = "none";}
  else{
    return;
  }
}

function on_entries_close(){
  if(on_confirm("Are you sure to close this window?")){
  var entries_model = document.getElementById('background2');
  entries_model.style.display = "none";}
  else{
    return;
  }
}

function edit_entry_close(){
  if(on_confirm("Are you sure to close this window?")){
  var entries_model = document.getElementById('background');
  entries_model.style.display = "none";}
  else{
    return;
  }
}

function time_log_close(){
  if(on_confirm("Are you sure to close this window?")){
  var entries_model = document.getElementById('background4');
  entries_model.style.display = "none";}
  else{
    return;
  }
}
// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
function on_confirm(str) {
    var txt;
    var r = confirm(str);
      return r;
    
}
