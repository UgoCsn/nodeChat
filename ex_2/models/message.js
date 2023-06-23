const Mongoose = require('mongoose');

const messageSchema = new Mongoose.Schema({
    senderUserId: {type: String, required: true},
    receiverUserId:  {type: String, required: true},
    body: {type: String, required: true},
    creationDateTime: {type: Date, required: true},
    lastUpdateDateTime: {type: Date, required: true}
}, {collection: "message"})

const MessageModel = Mongoose.model("Message", messageSchema);

module.exports = MessageModel;