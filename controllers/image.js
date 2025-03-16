export const handleImage = (req, res, db) => {
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

}

