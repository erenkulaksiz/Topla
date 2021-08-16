var express = require("express");
const bodyParser = require('body-parser');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const saltedSha256 = require('salted-sha256');
const { google } = require('googleapis');

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
    const purchasesCollection = db.collection('purchases');

    const auth = new google.auth.GoogleAuth({
        keyFile: "pc-api-6316387851500029020-650-5e56ea940a0a.json",
        scopes: ["https://www.googleapis.com/auth/androidpublisher"]
    }) // Cache auth

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

        if (req.body.uuid.length < 16) {
            res.status(404);
            return res.send(JSON.stringify({
                reason: "Invalid Request",
                success: false,
            }));
        }

        console.log("UUID length: ", req.body.uuid.length);

        let pass = false;

        allowedBundles.map((element) => {
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
                        API_TOKEN: _GENERATE_API_TOKEN(req.body.uuid, Date.now() + 9925 + Math.random()),
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
                                        APP_PRODUCTS: cfx.products,
                                        APP_ANNOUNCEMENTS: cfx.announcements,
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

                            /* Dont log login for now.
                            log({
                                action: "login",
                                app_version: req.body.app_version,
                                uuid: results.uuid
                            });
                            */

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
                                APP_PRODUCTS: cfx.products,
                                APP_ANNOUNCEMENTS: cfx.announcements,
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

        if (req.body.uuid.length < 16) {
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

    app.post('/receipt', async (req, res) => {
        console.log("________________________")
        console.log("Got request, /receipt ! ", req.body);
        console.log("________________________");

        console.log("IP: ", req.ip);

        if (!req.body.data
            || !req.body.platform
            || !req.body.uuid
            || !req.body.API_TOKEN) {
            console.log("Invalid params, request denied");
            res.status(404);
            return res.send(JSON.stringify({
                reason: "Invalid Request",
                success: false,
            }));
        }

        if (req.body.uuid.length < 16) {
            res.status(404);
            return res.send(JSON.stringify({
                reason: "Invalid Request",
                success: false,
            }));
        }

        console.log("Data: ", req.body.data);
        console.log("Platform: ", req.body.platform);

        const currDevice = await devicesCollection.findOne({ uuid: req.body.uuid });
        if (currDevice) {
            if (currDevice.API_TOKEN == req.body.API_TOKEN) {
                console.log("API TOKEN UUID MATCHED");

                try {
                    const response = await google.androidpublisher("v3").purchases.subscriptions.get({
                        packageName: "com.erencode.topla",
                        subscriptionId: req.body.data.productId,
                        token: req.body.data.purchaseToken,
                        auth: auth,
                    })
                    if (response.status == 200) {
                        console.log("GOOGLE API RES: ", response.data);
                        if (response.data.paymentState === 1) {
                            // Valid subscription!

                            purchasesCollection.insertOne({
                                uuid: req.body.uuid,
                                platform: req.body.platform,
                                packageName: "com.erencode.topla",
                                subscriptionId: req.body.data.productId,
                                token: req.body.data.purchaseToken,
                                timestamp: Date.now(),
                                date: new Date().toUTCString(),
                            })

                            await devicesCollection.updateOne({ uuid: req.body.uuid }, { $set: { hasPremium: true, } })

                            res.status(200);
                            return res.send(JSON.stringify({
                                reason: "You have been subscribed successfully!",
                                success: true,
                                purchaseStatus: "success",
                            }));

                        } else {
                            res.status(404);
                            return res.send(JSON.stringify({
                                reason: "Purchase failed.",
                                success: false,
                                purchaseStatus: "failed",
                            }));
                        }
                    }
                } catch (err) {
                    res.status(404);
                    return res.send(JSON.stringify({
                        reason: err,
                        success: false,
                        purchaseStatus: "failed",
                    }));
                }
            } else {
                res.status(404);
                return res.send(JSON.stringify({
                    reason: "Invalid Request",
                    success: false,
                    purchaseStatus: "failed",
                }));
            }
        } else {
            res.status(404);
            return res.send(JSON.stringify({
                reason: "Invalid Request",
                success: false,
                purchaseStatus: "failed",
            }));
        }

    })

    app.post('/iapinit', async (req, res) => {
        console.log("________________________")
        console.log("Got request, /iapinit ! ", req.body);
        console.log("________________________");

        console.log("IP: ", req.ip);

        if (!req.body.data
            || !req.body.platform
            || !req.body.uuid
            || !req.body.API_TOKEN) {
            console.log("Invalid params, request denied");
            res.status(404);
            return res.send(JSON.stringify({
                reason: "Invalid Request",
                success: false,
            }));
        }

        console.log("Data: ", req.body.data);
        console.log("Platform: ", req.body.platform);

        console.log("Data length: ", req.body.data.length);

        const currDevice = await devicesCollection.findOne({ uuid: req.body.uuid });
        if (currDevice) {
            if (currDevice.API_TOKEN == req.body.API_TOKEN) {
                if (req.body.data.length > 0) {
                    req.body.data.map(async (element) => {
                        try {
                            const response = await google.androidpublisher("v3").purchases.subscriptions.get({
                                packageName: "com.erencode.topla",
                                subscriptionId: element.productId,
                                token: element.purchaseToken,
                                auth: auth,
                            })

                            console.log("init response", response.data);

                            if (response.data.paymentState == 1) {
                                const expiry = response.data.expiryTimeMillis - Date.now();
                                console.log("Expiry: ", expiry);

                                if (expiry <= 0) {
                                    await devicesCollection.updateOne({ uuid: req.body.uuid }, { $set: { hasPremium: false } })

                                    res.status(200);
                                    return res.send(JSON.stringify({
                                        success: false,
                                        reason: "This subscription has been expired.",
                                        hasPremium: false,
                                    }));
                                } else {
                                    // #TODO: If user has premium already, dont change it
                                    await devicesCollection.updateOne({ uuid: req.body.uuid }, { $set: { hasPremium: true } })

                                    res.status(200);
                                    return res.send(JSON.stringify({
                                        success: true,
                                        hasPremium: true,
                                        expiryTime: expiry,
                                    }));
                                }
                            } else {

                                await devicesCollection.updateOne({ uuid: req.body.uuid }, { $set: { hasPremium: false } })

                                res.status(200);
                                return res.send(JSON.stringify({
                                    success: false,
                                    reason: "paymentState is " + response.data.paymentState,
                                    hasPremium: false,
                                }));
                            }

                        } catch (error) {
                            console.log("ERROR WITH GOOGLE API: ", error);

                            res.status(200);
                            return res.send(JSON.stringify({
                                reason: error,
                                success: false,
                            }));
                        }
                    })
                } else {
                    console.log("set hasPremium to false for uuid: ", req.body.uuid);
                    await devicesCollection.updateOne({ uuid: req.body.uuid }, { $set: { hasPremium: false } })

                    res.status(200);
                    return res.send(JSON.stringify({
                        reason: "User doesn't have a subscription.",
                        success: false,
                        hasPremium: false,
                    }));
                }
            } else {
                // api token with uuid didnt matched
                res.status(404);
                return res.send(JSON.stringify({
                    reason: "Invalid Request",
                    success: false,
                }));
            }
        } else {
            // no current device
            res.status(404);
            return res.send(JSON.stringify({
                reason: "Invalid Request",
                success: false,
            }));
        }

    })

})
