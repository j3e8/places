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
  addOfficialColumn(db)
  .then(() => addFollowers(db))
  .then(() => callback())
  .catch((err) => console.log("Error", err));
};

exports.down = function(db, callback) {
  dropOfficialColumn(db)
  .then(() => dropFollowers(db))
  .then(() => callback())
  .catch((err) => console.log("Error", err));
};

exports._meta = {
  "version": 1
};

function addOfficialColumn(db) {
  return new Promise((resolve, reject) => {
    db.runSql(`ALTER TABLE lists
      ADD COLUMN official tinyint not null default 0
      `,
    function(err) {
      if (err) return reject(err);
      resolve();
    });
  });
}

function addFollowers(db) {
  return new Promise((resolve, reject) => {
    db.runSql(`CREATE TABLE IF NOT EXISTS userFollowers
      (
        userId int not null,
        followsUserId int not null,
        dateFollowed datetime not null default now(),
        PRIMARY KEY userFollowers_pri_idx (userId, followsUserId)
      ) ENGINE=InnoDB CHARACTER SET utf8 COLLATE utf8_unicode_ci`,
    function(err) {
      if (err) return reject(err);
      resolve();
    });
  });
}

function dropOfficialColumn(db) {
  return new Promise((resolve, reject) => {
    db.runSql(`ALTER TABLE lists
      DROP COLUMN official
      `,
    function(err) {
      if (err) return reject(err);
      resolve();
    });
  });
}

function dropFollowers(db) {
  return new Promise((resolve, reject) => {
    db.runSql(`DROP TABLE userFollowers`,
    function(err) {
      if (err) return reject(err);
      resolve();
    });
  });
}
