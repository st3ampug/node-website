var MyGlobals = MyGlobals || {
    Devices: {},
    Users: {},

    saveDevices: function(devices) {
        this.Devices = devices;
        console.log("globals: Devices added:");
        console.log(this.Devices);
    },
    
    saveUsers: function(users) {
        this.Users = users;
        console.log("globals: Users added:");
        console.log(this.Users);
    }
}

module.exports = MyGlobals;