const SERVERURL = "http://52.210.163.110";
// const SERVERURL = "localhost";
const SERVERPORT = "3001";

const updateDeviceAPI   = SERVERURL + ":" + SERVERPORT + "/api/devices";
const newUserAPI        = SERVERURL + ":" + SERVERPORT + "/api/users";
const updateUserAPI     = SERVERURL + ":" + SERVERPORT + "/api/update-user";
const getLogsAPI        = SERVERURL + ":" + SERVERPORT + "/api/log";
const loginAPI          = SERVERURL + ":" + SERVERPORT + "/api/login";
const passcheckAPI      = SERVERURL + ":" + SERVERPORT + "/api/passcheck";

const LOGINCOOKIE = "login";
const URLCOOKIE = "url";
const COOKIEDELIMITER = "|";

function randomString() {
    return Math.random().toString(36).substring(7);
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

function elementVisibilityON(id) {
    $("#" + id).css('visibility', 'visible');
}

function elementVisibilityOFF(id) {
    $("#" + id).css('visibility', 'hidden');
}

function elementDisplayBlock(id) {
    $("#" + id).css('display', 'block');
}

function elementDisplayNone(id) {
    $("#" + id).css('display', 'none');
}

function redirectPage(page) {
    currurl = window.location.href;
    if(currurl.slice(-1) != "/") {
        currurl += "/";
    }
    window.location.replace(currurl + page);
}

function redirectPageSaved(page) {
    if(getCookie(URLCOOKIE) !== "") {
        currurl = getCookie(URLCOOKIE);
        if(currurl.slice(-1) != "/") {
            currurl += "/";
        }
        window.location.replace(currurl + page);
    }
}

function loginCookiePresent() {
    if(getCookie(LOGINCOOKIE) !== "") {
        return true;
    } else {
        return false;
    }
}