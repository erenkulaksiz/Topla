var express = require("express");
const bodyParser = require('body-parser');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const saltedSha256 = require('salted-sha256');

const keys = require('../keys.js');

const port = 3000;

app.listen(port, () => {
    console.log("Application Started at port ", port);
});

const connectionString = `mongodb+srv://${keys.DATABASE_USERNAME}:${keys.DATABASE_PASSWORD}@cluster0.mpjf4.mongodb.net/topla?retryWrites=true&w=majority?authSource=topla&w=1`;

console.log("CONN STR ", connectionString);

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
    const config = db.collection('config');

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

    // Check latest version of app.
    config.findOne()
        .then(cfx => {
            console.log("Latest version of app: ", cfx.latestVer)
        })
        .catch(error => console.error(error))

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
                        app_version: req.body.app_version, // registered app version
                        timezone: req.body.timezone,
                        banned: false,
                        API_TOKEN: _GENERATE_API_TOKEN(req.body.uuid, Date.now() + 9925 + Math.random()), // Non-regeneratable :)
                    })
                        .then(result => {
                            console.log("ADDED 1", result.ops[0]);

                            config.findOne()
                                .then(cfx => {
                                    const _RESPONSE = {
                                        API_TOKEN: result.ops[0].API_TOKEN,
                                        hasPremium: result.ops[0].hasPremium,
                                        language_code: result.ops[0].language_code,
                                        registerDate: result.ops[0].registerDate,
                                        uuid: result.ops[0].uuid,
                                        success: true,
                                        APP_LATEST_VERSION: cfx.latestVer,
                                        APP_SOFT_UPDATE_VER: cfx.softUpdateVer,
                                        APP_HARD_UPDATE_VER: cfx.hardUpdateVer,
                                    }
                                    console.log("RESULT: ", _RESPONSE);
                                    return res.json(_RESPONSE);
                                })
                                .catch(error => console.error(error))
                        })
                        .catch(error => console.error(error))

                } else {

                    config.findOne()
                        .then(cfx => {
                            const _RESPONSE = {
                                uuid: results.uuid,
                                hasPremium: results.hasPremium,
                                registerDate: results.registerDate,
                                banned: results.banned,
                                success: true,
                                API_TOKEN: results.API_TOKEN,
                                APP_LATEST_VERSION: cfx.latestVer,
                                APP_SOFT_UPDATE_VER: cfx.softUpdateVer,
                                APP_HARD_UPDATE_VER: cfx.hardUpdateVer,
                            }
                            console.log("RESULT: ", _RESPONSE);
                            return res.json(_RESPONSE);
                        })
                        .catch(error => console.error(error))

                }
            })
            .catch(error => console.error(error))
    })
})
