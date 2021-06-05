var express = require("express");
const bodyParser = require('body-parser')
var app = express();
const MongoClient = require('mongodb').MongoClient

app.listen(3000, () => {
    console.log("Server running on port 3000");
});

const connectionString = "mongodb+srv://eren:KuGWKdlTKkR1oHHy@cluster0.ic4u5.mongodb.net/Cluster0?retryWrites=true&w=majority";

app.use(bodyParser.urlencoded({ extended: true }));

MongoClient.connect(connectionString, { useUnifiedTopology: true }, (err, client) => {
    if (err) return console.error(err)
    console.log('Connected to Database')
    const db = client.db('star-wars-quotes')
    const quotesCollection = db.collection('quotes')

    app.get('/rq', (req, res) => {
        quotesCollection.insertOne({
            ilayda: "cekemeyen",
            burc: "ucuzler",
            sevgilisi: "23232",
            dogumtarihi: "2002/06/15",
        })
            .then(result => {
                console.log(result)
                return res.json({
                    success: true
                });
            })
            .catch(error => console.error(error))
    })

    app.get('/search', (req, res) => {

        db.collection('quotes').find(req.query).toArray()
            .then(results => {
                console.log(results)
                return res.json(results);
            })
            .catch(error => console.error(error))

    })

    app.get('/search/:key', (req, res) => {

        db.collection('quotes').find({ ilayda: `${req.params.key}` }).toArray()
            .then(results => {
                console.log(results)
                return res.json(results);
            })
            .catch(error => console.error(error))

    })
})

/*
app.get('/users', (req, res) => {
    return res.send(Object.values(users));
});

app.get('/users/:userId', (req, res) => {
    return res.send(users[req.params.userId]);
});


app.get("/url", (req, res, next) => {
    res.json(["eswjke", "afsdd"]);
});
*/