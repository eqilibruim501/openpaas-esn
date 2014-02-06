'use strict';
//
// MongoDB utilities

var MongoClient = require('mongodb').MongoClient;
var url = require('url');
var fs = require('fs');
var mongoose = require('mongoose');
var logger = require('../../../core').logger;
var initialized = false;

function onConnectError(err) {
  logger.error('Failed to connect to MongoDB', err);
}

mongoose.connection.on('error', function(e) {
  onConnectError(e);
  initialized = false;
});


function openDatabase(connectionString, callback) {
  MongoClient.connect(connectionString, function(err, db) {
    if (err && db && ('close' in db)) {
      db.close();
    }
    callback(err, db);
  });
}

function insertDocument(db, collectionName, document, callback) {
  var collection = db.collection(collectionName);
  collection.insert(document, function(err, coll) {
    if (err) {
      db.close(function(err, data) {
        //ignore error
      });
    }
    return callback(err, coll);
  });
}

function dropCollection(db, collectionName, callback) {
  db.dropCollection(collectionName, function(err, data) {
    db.close(function(err, data) {
        //ignore error
    });
    return callback(err);
  });
}

function getConnectionString(hostname, port, dbname, username, password, connectionOptions) {
  var timeout = process.env.MONGO_TIMEOUT || 10000;
  connectionOptions = connectionOptions || {
    connectTimeoutMS: timeout,
    socketTimeoutMS: timeout
  };

  var connectionHash = {
    hostname: hostname,
    port: port,
    pathname: '/' + dbname,
    query: connectionOptions
  };
  if (username) {
    connectionHash.auth = username + ':' + password;
  }

  return 'mongodb:' + url.format(connectionHash);
}

var getTimeout = function() {
  return process.env.MONGO_TIMEOUT || 10000;
};

/**
 * Checks that we can connect to mongodb
 *
 * @param {string} hostname
 * @param {string} port
 * @param {string} dbname
 * @param {string} username
 * @param {string} password
 * @param {function} callback
 */
function validateConnection(hostname, port, dbname, username, password, callback) {

  var connectionString = getConnectionString(hostname, port, dbname, username, password);

  var collectionName = 'connectionTest';
  var document = {test: true};

  openDatabase(connectionString, function(err, db) {
    if (err) {
      return callback(err);
    }
    insertDocument(db, collectionName, document, function(err) {
      if (err) {
        return callback(err);
      }
      dropCollection(db, collectionName, callback);
    });
  });
}

module.exports.validateConnection = validateConnection;
module.exports.getConnectionString = getConnectionString;

function getDefaultOptions() {
  var timeout = getTimeout();
  return {
    db: {
      w: 1,
      native_parser: true,
      fsync: true
    },
    server: {
      socketOptions: {
        connectTimeoutMS: timeout,
        socketTimeoutMS: timeout
      },
      auto_reconnect: true
    }
  };
}

module.exports.getDefaultOptions = getDefaultOptions;

function getConnectionStringAndOptions() {
  var config;
  try {
    config = require(__dirname + '/../../../core').config('db');
  } catch (e) {
    return false;
  }
  if (!config || !config.hostname) {
    return false;
  }
  var options = config.connectionOptions ? config.connectionOptions : getDefaultOptions();
  var url = getConnectionString(config.hostname, config.port, config.dbname, config.username, config.password, config.connectionOptions);
  return {url: url, options: options};
}

module.exports.client = function(callback) {
  var connectionInfos = getConnectionStringAndOptions();
  if (!connectionInfos) {
    return callback(new Error('MongoDB configuration not set'));
  }
  MongoClient.connect(connectionInfos.url, connectionInfos.options, callback);
};

module.exports.init = function() {
  if (initialized) {
    mongoose.disconnect();
    initialized = false;
  }
  var connectionInfos = getConnectionStringAndOptions();
  if (!connectionInfos) {
    return false;
  }


  try {
    mongoose.connect(connectionInfos.url, connectionInfos.options);
  } catch (e) {
    onConnectError(e);
    return false;
  }
  initialized = true;
  return true;
};

module.exports.isInitalized = function() {
  return initialized;
};

// load models
module.exports.models = {};
fs.readdirSync(__dirname + '/models').forEach(function(filename) {
  var stat = fs.statSync(__dirname + '/models/' + filename);
  if (!stat.isFile()) { return; }
  require('./models/' + filename);
});
