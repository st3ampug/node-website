// Variables ===========================================================================
// const updateDeviceAPI   = SERVERURL + ":" + SERVERPORT + "/api/devices";
// const updateUserAPI     = SERVERURL + ":" + SERVERPORT + "/api/users";
// const getLogsAPI        = SERVERURL + ":" + SERVERPORT + "/api/log";

const LOGINEMAIL    = "loginEmail";
const LOGINPW       = "loginPassword";
const LOGINBTN      = "loginButton";
const LOGINMSG      = "loginMessage";
const REGISTERNAME  = "registerName";
const REGISTEREMAIL = "registerEmail";
const REGISTERPW    = "registerPassword";
const REGISTERBTN   = "registerButton";
const REGISTERMSG   = "registerMessage";

var loginEmailField         = document.getElementById(LOGINEMAIL);
var loginPasswordField      = document.getElementById(LOGINPW);
var loginButton             = document.getElementById(LOGINBTN);
var loginMessageArea        = document.getElementById(LOGINMSG);
var registerNameField       = document.getElementById(REGISTERNAME);
var registerEmailField      = document.getElementById(REGISTEREMAIL);
var registerPasswordField   = document.getElementById(REGISTERPW);
var registerButton          = document.getElementById(REGISTERBTN);
var registerMessageArea     = document.getElementById(REGISTERMSG);


// =====================================================================================

// Event Listeners =====================================================================
//window.onload = function() {
window.addEventListener('load', function(){
    console.log("onload");

    // passcheck call added to the api server
    // on load check the pass cookie
    // pass cookie should have *email*;*passcodething*
    // if cookie is not present, navigate to the loginButton
    // if cookie is there, call the passcheck, compare the 2 passes, let the user nav to home if equals
    // home and admin should check for the cookie with the api call to show info (and navbar links)
    // inventory and users should just check if the cookie is present

    // when login is needed, use the login call
    // when all is good, create the cookie with the pass and update the user with the pass

    loginButton.addEventListener('click', function() {
        if(validateLoginForm()) {
            //...
        }
    });

    registerButton.addEventListener('click', function() {
        if(validateRegisterForm()) {
            submitNewUser();
        }
    });

    
});

// =====================================================================================

// Helpers =============================================================================

function validateLoginForm() {
    var useremail = loginEmailField.value;
    var userpw = loginPasswordField.value;

    if(userpw != "" && useremail != ""){
        return true;
    } else {
        loginMessageArea.innerText = "Fields don't appear to be populated correctly";
        return false;
    }
}

function submitNewUser() {
    var userJson = {
        Name: registerNameField.value,
        Email: registerEmailField.value,
        PasswordHash: hashMyPassword(registerPasswordField.value),
        State: "active"
    };
    console.log(userJson);

    $.ajax({
        url: updateUserAPI,
        type: 'PUT',
        dataType: 'json',
        data: userJson,
        timeout: 1500,
        success: function(response) {
            console.log(response);
            modalMessageUser.innerText = "User submission successful";
        },
        error: function() {
            modalMessageUser.innerText = "User submission failed";
        }
    });
}

function hashMyPassword(pw) {
    var bcrypt = dcodeIO.bcrypt;
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(pw, salt);

    return hash;
}

function validateRegisterForm() {
    var username = registerNameField.value;
    var useremail = registerEmailField.value;
    var userpw = registerPasswordField.value;

    if(userpw != "" && useremail != "" && username != ""){
        return true;
    } else {
        registerMessageArea.innerText = "Fields don't appear to be populated correctly";
        return false;
    }
}

function checkContent(value) {
    if(value != "") {
        return value;
    } else {
        return "-";
    }
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

$.fn.redraw = function(){
  $(this).each(function(){
    var redraw = this.offsetHeight;
  });
};

function initDataTableDefault(id) {
    $("#" + id).DataTable();
}

function initDataTableMinimal(id) {
    $("#" + id).DataTable({
        "paging":   false,
        "ordering": true,
        "info":     false
    });
}

function initDataTableMedium(id) {
    $("#" + id).DataTable({
        "paging":   true,
        "ordering": true,
        "info":     false
    });
}

function initDataTableMaximum(id) {
    $("#" + id).DataTable({
        "paging":   true,
        "ordering": true,
        "info":     true
    });
}

// =====================================================================================