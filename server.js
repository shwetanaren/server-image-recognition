
// Importing Express and other apps:
import express from "express"
import bcrypt from "bcrypt";
import cors from 'cors';
import knex from 'knex';
import pg from 'pg';

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

//creating a varible in place of a database

const database = {
    users:[
        {
            id: '123',
            name:'john',
            email:'john@gmail.com',
            password:'cookies',
            entries: 0,
            joined: new Date()

        },

        {
            id: '124',
            name:'mary',
            email:'mary@gmail.com',
            password:'jane',
            entries: 1,
            joined: new Date()

        }
    ]
}

// Built-in middleware to parse JSON data
app.use(express.json());

// Built-in middleware to parse URL-encoded data
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Server is live!");
  res.send(database.users);
});



app.post('/signin', (req, res) => {

    db.select('email', 'hash').from('login')
        .where('email', '=', req.body.email)
        .then(data => {
            const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
            if(isValid){
                console.log(isValid)
                return db.select('*').from('users')
                .where('email', '=', req.body.email)
                .then(user => {
                    console.log(user)
                    res.json(user[0])
                })
                .catch(err => res.status(400).json('unable to get user'))
            } else {
                res.status(400).json('wrong credentials')
            }
        })
        .catch(err => res.status(400).json('wrong credentials'))
    });

    // // For demonstration, I have input this as a known hash for the password "oranges"
    // const knownHash = "$2b$10$cJw3FsJhQK8SxZ6JUvL3eeM/VqNl5naA5Ulhzoy4rx1nCDgfZMOCC";
  
    // // Compare the password sent in the request with the known hash.
    // bcrypt.compare(req.body.password, knownHash, (err, isMatch) => {

    // // Ensure the property name is spelled correctly
    // if (err) {
    //     console.error("Error comparing passwords:", err);
    //     return res.status(500).json("Error logging in");
    //   }
    //   if (isMatch) {
    //     return res.json("success");
    //   } else {
    //   // Send error response if credentials do not match
    //   return res.status(400).json("error logging in");
    // }
//   });


  app.post('/register', (req,res) => {
    // extracting the variables through destructuring.
    const { name, email, password }  = req.body;
  
  // Set the number of salt rounds (a common default is 10)
  const saltRounds = 10;

  // Hash the plaintext password using bcrypt.hashSync to store in DB
  const hash = bcrypt.hashSync(password, saltRounds);
  console.log('Hashed password:', hash);
  db.transaction(trx => { //transactions are feature of knex to keep things consistent both fails/successes
    trx.insert({
        hash:hash,
        email:email
    })
    .into('login')
    .returning('email')
    .then(loginEmail => {
        return trx('users')
        .returning('*')
        .insert({
        email: loginEmail[0].email,
        name: name,
        joined: new Date()
        }).then(user => {
            res.json(user[0]);
        })
    })
        .then(trx.commit)
        .catch(trx.callback)

  })  
  .catch(err => res.status(400).json(err))
    });


app.get('/profile/:id', (req,res) => {
    const { id } = req.params;
    let found = false;
    db.select('*').from('users').where({id})
      .then(user => {
        if(user.length){
          res.json(user[0])
        } else {
        res.status(400).json('Not Found')
        }
    })
    .catch(err => res.status(400).json('not found'))
    // database.users.forEach(user => {
    //     if (user.id === id) {
    //         found = true;
    //         return res.json(user);      
    //     }
    // })
    // if (!found) {
    //     res.json("user not found")
    // }
})

app.put("/image", (req, res) => {
    // Check if req.body is an array and get the first object
    // const data = Array.isArray(req.body) ? req.body[0] : req.body;
    const { id } = req.body;
    db('users').where('id', '=', id)
    .increment('entries',1)
    .returning('entries') 
    .then(entries => {
      res.json(entries[0].entries); //here we do as given instead of just entries[0]
      console.log(entries)
    })
    .catch(err => {
      console.error(err);
      res.status(400).json('Unable to update entries');
    })
    // let found = false;
    // database.users.forEach(user => {
    //     if (user.id === id) {
    //         found = true;
    //         user.entries++;
    //         return res.json(user.entries);
    //     }
    // });
    // if (!found) {
    //     res.json("user not found");
    // }
});


app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`);
  });