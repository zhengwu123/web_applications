<!DOCTYPE html>
<html>
<body>

<h2>JavaScript Array Sort</h2>

<p>Click the buttons to sort car objects on type.</p>

<button onclick="myFunction()">Sort</button>

<p id="demo"></p>

<script>

function compare(friend1,friend2){
if(friend1.LastName != friend2.LastName){
	return friend1.LastName - friend2.lastName;
}
return friend1.FirstName - friend2.FirstName;

}
var friend1 = {FirstName: "A",LastName:"B"}
var friend2 = {FirstName: "A",LastName:"C"}
var friend3 = {FirstName: "A",LastName:"A"}
var frienlist = [friend1,friend2,friend3];

frienlist.sort(compare);


function display() {
	alert
  frienlist[0].FirstName + " " + cars[0].LastName + "<br>" +
  frienlist[1].FirstName + " " + cars[1].LastName + "<br>" +
  frienlist[2].FirstName + " " + cars[2].LastName;
}

</script>

</body>
</html>





	