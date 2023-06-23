const Notification = require('../models/notification')
const withAuth = require('../withAuth')

function notificationRoutes(app, io){
    app.post('/notification/add', withAuth, async (req, res)=>{
        const data = {
            actionUserId: req.body.actionUserId,
            receiverUserId:  req.body.receiverUserId,
            action: req.body.action,
            creationDateTime: new Date(),
            view: req.body.view,
            message: req.body.message
        }

        const notification = new Notification(data);
        const result = await notification.save();
        console.log(result)
        if(result.code) {
            res.status(result.code).json({result})
            return;
        }
        io.emit('newNotification', {receiverUserId: req.body.receiverUserId})
        res.status(200).json({result})

    })

    app.get('/notificationByUser/:user_id', withAuth,async (req, res)=>{
        const user_id = req.params.user_id;
        const notifications = await Notification.find({receiverUserId: user_id});

        if(notifications.code) {
            res.status(notifications.code).json({notifications})
        }

        res.status(200).json({notifications})
    })

    app.get('/notification/:id', withAuth,async (req, res)=>{
        const id = req.params.id;
        const notification = await Notification.findOne({_id: id});

        if(notification.code) {
            res.status(notification.code).json({notification})
        }

        res.status(200).json({notification})
    })

    




    
}

module.exports = notificationRoutes



