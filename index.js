const express    = require('express')
const BodyParser = require('body-parser')

// Create a new HTTP server
const app        = express()

app.use(BodyParser.urlencoded({ extended: false }))
app.use(BodyParser.json())

app.set('port', (process.env.PORT || 3000));

let Commands = []
let ClientCurrentPosition = {}


app.get('/client-infos', function (req, res) {   
  res.set('Access-Control-Allow-Origin', '*');
  return res.status(200).json(ClientCurrentPosition)
})


app.post('/client-infos', function (req, res) {   
  ClientCurrentPosition = req.body
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
    if (Commands.length > 0) {
        // Pop the last element ( get last element, then remove from the array)
        const command = Commands.shift()
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
  if (req.body.command === "Teleport") {
    console.log(
      "PUSHING",
      JSON.stringify(        
        req.body, null, 2
      )
    )

    req.body.x = parseInt(req.body.x)
    req.body.y = parseInt(req.body.y)
    req.body.z = parseInt(req.body.z)
    req.body.rotation = parseInt(req.body.rotation)

    Commands.push(req.body)
  }
  res.status(200).end()
})


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

