const express    = require('express')
const BodyParser = require('body-parser')

// Create a new HTTP server
const app        = express()

app.use(BodyParser.urlencoded({ extended: false }))
app.use(BodyParser.json())


app.set('port', (process.env.PORT || 3000));


let Commands = []
let ClientCurrentPosition = {}


//multiplayer
let disconectCheckDelay=10;
let disconectTimeout=3;
let vr_side_apps = new Map();

function detectTimeout() {
   for (let [ip, data] of vr_side_apps){
	   data.timeSinceUpdate++
	   if(data.timeSinceUpdate > disconectTimeout){
		   console.log("VR APP DISCONNECTED:", ip)
		   vr_side_apps.delete(ip)
	   }
   }
}
setInterval(detectTimeout, disconectCheckDelay*1000);


function getIp(req){
	return req.headers['x-forwarded-for'] || 
         req.connection.remoteAddress || 
         req.socket.remoteAddress || 
         req.connection.socket.remoteAddress;
}

//return current position (for the specified app)
app.get('/client-infos', function (req, res) {
	var appID = req.body.appid;
	console.log("CLIENT INFO : APPID=",req.body);
	if(vr_side_apps.has(appID)){
		res.set('Access-Control-Allow-Origin', '*')
		return res.status(200).json(vr_side_apps[appID].ClientCurrentPosition)
	}
	return res.status(404)
})


//return all connected VR apps
app.get('/clients-list', function (req, res) {
	res.set('Access-Control-Allow-Origin', '*');
	var VRApps = [];
	for(let [ip, data] of vr_side_apps){
		VRApps.push(ip);
    }
	return res.status(200).json(VRApps)
})


app.post('/client-infos', function (req, res) {
	var ip = getIp(req);
		 
	//ClientCurrentPosition = req.body
	
	if(!vr_side_apps.has(ip)){
		console.log("NEW CONNECTION FROM VR APP:", ip)
	}
	vr_side_apps.set(ip,{ClientCurrentPosition:req.body,Commands:[],timeSinceUpdate:0})



  
  /*console.log(
    "CLIENT",
    JSON.stringify(        
      req.body, null, 2
    )
  )*/
})


/*
// Endpoint /client
app.get('/client', function (req, res) {   
  res.set('Access-Control-Allow-Origin', '*');
  return res.status(200).json(Teleport)
})*/

app.get('/client', function (req, res) {    
    // if the array contains at least one element
	var appID = req.body.appid;
	if(!vr_side_apps.has(appID)){
		return res.status(404).end();
	}
	
    if (vr_side_apps[appID].Commands.length > 0) {
        // Pop the last element ( get last element, then remove from the array)
        const command = vr_side_apps[appID].Commands.shift()  //pop()
        // send the command
        
        console.log(
          "PUSHING",
          JSON.stringify(        
            command, null, 2
          )
        )
        
        res.json(
          command
        )
        res.status(200)
    } else {
      res.status(404)
    }
    res.end()
})

// Endpoint /client
// For every request, store a new command
app.post('/seller', function (req, res) {
	res.set('Access-Control-Allow-Origin', '*');
	var appID = req.body.appid;
	delete req.body.appid;
	
	if(!vr_side_apps.has(appID)){
		return res.status(404).end();
	}
	
	console.log("REQUEST FROM SELLER:",getIp(req))
	
	if (req.body.command === "Teleport") {
		console.log("PUSHING",JSON.stringify(req.body, null, 2))
		req.body.x = parseInt(req.body.x)
		req.body.y = parseInt(req.body.y)
		req.body.z = parseInt(req.body.z)
		req.body.rotation = parseInt(req.body.rotation)
		
		vr_side_apps[appID].Commands.push(req.body)
	
	}
  
  if (req.body.command === "ChangeStyle"){
	  console.log("PUSHING",JSON.stringify(req.body, null, 2))
	  vr_side_apps[appID].Commands.push(req.body)
  }
  
  res.status(200).end()
})




app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

