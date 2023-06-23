const Message = require('../models/message')
const withAuth = require('../withAuth')

function messageRoutes(app, io){
    app.post('/message/add', withAuth, async (req, res)=>{
        const data = {
            senderUserId: req.body.senderUserId,
            receiverUserId:  req.body.receiverUserId,
            body: req.body.body,
            creationDateTime: new Date(),
            lastUpdateDateTime: new Date()
        }

        const message = new Message(data);
        const result = await message.save();
        console.log(result)
        if(result.code) {
            res.status(result.code).json({result})
            return;
        }
        io.emit('newMessage', {receiverUserId: req.body.receiverUserId})
        res.status(200).json({result})

    })

    app.get('/message/all', withAuth,async (req, res)=>{
        const messages = await Message.find({});

        if(messages.code) {
            res.status(messages.code).json({messages})
        }

        res.status(200).json({messages})
    })

    app.get('/messageByUser/:user_id', withAuth,async (req, res)=>{
        const user_id = req.params.user_id;
        const messages = await Message.find({$or: [{senderUserId: user_id}, {receiverUserId: user_id}]});

        if(messages.code) {
            res.status(messages.code).json({messages})
        }

        res.status(200).json({messages})
    })


    app.get('/message/:id', withAuth,async (req, res)=>{
        const id = req.params.id;
        const message = await Message.findOne({_id: id});

        if(message.code) {
            res.status(message.code).json({message})
        }

        res.status(200).json({message})
    })

    app.delete('/message/:id', withAuth, async (req, res)=>{
        const id = req.params.id;
        const message = await Message.findOne({_id: id})
        console.log(message)
        if(message.code) {
            res.status(message.code).json({message})
        }
        const result = await Message.deleteOne({_id: id});

        if(result.code) {
            res.status(result.code).json({result})
        }
        io.emit('updateDeleteMessage', {receiverUserId: message.receiverUserId, senderUserId: message.senderUserId})
        res.status(200).json({result})

    })

    app.put('/message/:id',withAuth, async (req, res)=>{
        const id = req.params.id;
        const result = await Message.updateOne({_id: id}, {body: req.body.body});

        if(result.code) {
            res.status(result.code).json({result})
        }

        const message = await Message.findOne({_id: id})
        console.log(message)
        if(message.code) {
            res.status(message.code).json({message})
        }

        io.emit('updateDeleteMessage', {receiverUserId: message.receiverUserId, senderUserId: message.senderUserId})

        //io.emit('newMessage', {receiverUserId: req.body.receiverUserId})
        res.status(200).json({result})
    })
}

module.exports = messageRoutes