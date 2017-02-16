// Variables ===========================================================================

const LOGINEMAIL    = "loginEmail";
const LOGINPW       = "loginPassword";
const LOGINBTN      = "loginButton";
const LOGINMSG      = "loginMessage";
const REGISTERNAME  = "registerName";
const REGISTEREMAIL = "registerEmail";
const REGISTERPW    = "registerPassword";
const REGISTERBTN   = "registerButton";
const REGISTERMSG   = "registerMessage";
const NAVBARLINKS       = "navbarLinks";
const CONTAINER         = "container";

var loginEmailField         = document.getElementById(LOGINEMAIL);
var loginPasswordField      = document.getElementById(LOGINPW);
var loginButton             = document.getElementById(LOGINBTN);
var loginMessageArea        = document.getElementById(LOGINMSG);

// =====================================================================================

// Event Listeners =====================================================================
//window.onload = function() {
window.addEventListener('load', function(){
    console.log("onload");

    elementVisibilityON(CONTAINER);
    elementVisibilityOFF(NAVBARLINKS);

    // passcheck call added to the api server
    // on load check the pass cookie
    // pass cookie should have *email*;*passcodething*
    // if cookie is not present, navigate to the loginButton
    // if cookie is there, call the passcheck, compare the 2 passes, let the user nav to home if equals
    // home and admin should check for the cookie with the api call to show info (and navbar links)
    // inventory and users should just check if the cookie is present

    // when login is needed, use the login call
    // when all is good, create the cookie with the pass and update the user with the pass

    if(loginCookiePresent()) {
        redirectPage("home");
    }

    loginButton.addEventListener('click', function() {
        if(validateLoginForm()) {
            var userJson = {
                Email: loginEmailField.value,
                Secret: loginPasswordField.value
            };
            loginApiPost(userJson);
        }
    });

    // registerButton.addEventListener('click', function() {
    //     if(validateRegisterForm()) {
    //         submitNewUser();
    //     }
    // });

    
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

function loginApiPost(json) {

    $.ajax({
        url: loginAPI,
        type: 'POST',
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        xhrFields: {
            withCredentials: false
        },
        data: JSON.stringify(json),
        timeout: 1500,
        success: function(response) {
            console.log(response);
            loginMessageArea.innerText = "Validation successful, waiting for login";
            updateUserPost(json);
        },
        error: function() {
            loginMessageArea.innerText = "Validation failed";
        }
    });
}

function updateUserPost(json) {
    var localjson = {
        Email: json.Email,
        LoginCode: randomString()
    }

    $.ajax({
        url: updateUserAPI,
        type: 'POST',
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        xhrFields: {
            withCredentials: false
        },
        data: JSON.stringify(localjson),
        timeout: 1500,
        success: function(response) {
            console.log(response);
            setCookie(LOGINCOOKIE, localjson.Email + COOKIEDELIMITER + localjson.LoginCode, 30);
            setCookie(URLCOOKIE, window.location.href, 999);
            redirectPage("home");
            
        },
        error: function() {
            loginMessageArea.innerText = "Updating user entry failed";
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