const mongo = require('mongodb');

async function userRoutes(app, db){
    const user = db.collection('user');

    app.get("/user/all", async (req, res)=>{
        console.log('route')
        const users = await user.find({}).toArray();
        if(!users) {
            res.status(500).json({err: 'Problème avec la requête vers collection user'})
        }
        res.status(200).json({users})
    })

    app.get("/user/:id", async (req, res)=>{
        const id = req.params.id
        const _id = new mongo.ObjectId(id);
        console.log(id)
        const oneUser = await user.find({_id: _id}).toArray();
        if(!oneUser) {
            res.status(500).json({err: 'Problème avec la requête vers collection user'})
        }
        res.status(200).json({user: oneUser})
    })

    app.post("/user/add", async (req, res)=>{
        const newUser = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password,
            creationDateTie: new Date(),
            role: 'user'
        }

        const result = await user.insertOne(newUser);

        res.status(200).json({result})
    })

}

module.exports = userRoutes