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
  addIconsTable(db)
  .then(() => populateIcons(db))
  .then(() => callback())
  .catch((err) => console.log("Error", err));
};

exports.down = function(db, callback) {
  dropIconsTable(db)
  .then(() => callback())
  .catch((err) => console.log("Error", err));
};

exports._meta = {
  "version": 1
};

function addIconsTable(db) {
  return new Promise((resolve, reject) => {
    db.runSql(`CREATE TABLE IF NOT EXISTS icons (
      id int primary key auto_increment,
      iconUrl varchar(200) not null,
      sortOrder tinyint not null default 0
    ) ENGINE=InnoDB CHARACTER SET utf8 COLLATE utf8_unicode_ci`,
    function(err) {
      if (err) return reject(err);
      resolve();
    });
  });
}

function populateIcons(db) {
  return new Promise((resolve, reject) => {
    db.runSql(`INSERT INTO icons (sortOrder, iconUrl)
      VALUES
      (1, '/assets/images/icons/islands.svg'),
      (2, '/assets/images/icons/globe.svg'),
      (3, '/assets/images/icons/park.svg'),
      (4, '/assets/images/icons/forest.svg'),
      (5, '/assets/images/icons/waterfall.svg'),
      (6, '/assets/images/icons/river.svg'),
      (7, '/assets/images/icons/mountain.svg'),
      (8, '/assets/images/icons/mountains.svg'),
      (9, '/assets/images/icons/beach.svg'),
      (10, '/assets/images/icons/plane.svg'),
      (11, '/assets/images/icons/car.svg'),
      (12, '/assets/images/icons/arch.svg'),
      (13, '/assets/images/icons/statue.svg'),
      (14, '/assets/images/icons/temple.svg'),
      (15, '/assets/images/icons/city.svg'),
      (16, '/assets/images/icons/house.svg'),
      (17, '/assets/images/icons/plate.svg'),
      (18, '/assets/images/icons/medal.svg'),
      (19, '/assets/images/icons/shoe.svg'),
      (20, '/assets/images/icons/skis.svg'),
      (21, '/assets/images/icons/canoe.svg'),
      (22, '/assets/images/icons/bike.svg'),
      (23, '/assets/images/icons/golf.svg'),
      (24, '/assets/images/icons/soccer.svg'),
      (25, '/assets/images/icons/baseball.svg'),
      (26, '/assets/images/icons/football.svg'),
      (27, '/assets/images/icons/coaster.svg'),
      (28, '/assets/images/icons/heart.svg'),
      (29, '/assets/images/icons/rainbow.svg'),
      (30, '/assets/images/icons/person.svg'),
      (31, '/assets/images/icons/check-green.svg'),
      (32, '/assets/images/icons/check-white.svg'),
      (33, '/assets/images/icons/star-blue.svg'),
      (34, '/assets/images/icons/star-green.svg'),
      (35, '/assets/images/icons/star-purple.svg'),
      (36, '/assets/images/icons/star-yellow.svg')
    `,
    function(err) {
      if (err) return reject(err);
      resolve();
    });
  });
}

function dropIconsTable(db) {
  return new Promise((resolve, reject) => {
    db.runSql(`DROP TABLE icons`,
    function(err) {
      if (err) return reject(err);
      resolve();
    });
  });
}
