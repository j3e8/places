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
  addFK(db)
  .then(() => callback())
  .catch((err) => console.log("Error", err));
};

exports.down = function(db, callback) {
  dropFK(db)
  .then(() => callback())
  .catch((err) => console.log("Error", err));
};

exports._meta = {
  "version": 1
};

function addFK(db) {
  return new Promise((resolve, reject) => {
    db.runSql(`ALTER TABLE lists
      ADD CONSTRAINT FOREIGN KEY lists_iconId_fk (iconId)
        REFERENCES icons(id)
    `,
    function(err) {
      if (err) return reject(err);
      resolve();
    });
  });
}

function dropFK(db) {
  return new Promise((resolve, reject) => {
    db.runSql(`ALTER TABLE lists
      DROP FOREIGN KEY lists_iconId_fk`,
    function(err) {
      if (err) return reject(err);
      resolve();
    });
  });
}
