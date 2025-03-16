
// Importing Express and other apps:
import express from "express"
import bcrypt from "bcrypt";
import cors from 'cors';
import knex from 'knex';
import pg from 'pg';
import * as signin from './controllers/signin.js';
import * as register from './controllers/register.js';
import * as profile from './controllers/profile.js';
import * as image from './controllers/image.js';

//Initialize an Express application:
const app = express();

//Defining a Port: Setting a port number for the server to listen on.

const PORT = process.env.PORT || 3000;

//Adding the cors middleware to be used before the routes. This enables cross origin resource sharing by default.
app.use(cors());

const db = knex ({
    client: 'pg',
    connection: {
      host: '127.0.0.1',
      port: 5432,
      user: 'shwetanarendernath',
      password: 'password',
      database: 'smartbrain-db',
    },
  });


db.select('*').from('users').then(data=> {
    console.log(data);
});


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


app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`);
  });