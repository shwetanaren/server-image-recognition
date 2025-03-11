
// Importing Express:
import express from "express"

//Initialize an Express application:
const app = express();

//Defining a Port: Setting a port number for the server to listen on.

const PORT = process.env.PORT || 3000;

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
    // Ensure the property name is spelled correctly
    if (
      req.body.email === database.users[0].email &&
      req.body.password === database.users[0].password
    ) {
      // Send success response if credentials match
      res.json("success");
    } else {
      // Send error response if credentials do not match
      res.status(400).json("error logging in");
    }
  });

  app.post('/register', (req,res) => {
    // extracting the variables through destructuring.
    const { name, email, password }  = req.body;
    database.users.push({
        id:"125",
        name: name,
        email: email,
        password:password,
        entries:0,
        joined: new Date()
    });
    res.json(database.users[database.users.length-1])
  })


app.get('/profile/:id', (req,res) => {
    const { id } = req.params;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            return res.json(user);
            
        }
    })
    if (!found) {
        res.json("user not found")
    }
})

app.put("/image", (req, res) => {
    // Check if req.body is an array and get the first object
    const data = Array.isArray(req.body) ? req.body[0] : req.body;
    const { id } = data;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            user.entries++;
            return res.json(user.entries);
        }
    });
    if (!found) {
        res.json("user not found");
    }
});


app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`);
  });