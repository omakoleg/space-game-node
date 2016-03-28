'use strict';

/*
    db.createCollection( "log", { capped: true, size: 16777216 } )
 */

var db = require('./lib/db');

var cursorOptions = {
    tailable: true,
    awaitdata: true,
    numberOfRetries: Number.MAX_VALUE
};

console.log(`Start worker`);

db.connect((db) => {
    let actionsCollection = db.collection('actions');
    // polling actions
    // to convert tham to events
    var stream = actionsCollection.find({}, cursorOptions).stream();
    stream.on('data', () => {
        actionsCollection.findAndModify(
            { processed: false },
            ['_id'],
            { $set: { processed: true }},
            function (err, obj) {
                if (!obj || !obj.value) {
                    return;
                }
                console.log('Action available: ', obj.value);
                try {
                    require(`./lib/actions/${obj.value.name}.action`).run(obj.value.data, db);
                } catch(e) {
                    console.log('Action error: ', e, obj.value.data);
                }
            }
        );
    });
    stream.on('end', (e) => console.log('End worker stream ', e));
});
