function body_onload() {
    btnSignIn.onclick = btnSignIn_click;

    // Populate the UI with any values we saved.
    
    txtEmployeeID.value = localStorageGet("EmployeeID", "");
    chkRemember.checked = localStorageGet("Remember", false);

    if (txtEmployeeID.value === "") {
        txtEmployeeID.focus();
    }
    else {
        txtPassword.focus();
    }
}

function btnSignIn_click() {

    if (signinEmployee(txtEmployeeID.value, txtPassword.value) === false) {
        alert("EmployeeID and/or Password is incorrect");
        return;
    }

    // Save the Sign In state for the next time someone signs in.

    localStorageSet("Remember", chkRemember.checked);

    if (chkRemember.checked === true) {
        localStorageSet("EmployeeID", txtEmployeeID.value);
    }
    else {
        localStorageSet("EmployeeID", "");
    }

    // Save the signed in employee in session state so other pages know someone is signed in.

    sessionStorageSet("CurrentEmployeeID", txtEmployeeID.value);

    // Navigate to the main page.

    location.href = "Main.html";
}
