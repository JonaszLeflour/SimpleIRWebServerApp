# Impact VR - master
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
