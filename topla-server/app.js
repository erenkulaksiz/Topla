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

const logActions = {
    questionsolve_start: "questionsolve_start",
}

const allowedBundles = ['com.erencode.topla']

MongoClient.connect(connectionString, { useUnifiedTopology: true }, (err, client) => {
    if (err) return console.error(err)
    console.log('Connected to Database');
    const db = client.db('topla');
    const devicesCollection = db.collection('devices');
    const configCollection = db.collection('config');
    const logsCollection = db.collection('logs');

    const log = ({ ...log }) => {
        const logColl = {
            uuid: log.uuid, // Sadece uuid yeterli
            timestamp: Date.now(),
            time: new Date().toUTCString(),
            action: log.action,
            app_version: log.app_version,
        }
        if (log.hasPremium) {
            logColl["hasPremium"] = true;
        }
        if (log.action_desc) {
            logColl["action_desc"] = log.action_desc;
            console.log("GELEN ACTION DESC: ", log.action_desc);
            console.log("UUID OF ACTION: ", log.uuid);
        }
        logsCollection.insertOne(logColl)
    }

    const _GENERATE_API_TOKEN = (uuid, timestamp) => {
        const saltedHash = saltedSha256(uuid, timestamp);
        console.log("GENERATED API_TOKEN: " + saltedHash);
        return saltedHash
    }

    app.get('/', (req, res) => {
        res.status(404);
        return res.send(JSON.stringify({
            reason: "Invalid Request",
            success: false,
        }));
    })

    // Check latest version of app.
    configCollection.findOne()
        .then(cfx => {
            console.log("Latest version of app: ", cfx.latestVer)
        })
        .catch(error => console.error(error))

    app.post('/device', (req, res) => {
        console.log("________________________")
        console.log("Got request!, /device !", req.body);
        console.log("________________________");

        // first, check if request is fine

        console.log("IP: ", req.ip);

        if (!req.body.uuid
            || !req.body.bundle_id
            || !req.body.platform
            || !req.body.country_code
            || !req.body.language_code
            || !req.body.app_version
        ) {
            console.log("Invalid params, request denied");
            res.status(404);
            return res.send(JSON.stringify({
                reason: "Invalid Request",
                success: false,
            }));
        }

        let pass = false;

        allowedBundles.map((element, index) => {
            if (element == req.body.bundle_id) {
                pass = true;
            }
        })

        if (!pass) {
            console.log("Invalid bundle name, request denied");
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

                    log({
                        action: "register",
                        app_version: req.body.app_version,
                        uuid: req.body.uuid,
                    });

                    devicesCollection.insertOne({
                        uuid: req.body.uuid,
                        bundle_id: req.body.bundle_id,
                        hasPremium: false,
                        registerDate: Date.now(),
                        registerTime: new Date().toUTCString(),
                        language_code: req.body.language_code,
                        app_version: req.body.app_version, // registered app version
                        platform: req.body.platform, // android, ios
                        timezone: req.body.timezone,
                        model: req.body.model,
                        banned: false,
                        API_TOKEN: _GENERATE_API_TOKEN(req.body.uuid, Date.now() + 9925 + Math.random()), // Non-regeneratable :)
                    })
                        .then(result => {
                            console.log("ADDED 1, " + new Date().toUTCString(), result.ops[0]);

                            configCollection.findOne()
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
                                        APP_MAINTENANCE: cfx.maintenance,
                                    }
                                    console.log("RESULT: ", _RESPONSE);
                                    return res.json(_RESPONSE);
                                })
                                .catch(error => console.error(error))
                        })
                        .catch(error => console.error(error))

                } else {

                    configCollection.findOne()
                        .then(cfx => {

                            log({
                                action: "login",
                                app_version: req.body.app_version,
                                uuid: results.uuid
                            });

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
                                APP_MAINTENANCE: cfx.maintenance,
                            }
                            console.log("LOGIN / " + new Date().toUTCString() + " RESULT: ", _RESPONSE);
                            return res.json(_RESPONSE);
                        })
                        .catch(error => console.error(error))

                }
            })
            .catch(error => console.error(error))
    })


    app.post('/log', (req, res) => {
        console.log("________________________")
        console.log("Got request, /log ! ", req.body);
        console.log("________________________");

        // first, check if request is fine

        console.log("IP: ", req.ip);

        if (!req.body.uuid
            || !req.body.bundle_id
            || !req.body.action
            || !req.body.app_version
        ) {
            console.log("Invalid params, request denied");
            res.status(404);
            return res.send(JSON.stringify({
                reason: "Invalid Request",
                success: false,
            }));
        }

        Object.keys(logActions).map((element, index) => {
            if (req.body.action == element) {
                console.log("ACTION MATCH");
                console.log("log action: ", element);
                devicesCollection.findOne({ uuid: req.body.uuid })
                    .then(result => {
                        if (result) {
                            // UUID Match

                            log({
                                action: req.body.action,
                                app_version: req.body.app_version,
                                uuid: req.body.uuid,
                                hasPremium: req.body.hasPremium,
                                action_desc: req.body.action_desc,
                            });

                            const _RESPONSE = {
                                uuid: result.uuid,
                                success: true,
                            }
                            console.log("RESULT: ", _RESPONSE);
                            return res.json(_RESPONSE);
                        } else {
                            console.log("Invalid uuid, request denied");
                            res.status(404);
                            return res.send(JSON.stringify({
                                reason: "Invalid Request",
                                success: false,
                            }));
                        }
                    })
                    .catch(error => console.error(error))
            }
        })
    })

    app.post('/premium', (req, res) => {
        console.log("________________________")
        console.log("Got request, /premium ! ", req.body);
        console.log("________________________");

        // first, check if request is fine

        console.log("IP: ", req.ip);

        if (!req.body.uuid
        ) {
            console.log("Invalid params, request denied");
            res.status(404);
            return res.send(JSON.stringify({
                reason: "Invalid Request",
                success: false,
            }));
        }

        devicesCollection.findOne({ uuid: req.body.uuid })
            .then(result => {
                if (result) {
                    // UUID Match

                    console.log("uuid ", result.uuid, " premium: ", result.hasPremium)

                    if (result.hasPremium) {
                        devicesCollection.updateOne
                            (
                                {
                                    uuid: result.uuid
                                },
                                {
                                    $set:
                                    {
                                        hasPremium: false,
                                    }
                                }
                            )
                        console.log("hasPremium: false for uuid: ", req.body.uuid);
                        return res.send(JSON.stringify({
                            success: true,
                            hasPremium: false,
                        }));
                    } else {
                        devicesCollection.updateOne
                            (
                                {
                                    uuid: result.uuid
                                },
                                {
                                    $set:
                                    {
                                        hasPremium: true,
                                    }
                                }
                            )
                        console.log("hasPremium: true for uuid: ", req.body.uuid);
                        return res.send(JSON.stringify({
                            success: true,
                            hasPremium: true,
                        }));
                    }

                } else {
                    console.log("Invalid uuid, request denied");
                    res.status(404);
                    return res.send(JSON.stringify({
                        reason: "Invalid Request",
                        success: false,
                    }));
                }
            })
            .catch(error => console.error(error))
    })
})
