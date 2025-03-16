

export const handleRegister = (req,res, db, bcrypt) => {
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
    };

