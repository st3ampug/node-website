// Variables ===========================================================================

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
const NAVBARLINKS       = "navbarLinks";
const CONTAINER         = "container";

var table               = document.getElementById(DEVICESTABLEID);
var usersbutton         = document.getElementById(DROPDOWNBUTTONID);
var dropdown            = document.getElementById(DROPDOWNULID);
var assignbutton        = document.getElementById(ASSIGNBUTTON);
var returnbutton        = document.getElementById(RETURNBUTTON);

var saveduser = "";
var selecteduser = usersbutton.getAttribute("name");

// =====================================================================================

// Event Listeners =====================================================================

window.addEventListener('load', function(){
    console.log("onload");
    // read cookie
    loginCookieValidate();

    checkUserCookie();
    setUserButtonText(saveduser);
    changeAssignState(ASSIGNBUTTON);
    changeReturnState(RETURNBUTTON);
    initDataTableMinimal(DEVICESTABLEID);

    var rows = document.getElementById(DEVICESTABLEID).getElementsByTagName("tr");
    for(var i = 1; i < rows.length; i++) {
        console.log(rows[i].getAttribute("id"));
    }


    assignbutton.addEventListener("click", function(e) {
        //alert("touch");
        assignAction(ASSIGNBUTTON, usersbutton.getAttribute("name"));
        e.preventDefault();
    });

    returnbutton.addEventListener("click", function(e) {
        assignAction(RETURNBUTTON, CHARGING);
        e.preventDefault();
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
});




function assignAction(button, username) {
    if(!$('#' + button).hasClass('disabled')) {
        var trs = document.getElementsByTagName("tr");
        var updated = false;
        
        if(trs.length > 1) {
            var reqJsons = [];
            for(var i = 1; i < trs.length; i++) {
                if(trs[i].getAttribute("selected") != "no") {
                    var myJson = {
                        "Serial": trs[i].getAttribute("id"),
                        "DeviceName": trs[i].firstElementChild.innerText,
                        "CurrentLocation": username
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
    } else {
        console.log("button was disabled");
    }
}

// =====================================================================================

// Helpers =============================================================================

function loginCookieValidate() {
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
                        elementVisibilityON(NAVBARLINKS);
                        elementVisibilityON(CONTAINER);
                        
                        
                    } else {
                        redirectPageSaved("");
                    }
                } else {
                    redirectPageSaved("");
                }
            },
            error: function() {
                redirectPageSaved("");
            }
        });
    } else {
        console.log("Pass check unsuccessful");
        redirectPageSaved("");
    }
}

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
        if(trs[i].children[4].innerText == selecteduser)
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

$.fn.redraw = function(){
  $(this).each(function(){
    var redraw = this.offsetHeight;
  });
};

// =====================================================================================