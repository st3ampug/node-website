// Variables ===========================================================================
const updateDeviceAPI   = "http://Sample-env.6yes34pbka.eu-west-1.elasticbeanstalk.com:3001/api/devices";
const updateUserAPI     = "http://Sample-env.6yes34pbka.eu-west-1.elasticbeanstalk.com:3001/api/users";

const SELECTED          = "selected";
const NOTSELECTED       = "no";
const DEVICESTABLEID    = "devicesTable";
const USERSTABLEID      = "usersTable";
const INVENTORYTABLEID  = "inventoryTable";
const DROPDOWNBUTTONID  = "dropdownUsersButton";
const DROPDOWNULID      = "dropdownUsersList";
const ASSIGNBUTTON      = "assignToUser";
const RETURNBUTTON      = "returnItems";
const USERCOOKIE        = "selected-user";
const CARETSPAN         = "<span class='caret'></span>"
const LOCATIONTD        = "location";
const SUCCESS           = "success";
const CHARGING          = "Charging";
const MODALID           = "addUserModal";
const MODALFORM         = "modalForm";
const MODALUSERNAME     = "userName";
const MODALUSEREMAIL    = "userEmail";
const MODALSUBMIT       = "modalSubmit";
const MODALMESSAGE      = "modalMessage";
const ADDNEWUSERBUTTON  = "addNewUser";

var modal               = document.getElementById(MODALID);
var modalForm           = document.getElementById(MODALFORM);
var modalUserName       = document.getElementById(MODALUSERNAME);
var modalUserEmail      = document.getElementById(MODALUSEREMAIL);
var modalSubmit         = document.getElementById(MODALSUBMIT);
var modalMessage        = document.getElementById(MODALMESSAGE);
var buttonAddNewUser    = document.getElementById(ADDNEWUSERBUTTON);

// =====================================================================================

// Event Listeners =====================================================================
//window.onload = function() {
window.addEventListener('load', function(){
    console.log("onload");

    buttonAddNewUser.addEventListener('click', function(){
        modalMessage.innerText = "";
    });

    modalSubmit.addEventListener('click', function() {
        submitNewUser();
    });
});

// =====================================================================================

// Helpers =============================================================================

function submitNewUser() {
    var username = modalUserName.value;
    var useremail = modalUserEmail.value;

    var userJson = {
        Name: username,
        Email: useremail,
        State: "active"
    };

    console.log(userJson);

    if(username != "" && useremail != ""){
        $.ajax({
            url: updateUserAPI,
            type: 'PUT',
            dataType: 'json',
            data: userJson,
            timeout: 1500,
            success: function(response) {
                console.log(response);
                modalMessage.innerText = "User submission successful";
            },
            error: function() {
                modalMessage.innerText = "User submission failed";
            }
        });
    } else {
        modalMessage.innerText = "Fields don't appear to be populated correctly";
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