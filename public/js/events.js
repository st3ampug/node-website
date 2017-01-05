var selectedDevices = [];
// CLEARS THE ARRAY....
// save in the dom instead
// or localstorage?


var table = document.getElementById("devicesTable");


table.addEventListener('click', function(ev) {
    if(ev.target.tagName.toLowerCase() == "td") {
        console.log(ev.target.tagName.toLowerCase() + " >> " + ev.target.parentNode.id);
        selectDevice(ev.target.parentNode.id);
    }
    if(ev.target.tagName.toLowerCase() == "tr") {
        console.log(ev.target.id);
    }
});

// Helpers
function selectDevice(id) {
    var exists = false;
    for(var i = 0; i < selectedDevices.length; i++) {
        if(selectedDevices[i] == id) {
            exists = true;
            selectedDevices.splice(i, 1);
        }
    }
    if(!exists)
        selectedDevices.add(id);
}