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
  addNewColumn(db)
  .then(() => dropOldColumn(db))
  .then(() => callback())
  .catch((err) => console.log("Error", err));
};

exports.down = function(db, callback) {
  putBackOldColumn(db)
  .then(() => dropNewColumn(db))
  .then(() => callback())
  .catch((err) => console.log("Error", err));
};

exports._meta = {
  "version": 1
};

function addNewColumn(db) {
  return new Promise((resolve, reject) => {
    db.runSql(`ALTER TABLE userplaces
      ADD COLUMN placeImgUrl varchar(200),
      ADD COLUMN placeDescription varchar(250)
    `,
    function(err) {
      if (err) return reject(err);
      resolve();
    });
  });
}

function dropOldColumn(db) {
  return new Promise((resolve, reject) => {
    db.runSql(`ALTER TABLE places
      DROP COLUMN placeImgUrl,
      DROP COLUMN placeDescription`,
    function(err) {
      if (err) return reject(err);
      resolve();
    });
  });
}

function putBackOldColumn(db) {
  return new Promise((resolve, reject) => {
    db.runSql(`ALTER TABLE places
      ADD COLUMN placeImgUrl varchar(200),
      ADD COLUMN placeDescription varchar(250)
    `,
    function(err) {
      if (err) return reject(err);
      resolve();
    });
  });
}

function dropNewColumn(db) {
  return new Promise((resolve, reject) => {
    db.runSql(`ALTER TABLE userplaces
      DROP COLUMN placeImgUrl,
      DROP COLUMN placeDescription`,
    function(err) {
      if (err) return reject(err);
      resolve();
    });
  });
}
