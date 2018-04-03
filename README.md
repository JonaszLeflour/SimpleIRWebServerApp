|# Impact VR - master
## What we want

We want a **seller** to be able to control where the **client** will be in a VR appartment. For that, we need a web site, where the **seller** will be able to see where the **client** is located in realtime and be able to teleport the **client**.

## How it is going to work

The **client** visualisation is done on Unreal Engine 4. The **seller** view will be a simple web page with a mini map and a marker with where the **client** is currently.

Technically speaking, we are going to use polling, which means, that we are going to use a simple HTTP server, using **nodejs** that will make the interface between Unreal Engine and the web page.

Each of them are going to poll the server for information every n seconds. 

So every n seconds :

* Unreal Engine Software is going to call an endpoint on the web server to see if it need to teleport. While doing that will also send back information about location.
* The backend server will reply to Unreal Engine request with some data to see if it needs teleportation and store the current position of the client.
* The web page will poll the backend server every n seconds as well to know the position of the client. 
* When the seller click on the mini map, the web page will send a teleportation order to the backend.


## Server side component ( backend )
Backend is going to use nodejs as well as **express** to create a simple web server.

### install
* Download a version of [nodejs](https://nodejs.org/en/download/).
* Install.
* Clone or copy the folder with the server code.
* Launch a command line, go to the folder that contains the server code.
* type `npm install`
* type `npm start`
* type `nodemon` instead `npm start`
* -Heroku- 
* Source tree app (google it)


### PlayCanvas - Javascript Code
------- Send positional data (X, Y, Z + Rotation(Z)) to the Seller - PlayCanvast -------

var Sfasaf = pc.createScript('sfasaf');

// initialize code called once per entity
Sfasaf.prototype.initialize = function() {
    console.log('running init');
};

var delay = 250; //250
var currentDelay = 0;

// update code called every frame
Sfasaf.prototype.update = function(dt) {
    if(currentDelay === 0 ) {
        currentDelay = Date.now();
    }
    
    var self = this;
    
    if(Date.now() > delay + currentDelay) {
        console.log('run script');
        
        currentDelay = 0;
        
        $.get( "http://localhost:3000/client-infos", function( data ) { //"http://localhost:3000/client-infos" https://aqueous-plateau-58732.herokuapp.com/client-infos
          console.log(data);
            var quat = new pc.Quat().setFromEulerAngles(0, (data.RotZ)-180, 0);
            
            self.entity.setPosition(-(data.Y), 0, data.X);
            self.entity.setRotation(quat.invert());
        });
    }
    
};


------- On Click mouse to teleport VR character (Send data to Client UE4) -------

//var ClickTeleport = pc.createScript('clickTeleport');
var ClickTeleport = pc.createScript('clickTeleport'); 
   
ClickTeleport.attributes.add('x', {
    type: 'number'
});

ClickTeleport.attributes.add('y', {
    type: 'number'
});

ClickTeleport.attributes.add('z', {
    type: 'number'
});

ClickTeleport.attributes.add('rotation', {
    type: 'number'
});

// initialize code called once per entity


ClickTeleport.prototype.initialize = function() {
    
    this.app.mouse.on(pc.EVENT_MOUSEDOWN, this.onMouseDown, this);
};



/*PickerFramebuffer.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            app.mouse.on(pc.input.EVENT_MOUSEDOWN, this.onSelect, this);
        },*/




// update code called every frame
ClickTeleport.prototype.update = function(dt) {
    
};

ClickTeleport.prototype.onMouseDown = function (event) {
    
    console.log(event);
    
    // If the left mouse button is pressed, change the cube color to red
    if (event.button === pc.MOUSEBUTTON_LEFT) {
        // this.entity.model.meshInstances[0].material = this.redMaterial.resource;
        console.log('clicked this');
        
        // this whole object will be returned when polling commands from unreal

         var data = {
            command: "Teleport", // this is the variable to check in unreal when getting the command from server
            x: this.x,
            y: this.y,
            z: this.z,
            rotation: this.rotation
        };
        
        $.ajax({
            type: "POST",
            url: "http://localhost:3000/seller",
            data: data,
            dataType: "JSON" 
        });
    }
}; 



