
window.onload = function() {

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
    alert("EmployeeID can not be Empty!");
    return;
  }
  if(pass == ""){
    document.getElementById("pass").focus();
    alert("Password can not be Empty!");
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
    console.log(localStorage.getItem("ValidUser"));
    document.location.href = 'Main.html';
  }
  else{
    alert("Invalid EmployID or passowrd!");
    return;
  }
}
