"use strict";

let demand = require('@mitchallen/demand');
let prefix = process.env.MUSIC_DELETE_API_VERSION || '/v1';

var service = {

    name: require("./package").name,
    version: require("./package").version,
    verbose: true,
    prefix: prefix,
    port: process.env.MUSIC_DELETE_PORT || 8006,
    mongodb: {
        uri: process.env.TEST_MONGO_URI || 'mongodb://localhost/test',
    },
    collectionName: "music",
};

require('@mitchallen/microservice-mongodb-delete')(service, function(err,obj) {
    if( err ) {
        console.log(err);
        throw new Error( err.message );
    }
});