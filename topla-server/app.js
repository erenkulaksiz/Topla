var express = require("express");
const bodyParser = require('body-parser')
var app = express();
const MongoClient = require('mongodb').MongoClient
const saltedSha256 = require('salted-sha256');
const { ResumeToken } = require("mongodb");

app.listen(3000, () => {
    console.log("Server running on port 3000");
});

// topla
// 669RR1dI2mjT7CWv

const connectionString = "mongodb+srv://topla:669RR1dI2mjT7CWv@cluster0.mpjf4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

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

    app.post('/device', (req, res) => {
        console.log("________________________")
        console.log("Got request! ", req.body);
        console.log("________________________");

        // first, check if request is fine

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

        console.log("IP: ", req.ip);

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
                        API_TOKEN: _GENERATE_API_TOKEN(req.body.uuid, Date.now()),
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
        ) {
            res.status(404);
            return res.send(JSON.stringify({
                reason: "Invalid Request",
                success: false,
            }));
        }

        console.log("IP: ", req.ip);

        // Match UUID with Topla API TOKEN here

        messagesCollection.insertOne({
            uuid: req.body.uuid,
            bundle_id: req.body.bundle_id,
            message: req.body.message,
            email: req.body.email,
            date: Date.now(),
        })
            .then(result => {
                console.log("ADDED 1", result.ops)
            })
            .catch(error => console.error(error))
    })
})
