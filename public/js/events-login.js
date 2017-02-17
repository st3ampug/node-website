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
const LOGINSPINNER      = "loginSpinner";
const LOGINTOP          = "loginTop";
const LOGINMIDDLE       = "loginMiddle";

var loginEmailField         = document.getElementById(LOGINEMAIL);
var loginPasswordField      = document.getElementById(LOGINPW);
var loginButton             = document.getElementById(LOGINBTN);
var loginMessageArea        = document.getElementById(LOGINMSG);

// =====================================================================================

// Event Listeners =====================================================================

window.addEventListener('load', function(){
    console.log("onload");

    elementVisibilityON(CONTAINER);
    elementVisibilityOFF(NAVBARLINKS);

    setCookie(URLCOOKIE, window.location.href, 999);
    loginCookieValidate();

    window.addEventListener("keypress", function(e) {
        if(e.which == 13) {
            if(validateLoginForm()) {
                var userJson = {
                    Email: loginEmailField.value.toLowerCase(),
                    Secret: loginPasswordField.value
                };
                loginApiPost(userJson);
            }
        }
    });

    loginButton.addEventListener('click', function() {
        if(validateLoginForm()) {
            var userJson = {
                Email: loginEmailField.value.toLowerCase(),
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
            if( Object.prototype.toString.call( response ) === '[object Array]' ) {
                if(response.length > 0) {
                    loginMessageArea.innerText = "Validation successful, waiting for login";
                    showSpinner();
                    updateUserPost(json);
                } else {
                    loginMessageArea.innerText = "Validation failed";
                }
            } else {
                loginMessageArea.innerText = "Validation failed";
            }
        },
        error: function() {
            loginMessageArea.innerText = "Validation failed";
        }
    });
}

function updateUserPost(json) {
    var localjson = {
        Email: json.Email.toLowerCase(),
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
            redirectPage("home");
            
        },
        error: function() {
            loginMessageArea.innerText = "Updating user entry failed";
        }
    });
}

function loginCookieValidate() {
    showSpinner();
    if(loginCookiePresent()) {
        cookie = getCookie(LOGINCOOKIE).split(COOKIEDELIMITER);
        var json = {
            Email: cookie[0]
        }

        $.ajax({
            url: passcheckAPI,
            type: 'POST',
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            xhrFields: {
                withCredentials: false
            },
            data: JSON.stringify(json),
            timeout: 1500,
            success: function(response) {
                console.log("Pass check successful");
                let json = response;
                if(typeof(json.LoggedIn) !== 'undefined') {
                    if (json.LoggedIn === cookie[1]) {
                        
                        console.log("GREAT SUCCESS");
                        redirectPage("home");
                        
                        
                    } else {
                        console.log("Pass check unsuccessful");
                        hideSpinner();
                    }
                } else {
                    console.log("Pass check unsuccessful");
                    hideSpinner();
                }
            },
            error: function() {
                console.log("Pass check unsuccessful");
                hideSpinner();
            }
        });
    } else {
        console.log("Pass check unsuccessful");
        hideSpinner();
    }
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

function showSpinner() {
    elementVisibilityOFF(LOGINTOP);
    elementDisplayNone(LOGINMIDDLE);
    elementDisplayBlock(LOGINSPINNER);
}

function hideSpinner() {
    elementVisibilityON(LOGINTOP);
    elementDisplayBlock(LOGINMIDDLE);
    elementDisplayNone(LOGINSPINNER);
}

// =====================================================================================