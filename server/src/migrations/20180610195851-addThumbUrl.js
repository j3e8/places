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
  addcolumn(db)
  .then(() => callback())
  .catch((err) => console.log("Error", err));
};

exports.down = function(db, callback) {
  revert(db)
  .then(() => callback())
  .catch((err) => console.log("Error", err));
};

exports._meta = {
  "version": 1
};

function addcolumn(db) {
  return new Promise((resolve, reject) => {
    db.runSql(`ALTER TABLE userplaces
      ADD COLUMN placeThumbUrl varchar(200) after placeImgUrl
    `,
    function(err) {
      if (err) return reject(err);
      resolve();
    });
  });
}

function revert(db) {
  return new Promise((resolve, reject) => {
    db.runSql(`ALTER TABLE userplaces
      DROP COLUMN placeThumbUrl
    `,
    function(err) {
      if (err) return reject(err);
      resolve();
    });
  });
}
