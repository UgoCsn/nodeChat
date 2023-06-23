const User = require('../models/user');
const withAuth = require('../withAuth')

function authRoutes(app){

    app.get('/checkToken', withAuth ,async (req, res)=>{
        const headers = req.headers;

        const user = await User.findOne({_id: req.payload.id});
        res.status(200).json({msg: "token ok", user})
          
    })

}

module.exports = authRoutes;
