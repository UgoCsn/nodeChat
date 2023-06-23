const express = require('express');
const app = express();
const port = 19000
const bodyParser = require('body-parser')
require('dotenv').config();
const {client, main} = require('./database');
const userRoutes = require('./routes/userRoutes')
const cors = require('cors');
app.use(cors())

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
// app.use s'applique sur toutes les routes
app.use(bodyParser.json())


main()
  .then(async (db)=>{

    
    userRoutes(app, db)

    app.listen(port, ()=>{
        console.log('connecté au port '+port)
    })
  })
  .catch(console.error)


