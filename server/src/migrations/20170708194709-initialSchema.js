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
  createUsersTable(db)
  .then(() => createPlaceTypesTable(db))
  .then(() => populatePlaceTypesTable(db))
  .then(() => createPlacesTable(db))
  .then(() => createListsTable(db))
  .then(() => createListPlacesTable(db))
  .then(() => createUserListsTable(db))
  .then(() => createUserPlacesTable(db))
  .then(() => {
    callback();
  });
};

exports.down = function(db, callback) {
  dropTable(db, 'userplaces')
  .then(() => dropTable(db, 'userlists'))
  .then(() => dropTable(db, 'listplaces'))
  .then(() => dropTable(db, 'lists'))
  .then(() => dropTable(db, 'places'))
  .then(() => dropTable(db, 'placetypes'))
  .then(() => dropTable(db, 'users'))
  .then(() => {
    callback();
  });
};

exports._meta = {
  "version": 1
};


function createUsersTable(db) {
  return new Promise((resolve, reject) => {
    db.runSql(`CREATE TABLE IF NOT EXISTS users
      (
        id int NOT NULL PRIMARY KEY auto_increment,
        username varchar(100) NOT NULL,
        email varchar(100) NOT NULL,
        password varchar(64) NOT NULL,
        dateCreated datetime NOT NULL default NOW(),
        userType enum('user','admin') NOT NULL DEFAULT 'user',
        status enum('active','deleted') NOT NULL DEFAULT 'active',
        UNIQUE INDEX username_idx (username),
        UNIQUE INDEX email_idx (email)
      ) ENGINE=InnoDB CHARACTER SET utf8 COLLATE utf8_unicode_ci`,
    function(err) {
      if (err) return reject(err);
      resolve();
    });
  });
}

function createListsTable(db) {
  return new Promise((resolve, reject) => {
    db.runSql(`CREATE TABLE IF NOT EXISTS lists
      (
        id int NOT NULL PRIMARY KEY auto_increment,
        listName varchar(100) NOT NULL,
        creatorUserId int NOT NULL,
        dateCreated datetime NOT NULL default NOW(),
        status enum('active','deleted') NOT NULL DEFAULT 'active',
        FOREIGN KEY
          creator_key (creatorUserId)
          REFERENCES users (id)
      ) ENGINE=InnoDB CHARACTER SET utf8 COLLATE utf8_unicode_ci`,
    function(err) {
      if (err) return reject(err);
      resolve();
    });
  });
}

function createPlacesTable(db) {
  return new Promise((resolve, reject) => {
    db.runSql(`CREATE TABLE IF NOT EXISTS places
      (
        id int NOT NULL PRIMARY KEY auto_increment,
        placeName varchar(100) NOT NULL,
        minLatitude decimal(10,7) NOT NULL,
        minLongitude decimal(10,7) NOT NULL,
        maxLatitude decimal(10,7) NOT NULL,
        maxLongitude decimal(10,7) NOT NULL,
        placeTypeId int NOT NULL,
        shapeType enum('point','polygon','polyline') NOT NULL DEFAULT 'point',
        shapeData text NOT NULL,
        creatorUserId int NOT NULL,
        dateCreated datetime NOT NULL default NOW(),
        status enum('active','deleted') NOT NULL DEFAULT 'active',
        FOREIGN KEY
          creator_key (creatorUserId)
          REFERENCES users (id),
        FOREIGN KEY
          placetype_key (placeTypeId)
          REFERENCES placetypes (id)
      ) ENGINE=InnoDB CHARACTER SET utf8 COLLATE utf8_unicode_ci`,
    function(err) {
      if (err) return reject(err);
      resolve();
    });
  });
}

function createPlaceTypesTable(db) {
  return new Promise((resolve, reject) => {
    db.runSql(`CREATE TABLE IF NOT EXISTS placetypes
      (
        id int NOT NULL PRIMARY KEY auto_increment,
        placeType varchar(100) NOT NULL
      ) ENGINE=InnoDB CHARACTER SET utf8 COLLATE utf8_unicode_ci`,
    function(err) {
      if (err) return reject(err);
      resolve();
    });
  });
}

function populatePlaceTypesTable(db) {
  return new Promise((resolve, reject) => {
    db.runSql(`INSERT INTO placetypes
      (placeType)
      VALUES
        ('Country'),
        ('State'),
        ('County'),
        ('City'),
        ('Point of interest'),
        ('Park'),
        ('Lake'),
        ('Trail')
      `,
    function(err) {
      if (err) return reject(err);
      resolve();
    });
  });
}

function createListPlacesTable(db) {
  return new Promise((resolve, reject) => {
    db.runSql(`CREATE TABLE IF NOT EXISTS listplaces
      (
        listId int NOT NULL,
        placeId int NOT NULL,
        PRIMARY KEY pri_key (listId, placeId),
        FOREIGN KEY
          list_key (listId)
          REFERENCES lists (id)
          ON DELETE CASCADE,
        FOREIGN KEY
          place_key (placeId)
          REFERENCES places (id)
          ON DELETE CASCADE
      ) ENGINE=InnoDB CHARACTER SET utf8 COLLATE utf8_unicode_ci`,
    function(err) {
      if (err) return reject(err);
      resolve();
    });
  });
}

function createUserListsTable(db) {
  return new Promise((resolve, reject) => {
    db.runSql(`CREATE TABLE IF NOT EXISTS userlists
      (
        userId int NOT NULL,
        listId int NOT NULL,
        dateFollowed datetime NOT NULL DEFAULT NOW(),
        PRIMARY KEY pri_key (userId, listId),
        FOREIGN KEY
          user_key (userId)
          REFERENCES users (id)
          ON DELETE CASCADE,
        FOREIGN KEY
          list_key (listId)
          REFERENCES lists (id)
          ON DELETE CASCADE
      ) ENGINE=InnoDB CHARACTER SET utf8 COLLATE utf8_unicode_ci`,
    function(err) {
      if (err) return reject(err);
      resolve();
    });
  });
}

function createUserPlacesTable(db) {
  return new Promise((resolve, reject) => {
    db.runSql(`CREATE TABLE IF NOT EXISTS userplaces
      (
        userId int NOT NULL,
        placeId int NOT NULL,
        dateChecked datetime NOT NULL DEFAULT NOW(),
        PRIMARY KEY pri_key (userId, placeId),
        FOREIGN KEY
          user_key (userId)
          REFERENCES users (id)
          ON DELETE CASCADE,
        FOREIGN KEY
          place_key (placeId)
          REFERENCES places (id)
          ON DELETE CASCADE
      ) ENGINE=InnoDB CHARACTER SET utf8 COLLATE utf8_unicode_ci`,
    function(err) {
      if (err) return reject(err);
      resolve();
    });
  });
}






function dropTable(db, table) {
  return new Promise((resolve, reject) => {
    db.runSql(`DROP TABLE ${table}`, function(err) {
      if (err) return reject(err);
      resolve();
    });
  });
}
