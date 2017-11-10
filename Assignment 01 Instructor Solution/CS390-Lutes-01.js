// Copyright 2017 Kyle Lutes

/// <reference path="CS390-Lutes-01.htm"/>

// Global variables.

var gCheckAmount;
var gSalesTaxPct;
var gTipPct;
var gSalesTaxAmount;
var gTipAmount;

function body_onload() {

    btnTipPreTax.onclick = btnTipPreTax_onclick;
    btnTipOnTotal.onclick = btnTipOnTotal_onclick;

    txtSalesTaxPct.value = "7.0";
    txtTipPct.value = "15";
}

function btnTipPreTax_onclick() {

    if (validateAndGetInput() === false) {
        return;
    }

    gSalesTaxAmount = gCheckAmount - (gCheckAmount / (1 + (gSalesTaxPct / 100)));

    gTipAmount = (gCheckAmount - gSalesTaxAmount) * (gTipPct / 100);

    displayOutput();
}

function btnTipOnTotal_onclick() {

    if (validateAndGetInput() === false) {
        return;
    }

    gSalesTaxAmount = gCheckAmount - (gCheckAmount / (1 + (gSalesTaxPct / 100)));

    gTipAmount = gCheckAmount * (gTipPct / 100);

    displayOutput();
}

function validateAndGetInput() {

    const badCheckAmount  = "Check Amount is required and must be a valid number > zero.";
    const badSalesTaxPct  = "Sales Tax Percent is required and must be a valid number > zero.";
    const badTipPct       = "Tip Percent is required and must be a valid number > zero.";

    if (tryParse(txtCheckAmount.value, 2) === false) {
        alert(badCheckAmount);
        txtCheckAmount.focus();
        return false;
    }

    gCheckAmount = parseFloat(txtCheckAmount.value);

    if (gCheckAmount < 0) {
        alert(badCheckAmount);
        txtCheckAmount.focus();
        return false;
    }

    if (tryParse(txtSalesTaxPct.value, 2) === false) {
        alert(badSalesTaxPct);
        txtSalesTaxPct.focus();
        return false;
    }

    gSalesTaxPct = parseFloat(txtSalesTaxPct.value);

    if (gSalesTaxPct < 0) {
        alert(badSalesTaxPct);
        txtSalesTaxPct.focus();
        return false;
    }

    if (tryParse(txtTipPct.value, 2) === false) {
        alert(badTipPct);
        txtTipPct.focus();
        return false;
    }

    gTipPct = parseFloat(txtTipPct.value);

    if (gTipPct < 0) {
        alert(badTipPct);
        txtTipPct.focus();
        return false;
    }

    return true;
}

function displayOutput() {

    txtCheckAmount.value    = gCheckAmount.toFixed(2);
    txtSalesTaxPct.value    = gSalesTaxPct.toFixed(2);
    txtTipPct.value         = gTipPct.toFixed(2);
    txtSalesTaxAmount.value = gSalesTaxAmount.toFixed(2);
    txtTipAmount.value      = gTipAmount.toFixed(2);
}

// The function returns true if the input string can be converted to a number.
// Rules for the input string are:
//  1) Must not be an empty string.
//  2) Can contain only number characters 0 through 9.
//  3) Contains at most one dot character to indicate the decimal position.
//  4) If a hyphen is present it is the first character in the string (because the JavaScript parseFloat 
//     function ignores a trailing hyphen).
//  5) Does not contain more decimal places indicated by the maxDecimals parameter.

function tryParse(stringValue, maxDecimals) {
    var char;
    var dotFound = false;
    var numberDecimals = 0;

    if (stringValue === "") {
        return false;
    }

    for (var i = 0; i < stringValue.length; i++) {

        char = stringValue.charAt(i);

        if (char === ".") {
            if (dotFound === true) {
                return false;
            }
            dotFound = true;
        }
        else if (char === "-") {
            if (i > 0) {
                return false;
            }
        }
        else if (char < "0" || char > "9") {
            return false;
        }
        else {

            // If we get here, we must have a number character.  Make sure we haven't found
            // too many decimal positions.

            if (dotFound === true) {
                numberDecimals++;
                if (numberDecimals > maxDecimals) {
                    return false;
                }
            }
        }
    }

    // If we get here, the value is OK.

    return true;
}