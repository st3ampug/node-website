// Variables ===========================================================================
const updateDeviceAPI   = "http://Sample-env.6yes34pbka.eu-west-1.elasticbeanstalk.com:3001/api/devices";

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

var table               = document.getElementById(INVENTORYTABLEID);

// =====================================================================================

// Event Listeners =====================================================================
//window.onload = function() {
window.addEventListener('load', function(){
    console.log("onload");
    initDataTableMaximum(INVENTORYTABLEID);

    var rows = document.getElementById(INVENTORYTABLEID).getElementsByTagName("tr");
    for(var i = 1; i < rows.length; i++) {
        console.log(rows[i].getAttribute("id"));
    }

    table.addEventListener('click', function(ev) {
        if(ev.target.tagName.toLowerCase() == "td") {
            console.log(ev.target.tagName.toLowerCase() + " >> " + ev.target.parentNode.id);
            selectDevice(ev.target.parentNode.id);
        }
        if(ev.target.tagName.toLowerCase() == "tr") {
            console.log(ev.target.id);
        }
    });
});

// =====================================================================================

// Helpers =============================================================================

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