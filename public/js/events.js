// Variables ===========================================================================
const SELECTED          = "selected";
const NOTSELECTED       = "no";
const TABLEID           = "devicesTable";
const DROPDOWNBUTTONID  = "dropdownUsersButton";
const DROPDOWNULID      = "dropdownUsersList";
const ASSIGNBUTTON      = "assignToUser";
const USERCOOKIE        = "selected-user";
const CARETSPAN         = "<span class='caret'></span>"

var table = document.getElementById(TABLEID);
var usersbutton = document.getElementById(DROPDOWNBUTTONID);
var dropdown = document.getElementById(DROPDOWNULID);
var assignbutton = document.getElementById(ASSIGNBUTTON);

var saveduser = "";
var selecteduser = usersbutton.getAttribute("name");

// =====================================================================================

// Event Listeners =====================================================================
window.onload = function() {
    console.log("onload");
    // read cookie
    checkUserCookie();
    setUserButtonText(saveduser);
    changeAssignState();

    var rows = document.getElementById(TABLEID).getElementsByTagName("tr");
    for(var i = 1; i < rows.length; i++) {
        console.log(rows[i].getAttribute("id"));
    }
};

dropdown.addEventListener('click', function(ev) {
    if (ev.target !== ev.currentTarget) {
        var clickedItem = ev.target;
        console.log(clickedItem.text);
        if(clickedItem.parentNode.getAttribute("class") != "disabled") {
            setCookie(USERCOOKIE, clickedItem.text, 999);
            setUserButtonText(clickedItem.text);
        }
    }
    $('.dropdown.open .dropdown-toggle').dropdown('toggle');

    ev.stopPropagation();
});

table.addEventListener('click', function(ev) {
    if(ev.target.tagName.toLowerCase() == "td") {
        console.log(ev.target.tagName.toLowerCase() + " >> " + ev.target.parentNode.id);
        selectDevice(ev.target.parentNode.id);
    }
    if(ev.target.tagName.toLowerCase() == "tr") {
        console.log(ev.target.id);
    }
    changeAssignState();
});

// =====================================================================================

// Helpers =============================================================================
function selectDevice(id) {
    var row = document.getElementById(id);
    if(row.getAttribute(SELECTED) != SELECTED)
        row.setAttribute(SELECTED, SELECTED);
    else
        row.setAttribute(SELECTED, NOTSELECTED);
}

function setUserButtonText(name) {
    if(name != "") {
        //usersbutton.innerHTML = name;
        usersbutton.innerHTML = name + " " + CARETSPAN;
        usersbutton.setAttribute("name", name);
        selecteduser = name;
    }
}

function checkUserName (name) {
    var found = false;
    var lis = dropdown.getElementsByTagName("li");
    for(var i = 0; i < lis.length; i++) {
        if((lis[i].firstChild.text == name) && (lis[i].getAttribute("class") != "disabled"))
            found = true;
    }
    return found;
}

function changeAssignState() {
    var anyselected = false;
    var trs = table.getElementsByTagName("tr");
    for(var i = 0; i < trs.length; i++) {
        if(trs[i].getAttribute("selected") == "selected")
            anyselected = true;
    }
    if(anyselected)
        $('#assignToUser').removeClass("disabled");
    else
        $('#assignToUser').addClass("disabled");
}

function checkUserCookie() {
    console.log("Attempting to check cookie's content");
    
    var cookiecontent = getCookie(USERCOOKIE);
    console.log("Cookie's content: " + cookiecontent);

    if(cookiecontent != "" && checkUserName(cookiecontent)) {
        saveduser = cookiecontent;
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

// =====================================================================================