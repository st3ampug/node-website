// Variables ===========================================================================
// const updateDeviceAPI   = SERVERURL + ":" + SERVERPORT + "/api/devices";
// const updateUserAPI     = SERVERURL + ":" + SERVERPORT + "/api/users";
// const getLogsAPI        = SERVERURL + ":" + SERVERPORT + "/api/log";

const LOGSTABLEID       = "logsTable";



// =====================================================================================

// Event Listeners =====================================================================
//window.onload = function() {
window.addEventListener('load', function(){
    console.log("onload");

    
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