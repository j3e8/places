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
  .then(() => addToPlaces(db))
  .then(() => addRankToPlaces(db))
  .then(() => addProminence(db))
  .then(() => callback())
  .catch((err) => console.log("Error", err));
};

exports.down = function(db, callback) {
  dropColumn(db)
  .then(() => dropFromPlaces(db))
  .then(() => dropRankFromPlaces(db))
  .then(() => dropProminence(db))
  .then(() => callback())
  .catch((err) => console.log("Error", err));
};

exports._meta = {
  "version": 1
};


function addColumn(db) {
  return new Promise((resolve, reject) => {
    db.runSql(`ALTER TABLE lists
      ADD COLUMN dateModified datetime not null
        DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
      `,
    function(err) {
      if (err) return reject(err);
      resolve();
    });
  });
}

function addToPlaces(db) {
  return new Promise((resolve, reject) => {
    db.runSql(`ALTER TABLE places
      ADD COLUMN dateModified datetime not null
        DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
      `,
    function(err) {
      if (err) return reject(err);
      resolve();
    });
  });
}

function addRankToPlaces(db) {
  return new Promise((resolve, reject) => {
    db.runSql(`ALTER TABLE listplaces
      ADD COLUMN rank int not null default 0
      `,
    function(err) {
      if (err) return reject(err);
      resolve();
    });
  });
}

function addProminence(db) {
  return new Promise((resolve, reject) => {
    db.runSql(`ALTER TABLE users
      ADD COLUMN prominence int not null default 0
      `,
    function(err) {
      if (err) return reject(err);
      resolve();
    });
  });
}

function dropColumn(db) {
  return new Promise((resolve, reject) => {
    db.runSql(`ALTER TABLE lists
      DROP COLUMN dateModified
      `,
    function(err) {
      if (err) return reject(err);
      resolve();
    });
  });
}

function dropFromPlaces(db) {
  return new Promise((resolve, reject) => {
    db.runSql(`ALTER TABLE places
      DROP COLUMN dateModified
      `,
    function(err) {
      if (err) return reject(err);
      resolve();
    });
  });
}

function dropRankFromPlaces(db) {
  return new Promise((resolve, reject) => {
    db.runSql(`ALTER TABLE listplaces
      DROP COLUMN rank
      `,
    function(err) {
      if (err) return reject(err);
      resolve();
    });
  });
}

function dropProminence(db) {
  return new Promise((resolve, reject) => {
    db.runSql(`ALTER TABLE users
      DROP COLUMN prominence
      `,
    function(err) {
      if (err) return reject(err);
      resolve();
    });
  });
}
