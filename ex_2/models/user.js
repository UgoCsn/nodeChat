const Mongoose = require('mongoose');

const userSchema = new Mongoose.Schema({
    firstName: {type: String, required: true},
    lastName:  {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    creationDateTime: {type: Date, required: true},
    role: {type: String, required: true}
}, {collection: "user"})

const UserModel = Mongoose.model("User", userSchema);

module.exports = UserModel;