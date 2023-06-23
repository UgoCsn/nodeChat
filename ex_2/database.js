const mongoose = require('mongoose');

const DB = "Messages";
const URI = process.env.URI_MONGO

const MongoDBClient = {
    initialize: () => {
        try {
            const client = mongoose.connect(URI, 
                { 
                    useNewUrlParser: true, 
                    useUnifiedTopology: true
                })
            client.then(() => console.log(`🎉 🎉 successfully connected to DB: ${DB}`))
        } catch(err) {
            throw Error(err)
        }
    }
}

module.exports = MongoDBClient;