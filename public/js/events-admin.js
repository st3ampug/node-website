// Variables ===========================================================================
const updateDeviceAPI   = SERVERURL + ":" + SERVERPORT + "/api/devices";
const updateUserAPI     = SERVERURL + ":" + SERVERPORT + "/api/users";
const getLogsAPI        = SERVERURL + ":" + SERVERPORT + "/api/log";

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
const MODALUSERNAME     = "userName";
const MODALUSEREMAIL    = "userEmail";
const MODALSUBMITUSER   = "modalSubmitUser";
const MODALMESSAGEUSER  = "modalMessageUser";
const ADDNEWUSERBUTTON  = "addNewUser";
const ADDNEWDEVICEBUTTON= "addNewDevice";
const DEVICENAMEID      = "deviceName";
const DEVICESERIALID    = "deviceSerial";
const DEVICEOSTYPE      = "deviceOSType";
const DEVICEOSVERSIONID = "deviceOSVersion";
const DEVICEIMEIID      = "deviceImei";
const DEVICEMACADDRID   = "deviceMacAddress";
const DEVICEMODELID     = "deviceModelNumber";
const DEVICEOWNERID     = "deviceOwner";
const DEVICENOTESID     = "deviceNotes";
const MODALSUBMITDEVICE = "modalSubmitDevice";
const MODALMESSAGEDEVICE= "modalMessageDevice";

var modalUserName       = document.getElementById(MODALUSERNAME);
var modalUserEmail      = document.getElementById(MODALUSEREMAIL);
var modalSubmitUser     = document.getElementById(MODALSUBMITUSER);
var modalMessageUser    = document.getElementById(MODALMESSAGEUSER);
var buttonAddNewUser    = document.getElementById(ADDNEWUSERBUTTON);

var modalSubmitDevice   = document.getElementById(MODALSUBMITDEVICE);
var modalMessageDevice  = document.getElementById(MODALMESSAGEDEVICE);
var buttonAddNewDevice  = document.getElementById(ADDNEWDEVICEBUTTON);
var modalDeviceName     = document.getElementById(DEVICENAMEID);
var modalDeviceSerial     = document.getElementById(DEVICESERIALID);
var modalDeviceOSType     = document.getElementById(DEVICEOSTYPE);
var modalDeviceOSVersion     = document.getElementById(DEVICEOSVERSIONID);
var modalDeviceImei     = document.getElementById(DEVICEIMEIID);
var modalDeviceMACAddr     = document.getElementById(DEVICEMACADDRID);
var modalDeviceModel     = document.getElementById(DEVICEMODELID);
var modalDeviceOwner     = document.getElementById(DEVICEOWNERID);
var modalDeviceNotes     = document.getElementById(DEVICENOTESID);


// =====================================================================================

// Event Listeners =====================================================================
//window.onload = function() {
window.addEventListener('load', function(){
    console.log("onload");

    buttonAddNewUser.addEventListener('click', function(){
        modalMessageUser.innerText = "";
    });

    modalSubmitUser.addEventListener('click', function() {
        if(validateUserModalForm())
            submitNewUser();
    });

    buttonAddNewDevice.addEventListener('click', function(){
        modalMessageDevice.innerText = "";
    });

    modalSubmitDevice.addEventListener('click', function() {
        if(validateDeviceModalForm())
            submitNewDevice();
    });
});

// =====================================================================================

// Helpers =============================================================================

function validateUserModalForm() {
    var username = modalUserName.value;
    var useremail = modalUserEmail.value;

    if(username != "" && useremail != ""){
        return true;
    } else {
        modalMessageUser.innerText = "Fields don't appear to be populated correctly";
        return false;
    }
}

function submitNewUser() {
    var userJson = {
        Name: modalUserName.value,
        Email: modalUserEmail.value,
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

function validateDeviceModalForm() {
    var devicename = modalDeviceName.value;
    var deviceserial = modalDeviceSerial.value;

    if(devicename != "" && deviceserial != ""){
        return true;
    } else {
        modalMessageDevice.innerText = "Fields don't appear to be populated correctly";
        return false;
    }
}

function submitNewDevice() {
    var devicename = modalDeviceName.value;
    var deviceserial = modalDeviceSerial.value;
    var deviceos = checkContent(modalDeviceOSType.value);
    var deviceosversion = checkContent(modalDeviceOSVersion.value);
    var deviceimei = checkContent(modalDeviceImei.value);
    var devicemac = checkContent(modalDeviceMACAddr.value);
    var devicemodel = checkContent(modalDeviceModel.value);
    var deviceowner = checkContent(modalDeviceOwner.value);
    var devicenotes = checkContent(modalDeviceNotes.value);

    var deviceJson = {
        Serial: deviceserial,
        DeviceName: devicename,
        CurrentLocation: "Charging",
        Imei: deviceimei,
        MACAddress: devicemac,
        Model: devicemodel,
        OS: deviceos,
        Owner: deviceowner,
        Version: deviceosversion,
        Notes: devicenotes
    };
    console.log(deviceJson);

    $.ajax({
        url: updateDeviceAPI,
        type: 'PUT',
        dataType: 'json',
        data: deviceJson,
        timeout: 1500,
        success: function(response) {
            console.log(response);
            modalMessageDevice.innerText = "Device submission successful";
        },
        error: function() {
            modalMessageDevice.innerText = "Device submission failed";
        }
    });
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