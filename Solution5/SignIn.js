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

        signinEmployee(txtSignInEmployeeID.value, txtPassword.value, signinSuccess);

        function signinSuccess() {

            // Save the Sign In state for the next time someone signs in.

            localStorageSet("Remember", chkRemember.checked);

            if (chkRemember.checked === true) {
                localStorageSet("EmployeeID", txtSignInEmployeeID.value);
            }
            else {
                localStorageSet("EmployeeID", "");
            }

            // Save the signed in employee so we can use when querying entries.

            gCurrentEmployeeID = txtSignInEmployeeID.value;

            // Close the modal.

            divSignIn.style.display = "none";

            successCallback();
        }
    }
}
