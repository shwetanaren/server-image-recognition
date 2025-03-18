
// Importing Express and other apps:
import express from "express"
import bcrypt from "bcryptjs";
import cors from 'cors';
import knex from 'knex';
import fetch from 'node-fetch';
import pg from 'pg';
import * as signin from './controllers/signin.js';
import * as register from './controllers/register.js';
import * as profile from './controllers/profile.js';
import * as image from './controllers/image.js';
import * as clarifai from './controllers/clarifai.js';

const clarifaiKey = process.env.CLARFAI_KEY;

//Initialize an Express application:
const app = express();



// Or, to restrict it to your Netlify domain:
app.use(cors({
    origin: 'https://fancy-genie-6f67ae.netlify.app'
  }));
  


//Defining a Port: Setting a port number for the server to listen on.

const PORT = process.env.PORT || 3000;

// //Adding the cors middleware to be used before the routes. This enables cross origin resource sharing by default.
// app.use(cors());

// 3️⃣ Database connection (Railway DATABASE_URL)
const db = knex({
    client: "pg",
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    },
  });

  app.get('/test', (req, res) => {
    res.json({ message: "CORS is working!" });
  });

// const db = knex ({
//     client: 'pg',
//     connection: process.env.DATABASE_URL
//     ? { connectionString: process.env.DATABASE_URL, 
//         ssl: { rejectUnauthorized: false }
//     } 
//     : {
//       host: '127.0.0.1',
//       port: 5432,
//       user: 'shwetanarendernath',
//       password: 'password',
//       database: 'smartbrain-db',
//     },
//   });


// db.select('*').from('users').then(data=> {
//     console.log(data);
// });


// Built-in middleware to parse JSON data
app.use(express.json());

// Built-in middleware to parse URL-encoded data
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => { res.send("Server is live!");});


app.post('/signin', (req,res) => {signin.handleSignin(req,res,db,bcrypt);});

// dependency injection implmentation to execute the controllers properly.

app.post('/register', (req,res) => {register.handleRegister(req,res,db,bcrypt);});


app.get('/profile/:id',(req,res) => {profile.handleProfile(req,res,db) ;});

app.put("/image", (req,res) => {image.handleImage(req,res,db);} );


app.post('/clarifai', (req,res) => {clarifai.handleClarifai(req,res,fetch)});



app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`);
  });

