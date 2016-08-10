/**
    Module: @mitchallen/microservice-mongodb-delete
    Author: Mitch Allen
*/

/*jshint esversion: 6 */

"use strict";

module.exports = function (spec, modCallback) {

    let demand = require('@mitchallen/demand');
    let ObjectId = require('mongodb').ObjectID;

    demand.notNull(spec,'ERROR: service parameters not defined.');

    let name = spec.name;
    let version = spec.version;
    let verbose = spec.verbose || false;
    let prefix = spec.prefix;
    let collectionName = spec.collectionName;
    let port = spec.port;
    let mongodb = spec.mongodb;

    demand.notNull(name,'ERROR: service name not defined.');
    demand.notNull(version,'ERROR: service version not defined.');
    demand.notNull(prefix,'ERROR: service prefix not defined.');
    demand.notNull(collectionName,'ERROR: service collection name not defined.');
    demand.notNull(port,'ERROR: service port not defined.');
    demand.notNull(mongodb,'ERROR: service mongodb configuration not defined.');
    demand.notNull(mongodb.uri,'ERROR: service mongodb.uri not defined.');

    let path = "/" + collectionName + "/:id";

    var service = {

        name: name,
        version: version,
        verbose: verbose,
        apiVersion: prefix,
        port: port,
        mongodb: mongodb,

        method: function(info) {
            var router = info.router,
                   db  = info.connection.mongodb.db;
            demand.notNull(db);
            // Reference: https://docs.mongodb.com/getting-started/node/remove/
            // path does not include prefix (set elsewhere)
            router.delete( path, function (req, res) {
                var docId = req.params.id;
                var collection = db.collection(collectionName);
                if( ! ObjectId.isValid(docId) ) 
                {
                    console.error("MongoID ObjectID is not valid: %s", docId);
                    return res
                            .status(404)
                            .send(new Error());
                }
                // Must come AFTER validation or consructor will throw invalid errors
                var objId = new ObjectId(docId);
                collection.findOne({"_id": objId}, function(err, doc) {
                    if (err || !doc) {
                        if( err ) {
                            console.error(err);
                        }
                        res
                            .status(404)
                            .send(err);
                    } else {
                        collection.deleteOne({ "_id": objId}, function(err, results) {
                            res
                                .status(200)
                                .json({ status: "OK" });

                        });
                    }
                });
            });
            return router;
        }
    };

    var callback = modCallback || function(err,obj) {
        if( err ) {
            console.log(err);
            throw new Error( err.message );
        }
    };

    require('@mitchallen/microservice-mongodb')(service, callback);
};