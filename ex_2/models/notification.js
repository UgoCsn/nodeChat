const Mongoose = require('mongoose');

const notificationSchema = new Mongoose.Schema({
    actionUserId: {type: String, required: true},
    receiverUserId:  {type: String, required: true},
    action: {type: String, required: true},
    creationDateTime: {type: Date, required: true},
    view : {type: Boolean, required: true},
    message : {type: String, required: true},

}, {collection: "notification"})

const notificationModel = Mongoose.model("notification", notificationSchema);

module.exports = notificationModel;