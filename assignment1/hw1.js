window.onload = function() {

document.getElementById("textarea").value = " Hi, ya! Welcome to Tips Calculator.";

}

function tryParse(str,n){
	//check number after decimal point
	var index;
	var dotCount=0;
for(var i = 0;i<str.length;i++){
	if(str[i] == '.'){
		index = i;
		dotCount++;
	}
	if(dotCount>1){
		dotCount=0;
		return false;
	}
	}
	if((str.length - 1-i)>n){
		document.getElementById("textarea").value = " Error, only accept 2 digital after decimal point.";
		return false;
	}

	document.getElementById("textarea").value = " Hi, ya! Welcome to Tips Calculator.";
	try{
		if(str.length <1){
			document.getElementById("textarea").value = "Please type in a valid number.";
			return false;
		}
		else{
	var num = parseFloat(str);
	if(isNaN(num)){
		return false;
	}
	else{
		return true;
	}
}
}
catch(error){
	document.getElementById("textarea").value = error.message;
	return false;
}
}

function outdateResult(btnid){
	var tipsPercent;
	var checkamt;
	var taxPercent;
	if(btnid == 0){
		
		if(tryParse(document.getElementById("checkamount").value,2)){
			if(!document.getElementById("tippercentage").value){
			if(!document.getElementById("taxpercentage").value){
			checkamt = document.getElementById("checkamount").value;
			document.getElementById("saletax").value = ((0.07)*parseFloat(checkamt)/(1.07)).toFixed(2);
			document.getElementById("tipamount").value = ((0.18)*parseFloat(checkamt)/(1.07)).toFixed(2);
		    }
			}
			else if(tryParse(document.getElementById("tippercentage").value,2)){
			if(tryParse(document.getElementById("taxpercentage").value,2)){
			tipsPercent = document.getElementById("tippercentage").value;
			checkamt = document.getElementById("checkamount").value;
			taxPercent= document.getElementById("taxpercentage").value;
		    document.getElementById("saletax").value = ((taxPercent/100)*checkamt/(1+taxPercent/100)).toFixed(2);
			document.getElementById("tipamount").value = (parseFloat(checkamt)/(1+taxPercent/100)*parseFloat(tipsPercent)/100).toFixed(2);
		}
		else
		{
			document.getElementById("textarea").value = "Please type in a valid tax percentage.";
			document.getElementById("taxpercentage").focus();
		}
		}
		else{
			document.getElementById("textarea").value = "Please type in a valid tips percentage.";
			document.getElementById("tippercentage").focus();
		}
	}
	else{
		document.getElementById("textarea").value = "Please type in a valid Check Amount.";
		document.getElementById("tipamount").value = "";
		document.getElementById("saletax").value = "";
		document.getElementById("checkamount").focus();
	}

}

	if(btnid == 1){
		
		if(tryParse(document.getElementById("checkamount").value,2)){
			if(!document.getElementById("tippercentage").value){
			if(!document.getElementById("taxpercentage").value){
			checkamt = document.getElementById("checkamount").value;
			document.getElementById("saletax").value = ((0.07)*parseFloat(checkamt)/(1.07)).toFixed(2);
			document.getElementById("tipamount").value = (parseFloat(checkamt)*0.18).toFixed(2);
		    }
		    else{
			document.getElementById("textarea").value = "Please type in a valid tax percentage.";
			document.getElementById("taxpercentage").focus();
			}
			}
			else if(tryParse(document.getElementById("tippercentage").value,2)){
				if(tryParse(document.getElementById("taxpercentage").value,2)){
			tipsPercent = document.getElementById("tippercentage").value;
			checkamt = document.getElementById("checkamount").value;
			taxPercent = document.getElementById("taxpercentage").value;
			document.getElementById("saletax").value = ((taxPercent/100)*parseFloat(checkamt)/(1 + taxPercent/100)).toFixed(2);
			document.getElementById("tipamount").value = (parseFloat(checkamt)*parseFloat(tipsPercent)/100).toFixed(2);
		}
		
		}else{
			document.getElementById("textarea").value = "Please type in a valid tips percentage.";
			document.getElementById("tippercentage").focus();

		}
	}
	else{
		document.getElementById("textarea").value = "Please type in a valid Check Amount.";
		document.getElementById("checkamount").focus();
		document.getElementById("tipamount").value = "";
		document.getElementById("saletax").value = "";
	}
}			
		
}


