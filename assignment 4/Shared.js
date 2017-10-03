
function checkLogin(){
if(!sessionStorage.getItem("userSession")){

 	alert("You need to login to access this page.");
	document.location.href = 'SignIn.html';
 }
}