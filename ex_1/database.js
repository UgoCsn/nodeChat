const { MongoClient } = require('mongodb');

const url = process.env.URI_MONGO;
const client = new MongoClient(url);

const dbName = 'Messages';

async function main() {
  // Use connect method to connect to the server
  return client.connect()
            .then(async(result)=>{
                console.log('Connected successfully to server');
                const db = client.db(dbName);
                
                return db
            })
            .catch((err)=>{
                console.log('err', err)
            })   
}

module.exports = {client, main}
