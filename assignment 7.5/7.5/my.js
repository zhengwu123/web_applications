function body_onload() {
document.getElementById("loader").style.visibility = "hidden";

}

function validate_add_question(){
	if(document.getElementById("errortext").value == "")
    document.getElementById("errortext").value = "username can not be empty"
}

function validate_login(){
	document.getElementById("loader").visibility = "visible"; 
	setTimeout(function(){ document.getElementById("loader").visibility = "hidden"; }, 1000);
	if(!document.getElementById("userID").value){
    $("<div title='Error Dialog'>username can't empty/div>").dialog();
    return;
}
	if(!document.getElementById("password").value){
    $("<div title='Error Dialog'>password can't empty/div>").dialog();
    return;
}
document.getElementById("nav_username").value = document.getElementById("userID").value;
}

function logout(){
	 BootstrapDialog.show({
            message: 'Log out success!'
        });
}