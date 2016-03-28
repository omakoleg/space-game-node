'use strict';

/*
    solarsystem_id: ObjectId,
    palnet_id: ObjectId,

    // data`
    name: String,
    x: Number,
    y: Number,
    color: String,

    // body
    capacity: Number,
    speed: Number,
    structure: Number,
    devicesCount: Number,
    race: String,
    bodyType: String
 */
var mongodb = require('mongodb');
var settings = require('./settings');

var object = {
    db: null,
    connect: function(cb){
        mongodb.MongoClient.connect(settings.db, (e, dbLocal) => {
            if(e) {
                console.log(e, r.result);
            } else {
                this.db = dbLocal;
                cb && cb(dbLocal);
            }
        });
    },
    create: function(collectionName, data, cb) {
        this.db.collection(collectionName).insertOne(data, (e, r) => {
            if(e) {
                console.log(e, r.result);
            }
            cb && cb(r);
        });
    },
    removeOne: function(collectionName, query, cb) {
        this.db.collection(collectionName).deleteOne(query, (e, r) => {
            if(e) {
                console.log(e, r.result);
            }
            cb && cb(r);
        });
    }
};

function off(){
    console.log('Graceful close');
    object.db && object.db.close();
}

// process.on('SIGTERM', off);
// process.on('SIGINT' , off);

module.exports = object;

