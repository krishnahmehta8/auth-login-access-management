//MAIN FILE FOR STARTING THE SERVER

const mongoose = require('mongoose')
const express = require('express');
const options = { promiseLibrary: mongoose.Promise };
// const authJWT = require('./auth');
//import routes file
const router = require('./routes/routerhandler');


const app = express();
app.use(express.json());
// app.use(authJWT.authJWT);


// All routes defined
app.use('/',router);


//server start
const port = 3000; // PORT ON WHICH APPLICATION IS RUNNING
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
  console.info(`App is listen on server http://localhost:${port}/...`);
});
const mongouri ='mongodb://127.0.0.1:27017/DummyDb'; //DB cONFIGURATION
console.log('connecting to db '+ mongouri);
mongoose.Promise = require('bluebird');
const connection = mongoose.connect((mongouri), options);
    mongoose.connection.on('error', (error) => { //DB CONNECTION
        console.log(error);
        console.log('MongoDB connection error. Please make sure MongoDB is running.');
        process.exit();
    });
    mongoose.connection.on('connected', function () {   //DB CONNECTION MESSAGE PRINTING
      console.log(`Database connection open to ${mongoose.connection.host} ${mongoose.connection.name}`);
    }); 
    mongoose.connection.on('disconnected', function () {  //DB dISCONNECTED
      console.log('Mongoose default connection disconnected'); 
    });

    