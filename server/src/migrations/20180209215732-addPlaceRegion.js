'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db, callback) {
  addColumn(db)
  .then(() => callback())
  .catch((err) => console.log("Error", err));
};

exports.down = function(db, callback) {
  dropColumn(db)
  .then(() => callback())
  .catch((err) => console.log("Error", err));
};

exports._meta = {
  "version": 1
};

function addColumn(db) {
  return new Promise((resolve, reject) => {
    db.runSql(`ALTER TABLE places
      ADD COLUMN region varchar(100),
      MODIFY COLUMN placeTypeId int NULL DEFAULT NULL,
      ADD INDEX places_location_idx (minLatitude, minLongitude, maxLatitude, maxLongitude)
      `,
    function(err) {
      if (err) return reject(err);
      resolve();
    });
  });
}

function dropColumn(db) {
  return new Promise((resolve, reject) => {
    db.runSql(`ALTER TABLE places
      DROP COLUMN region,
      MODIFY COLUMN placeTypeId int NOT NULL DEFAULT 0,
      DROP INDEX places_location_idx
      `,
    function(err) {
      if (err) return reject(err);
      resolve();
    });
  });
}
