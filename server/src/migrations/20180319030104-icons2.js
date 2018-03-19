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
  addIconsToLists(db)
  .then(() => addDefaultIcon(db))
  .then(() => disallowNull(db))
  .then(() => callback())
  .catch((err) => console.log("Error", err));
};

exports.down = function(db, callback) {
  dropIconsFromLists(db)
  .then(() => callback())
  .catch((err) => console.log("Error", err));
};

exports._meta = {
  "version": 1
};

function addIconsToLists(db) {
  return new Promise((resolve, reject) => {
    db.runSql(`ALTER TABLE lists
      ADD COLUMN iconId int
    `,
    function(err) {
      if (err) return reject(err);
      resolve();
    });
  });
}

function addDefaultIcon(db) {
  return new Promise((resolve, reject) => {
    db.runSql(`UPDATE lists
      SET iconId = (SELECT id FROM icons WHERE sortOrder = (SELECT MAX(sortOrder) FROM icons))
    `,
    function(err) {
      if (err) return reject(err);
      resolve();
    });
  });
}

function disallowNull(db) {
  return new Promise((resolve, reject) => {
    db.runSql(`ALTER TABLE lists
      MODIFY COLUMN iconId int NOT NULL
    `,
    function(err) {
      if (err) return reject(err);
      resolve();
    });
  });
}

function dropIconsFromLists(db) {
  return new Promise((resolve, reject) => {
    db.runSql(`ALTER TABLE lists
      DROP COLUMN iconId`,
    function(err) {
      if (err) return reject(err);
      resolve();
    });
  });
}
