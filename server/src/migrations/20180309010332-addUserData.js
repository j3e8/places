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
    db.runSql(`ALTER TABLE users
      ADD COLUMN imgUrl varchar(200),
      ADD COLUMN bio varchar(250)
      `,
    function(err) {
      if (err) return reject(err);
      resolve();
    });
  });
}

function dropColumn(db) {
  return new Promise((resolve, reject) => {
    db.runSql(`ALTER TABLE users
      DROP COLUMN imgUrl,
      DROP COLUMN bio
      `,
    function(err) {
      if (err) return reject(err);
      resolve();
    });
  });
}
