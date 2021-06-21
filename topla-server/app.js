var express = require("express");
const bodyParser = require('body-parser');
var app = express();
const MongoClient = require('mongodb').MongoClient;
const saltedSha256 = require('salted-sha256');

const keys = require('./keys.js');

const port = 3000;

app.listen(port, () => {
    console.log("Application Started at port ", port);
});

const connectionString = `mongodb+srv://${keys.DATABASE_USERNAME}:${keys.DATABASE_PASSWORD}@cluster0.mpjf4.mongodb.net/topla?retryWrites=true&w=majority?authSource=topla&w=1`;

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.json({
    type: ['application/json', 'text/plain']
}))

MongoClient.connect(connectionString, { useUnifiedTopology: true }, (err, client) => {
    if (err) return console.error(err)
    console.log('Connected to Database');
    const db = client.db('topla');
    const devicesCollection = db.collection('devices');
    const messagesCollection = db.collection('messages'); // İletişim Bölümü

    const _GENERATE_API_TOKEN = (uuid, timestamp) => {
        const saltedHash = saltedSha256(uuid, timestamp);
        console.log("GENERATED API_TOKEN: " + saltedHash);
        return saltedHash
    }

    /* TEST
    app.get('/', (req, res) => {

        return res.send("APP");
    })
    */

    app.post('/device', (req, res) => {
        console.log("________________________")
        console.log("Got request! ", req.body);
        console.log("________________________");

        // first, check if request is fine

        console.log("IP: ", req.ip);

        if (!req.body.uuid
            || !req.body.bundle_id
            || !req.body.platform
            || !req.body.channel
            || !req.body.country_code
        ) {
            res.status(404);
            return res.send(JSON.stringify({
                reason: "Invalid Request",
                success: false,
            }));
        }

        devicesCollection.findOne({ uuid: req.body.uuid })
            .then(results => {
                if (!results) {
                    console.log("NO RESULTS");

                    devicesCollection.insertOne({
                        uuid: req.body.uuid,
                        bundle_id: req.body.bundle_id,
                        hasPremium: false,
                        registerDate: Date.now(),
                        language_code: req.body.language_code,
                        app_version: req.body.app_version,
                        timezone: req.body.timezone,
                        API_TOKEN: _GENERATE_API_TOKEN(req.body.uuid, Date.now() + 999214 + Math.random()),
                    })
                        .then(result => {
                            console.log("ADDED 1", result.ops[0]);

                            return res.json({
                                API_TOKEN: result.ops[0].API_TOKEN,
                                hasPremium: result.ops[0].hasPremium,
                                language_code: result.ops[0].language_code,
                                registerDate: result.ops[0].registerDate,
                                uuid: result.ops[0].uuid,
                                success: true,
                            });
                        })
                        .catch(error => console.error(error))

                } else {
                    const _RESPONSE = {
                        uuid: results.uuid,
                        hasPremium: results.hasPremium,
                        registerDate: results.registerDate,
                        success: true,
                        API_TOKEN: results.API_TOKEN,
                    }
                    console.log("RESULT: ", _RESPONSE);
                    return res.json(_RESPONSE);
                }
            })
            .catch(error => console.error(error))
    })


    app.post('/message', (req, res) => {
        console.log("________________________")
        console.log("Got request! ", req.body);
        console.log("________________________");

        if (!req.body.uuid
            || !req.body.bundle_id
            || !req.body.platform
            || !req.body.channel
            || !req.body.country_code
            || !req.body.email
            || !req.body.message
            || !req.body.API_TOKEN
        ) {
            res.status(404);
            return res.send(JSON.stringify({
                reason: "Invalid Request",
                success: false,
            }));
        }

        console.log("IP: ", req.ip);

        messagesCollection.find({ 'uuid': { $in: [req.body.uuid] } }).toArray().then(results => {
            console.log("MYRESULTS: ", results)
            if (results.length > 3) {
                console.log("SPAM DETECTED!");
                return res.json({
                    reason: "Cannot send message more than 3",
                    success: false,
                });
            } else {
                devicesCollection.findOne({ uuid: req.body.uuid }).then(result => {
                    console.log("API_TOKEN_MATCH: ", result);
                    if (result) {
                        messagesCollection.insertOne({
                            uuid: req.body.uuid,
                            bundle_id: req.body.bundle_id,
                            message: req.body.message,
                            email: req.body.email,
                            API_TOKEN: result.API_TOKEN,
                            language: req.body.country_code,
                            ip: req.ip,
                            date: Date.now(),
                        })
                            .then(result => {
                                console.log("ADDED 1", result.ops)
                            })
                            .catch(error => console.error(error))
                        return res.json({
                            success: true,
                        });
                    } else {
                        console.log("THIS DEVICE DOES NOT EXIST");
                        return res.json({
                            reason: "This device does not exist",
                            success: false,
                        });
                    }
                })
            }
        })
    })
})
