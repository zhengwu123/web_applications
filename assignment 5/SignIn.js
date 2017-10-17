"use strict";

function showSignIn(successCallback) {

    // Show the modal.

    divSignIn.style.display = "flex";
    btnSignIn.onclick = btnSignIn_onclick;

    // Populate the UI with any values we saved.

    txtSignInEmployeeID.value = localStorageGet("EmployeeID", "");
    chkRemember.checked = localStorageGet("Remember", false);

    if (txtSignInEmployeeID.value === "") {
        txtSignInEmployeeID.focus();
    }
    else {
        txtPassword.focus();
    }

    return;

    function btnSignIn_onclick() {

        if (signinEmployee(txtSignInEmployeeID.value, txtPassword.value) === false) {
            showAlert("EmployeeID and/or Password is incorrect.");
            return;
        }

        // Save the Sign In state for the next time someone signs in.

        localStorageSet("Remember", chkRemember.checked);

        if (chkRemember.checked === true) {
            localStorageSet("EmployeeID", txtSignInEmployeeID.value);
        }
        else {
            localStorageSet("EmployeeID", "");
        }

        // Save the signed in employee so we can use as a default value when adding an entry.

        gCurrentEmployeeID = txtSignInEmployeeID.value;

        // Close the modal.

        divSignIn.style.display = "none";

        successCallback();
    }
}
