// export const handleRegister = async (req, res, db, bcrypt) => {
//     const { name, email, password } = req.body;
//     if (!name || !email || !password) {
//       return res.status(400).json("incorrect form submission");
//     }
  
//     try {
//       const hash = bcrypt.hashSync(password, 10);
//       console.log("Hashed password:", hash);
  
//       const newUser = await db.transaction(async trx => {
//         const [loginEmail] = await trx("login")
//           .insert({ hash, email })
//           .returning("email");
  
//         const [user] = await trx("users")
//           .insert({
//             email: loginEmail,
//             name,
//             joined: new Date(),
//           })
//           .returning("*");
  
//         return user;
//       });
  
//       return res.status(201).json(newUser);
//     } catch (err) {
//       console.error("Register error:", err);
//       return res.status(400).json("Unable to register");
//     }
//   };

export const handleRegister = (req,res, db, bcrypt) => {
    // extracting the variables through destructuring.
    const { name, email, password }  = req.body;
    if(!email || !name || !password) {
        return res.status(400).json("incorrect form submission");

    }
  
  // Set the number of salt rounds (a common default is 10)
  const saltRounds = bcrypt.genSaltSync(10);

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
        .catch(trx.rollback)

  })  
  .catch(err => res.status(400).json("unable to register"))
    };

