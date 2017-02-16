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

var table               = document.getElementById(INVENTORYTABLEID);

// =====================================================================================

// Event Listeners =====================================================================

window.addEventListener('load', function(){
    console.log("onload");
    
    loginCookieCheck();
    // UNDECIDED IF THIS SHOULD SHOW WITHOUT A LOGIN
    elementVisibilityON(CONTAINER);
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

function loginCookieCheck() {
    if(loginCookiePresent()) {
        elementVisibilityON(NAVBARLINKS);
        //elementVisibilityON(CONCTAINER);
    }
}

$.fn.redraw = function(){
  $(this).each(function(){
    var redraw = this.offsetHeight;
  });
};

// =====================================================================================