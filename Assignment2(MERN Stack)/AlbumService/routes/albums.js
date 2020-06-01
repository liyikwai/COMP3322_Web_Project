var cors = require('cors');
var express = require('express');
var router = express.Router();
var fs = require('fs');
var cookieID;
var user;
var corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true
}

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});


router.get('/init', cors(corsOptions), function (req, res) {
    var db = req.db;
    var collection = db.get('userList');
    if (req.cookies.cookieID) {
        var value = JSON.parse(req.cookies.cookieID);
        collection.find({ _id: value }, {}, function (err, docs) {
            if (err === null) {
                cookieID = docs[0]._id;
                res.send(docs);
            }
            else {
                res.send({ msg: err })
            };
        });
    } else {
        res.send([]);
    }
});

router.post('/login', cors(corsOptions), function (req, res) {
    var db = req.db;
    var collection = db.get('userList');
    var Username = req.body.Username;
    var Password = req.body.Password;
    user = req.body.Username;
    collection.find({ username: Username, password: Password }, {}, function (err, docs) {
        if (err === null) {
            if (JSON.stringify(docs) === "[]") {
                res.send({ username: "Login failure" });
            }
            else {
                friends = docs[0].friends;
                var milliseconds = 60 * 60 * 1000;
                cookieID = docs[0]._id;
                var id = cookieID.toString();
                var ID = JSON.stringify(cookieID);
                res.cookie('cookieID', ID, { maxAge: milliseconds });
                res.send(docs);
            }
        }
        else {
            res.send({ msg: err });
        }
    });
});

router.get('/logout', cors(corsOptions), function (req, res) {
    res.clearCookie('cookieID');
    res.send('');
});

router.get('/getalbum/:userid', cors(corsOptions), function (req, res) {
    var db = req.db;
    var photoList = db.get('photoList');
    var userList = db.get('userList');
    var userid = req.params.userid;
    if (userid === "0") {
        var id = cookieID.toString();
        var filter = { "userid": id };
        photoList.find(filter, {}, function (err, docs) {
            if (err === null) {
                res.json(docs);
            }
            else res.send({ msg: err });
        });
    }
    else {
        var id = JSON.stringify(userid);
        userList.find({ username: userid }, {}, function (err, docs) {
            if (err === null) {
                photoList.find({ "userid": docs[0]._id.toString() }, {}, function (err, docs) {
                    if (err === null) {
                        res.json(docs);
                    }
                    else res.send({ msg: err });
                });
            }
        });
    }

});

router.post('/uploadphoto', cors(corsOptions), function (req, res) {
    var db = req.db;
    var collection = db.get('photoList');
    var name = Math.floor(Math.random() * 100001) + '.jpg';
    var path = './public/uploads/' + name;
    var URL = 'http://localhost:3002/uploads/' + name;
    var id = cookieID.toString();
    var photo = { 'url': URL, 'userid': id, 'likedby': [] };
    collection.insert(photo, function (err, result) {
        if (err === null) {
            collection.find({ userid: id }, {}, function (err, docs) {
                if (err === null) {
                    req.pipe(fs.createWriteStream(path));
                    res.json(docs);
                }
                else res.send({ msg: err });
            });
        }
    });
});

router.delete('/deletephoto/:photoid', cors(corsOptions), function (req, res) {
    var db = req.db;
    var photoid = req.params.photoid;
    var collection = db.get('photoList');
    var photo;
    var id = cookieID.toString();
    collection.find({ '_id': photoid }, {}, function (err, docs) {
        if (err === null) {
            photo = docs[0].url.slice(30);
            var path = './public/uploads/' + photo;
            fs.unlink(path, (err) => {
                if (err) throw err;
                console.log('');
            });
        }

        collection.remove({ '_id': photoid }, function (err, result) {
            if (err === null) {
                collection.find({ userid: id }, {}, function (err, docs) {
                    if (err === null) {
                        res.json(docs);
                    }
                    else {
                        res.send({ msg: err });
                    }
                });
            }
        });
    });
});

router.put('/updatelike/:photoid', cors(corsOptions), function (req, res) {
    var db = req.db;
    var collection = db.get('photoList');
    var photoid = req.params.photoid;
    var like;
    var userid;
    collection.find({ '_id': photoid }, {}, function (err, docs) {
        if (err === null) {
            like = docs[0].likedby;
            userid = docs[0].userid
            like.push(user);
            collection.update({ '_id': photoid }, { $set: { "likedby": like } }, function (err, result) {
                if (err === null) {
                    collection.find({ userid: userid }, {}, function (err, docs) {
                        if (err === null) {
                            res.json(docs);
                        }
                        else {
                            res.send({ msg: err });
                        }
                    });
                }
            })
        }
    })
});


/*
 * Handle preflighted request
 */
router.options("/*", cors(corsOptions));

module.exports = router;
