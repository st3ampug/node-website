// Variables ===========================================================================
const updateDeviceAPI   = "http://localhost:3001/api/devices";
const SELECTED          = "selected";
const NOTSELECTED       = "no";
const TABLEID           = "devicesTable";
const DROPDOWNBUTTONID  = "dropdownUsersButton";
const DROPDOWNULID      = "dropdownUsersList";
const ASSIGNBUTTON      = "assignToUser";
const RETURNBUTTON      = "returnItems";
const USERCOOKIE        = "selected-user";
const CARETSPAN         = "<span class='caret'></span>"
const LOCATIONTD        = "location";
const SUCCESS           = "success";
const CHARGING          = "Charging";

var table               = document.getElementById(TABLEID);
var usersbutton         = document.getElementById(DROPDOWNBUTTONID);
var dropdown            = document.getElementById(DROPDOWNULID);
var assignbutton        = document.getElementById(ASSIGNBUTTON);
var returnbutton        = document.getElementById(RETURNBUTTON);

var saveduser = "";
var selecteduser = usersbutton.getAttribute("name");

// =====================================================================================

// Event Listeners =====================================================================
window.onload = function() {
    console.log("onload");
    // read cookie
    checkUserCookie();
    setUserButtonText(saveduser);
    changeAssignState(ASSIGNBUTTON);
    changeReturnState(RETURNBUTTON);
    //initDataTable(TABLEID);

    var rows = document.getElementById(TABLEID).getElementsByTagName("tr");
    for(var i = 1; i < rows.length; i++) {
        console.log(rows[i].getAttribute("id"));
    }
};

assignbutton.addEventListener("click", function(ev) {
    var trs = document.getElementsByTagName("tr");
    var updated = false;
    
    if(trs.length > 1) {
        var reqJsons = [];
        for(var i = 1; i < trs.length; i++) {
            if(trs[i].getAttribute("selected") != "no") {
                var myJson = {
                    "Serial": trs[i].getAttribute("id"),
                    "DeviceName": trs[i].firstElementChild.innerText,
                    "CurrentLocation": usersbutton.getAttribute("name")
                }

                reqJsons.push(myJson);
            }
        }

        for(var j = 0; j < reqJsons.length; j++) {
            // send request for updating each row
            console.log("Request sent: " + reqJsons[j].Serial);

            $.post(updateDeviceAPI, reqJsons[j],
            function(data, status){
                console.log("Data: " + JSON.stringify(data) + "\nStatus: " + status);
                if(j == reqJsons.length) {
                    location.reload();
                }
            });
            updated = true;
        }
    } else {
        console.error("No devices were selected.");
    }

    if(updated) {
        //reDrawElementJQuery("#" + TABLEID);
    }
});

returnbutton.addEventListener("click", function(ev) {
    var trs = document.getElementsByTagName("tr");
    var updated = false;
    
    if(trs.length > 1) {
        var reqJsons = [];
        for(var i = 1; i < trs.length; i++) {
            if(trs[i].getAttribute("selected") != "no") {
                var myJson = {
                    "Serial": trs[i].getAttribute("id"),
                    "DeviceName": trs[i].firstElementChild.innerText,
                    "CurrentLocation": CHARGING
                }

                reqJsons.push(myJson);
            }
        }

        for(var j = 0; j < reqJsons.length; j++) {
            // send request for updating each row
            console.log("Request sent: " + reqJsons[j].Serial);

            $.post(updateDeviceAPI, reqJsons[j],
            function(data, status){
                console.log("Data: " + JSON.stringify(data) + "\nStatus: " + status);
                if(j == reqJsons.length) {
                    location.reload();
                }
            });
            updated = true;
        }
    } else {
        console.error("No devices were selected.");
    }

    if(updated) {
        //reDrawElementJQuery("#" + TABLEID);
    }
});

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
    changeAssignState(ASSIGNBUTTON);
    changeReturnState(RETURNBUTTON)

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
    changeAssignState(ASSIGNBUTTON);
    changeReturnState(RETURNBUTTON);
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

function changeAssignState(id) {
    var devicesselected = false;
    var userselected = false;
    var trs = table.getElementsByTagName("tr");
    
    for(var i = 0; i < trs.length; i++) {
        if(trs[i].getAttribute("selected") == "selected")
            devicesselected = true;
    }
    if(selecteduser != null) {
        userselected = true;
    }

    if(devicesselected && userselected)
        $('#' + id).removeClass("disabled");
    else
        $('#' + id).addClass("disabled");
}

function changeReturnState(id) {
    var devicesselected = false;
    var devicesassigned = false;
    var trs = table.getElementsByTagName("tr");
    
    for(var i = 0; i < trs.length; i++) {
        if(trs[i].getAttribute("selected") == "selected")
            devicesselected = true;
        if(trs[i].children[3].innerText == selecteduser)
            devicesassigned = true;
    }

    if(devicesselected && devicesassigned)
        $('#returnItems').removeClass("disabled");
    else
        $('#returnItems').addClass("disabled");
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

$.fn.redraw = function(){
  $(this).each(function(){
    var redraw = this.offsetHeight;
  });
};

function initDataTable(id) {
    $("#" + id).DataTable();
}

// =====================================================================================