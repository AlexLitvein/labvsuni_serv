const MongoClient = require('mongodb').MongoClient; // npm install --save mongodb

function DataCollector(connectStr) {
  // const url = 'mongodb://dataCollector:data@localhost:27017';
  const url = connectStr;
  const opt = { useUnifiedTopology: true };

  MongoClient.connect(url, opt, function (err, gDB) {
    if (err) throw err;
    const dbo = gDB.db('SensDb');
    dbo.listCollections({ name: 'currSensData' }).toArray(function (err, collections) {
      if (err) throw err;
      if (collections.length === 0) {
        dbo.createCollection('currSensData', { capped: true, size: 256, max: 1 }, function (err, collection) {
          if (err) throw err;
          gDB.close();
        });
        // console.log("coll not exists");
      } else {
        gDB.close();
        // console.log("!exists");
      }
    });
  });

  this.AddSensData = function name(sensData) {
    // const date = new Date();
    // const collName = 'sensData_' + date.getFullYear();
    const collName = 'sensData_' + sensData._id.getFullYear();
    MongoClient.connect(url, opt, function (err, gDB) {
      if (err) throw err;
      const dbo = gDB.db('SensDb');
      dbo.collection(collName).insertOne(sensData, function (err, res) {
        if (err) throw err;
        console.log('1 document inserted');
        gDB.close();
      });
    });
  };

  // temp
  this.AddSensDataMany = function name(nameCollection, arrSensData) {
    MongoClient.connect(url, opt, function (err, gDB) {
      if (err) throw err;
      const dbo = gDB.db('SensDb');
      dbo.collection(nameCollection).insertMany(arrSensData, function (err, res) {
        if (err) throw err;
        // console.log('Many document inserted');
        gDB.close();
      });
    });
  };

  this.GetSensData = function name(nameCollection, date, range, res) {
    MongoClient.connect(url, opt, function (err, gDB) {
      if (err) throw err;
      const dbo = gDB.db('SensDb');
      dbo.collection(nameCollection, function (err, items) {
        if (err) throw err;
        // items.find({ _id: { $gte: date } }, { limit: (range * 24) + 1, sort: { _id: 1 } },
        items.find({ _id: { $gte: date } }, { limit: range * 24 + 1, sort: { _id: 1 } }, function (err, cursor) {
          if (err) throw err;
          cursor.toArray(function (err, itemArr) {
            if (err) throw err;

            // console.log('GetSensData: ' + date);

            res.json(itemArr);
            gDB.close();
          });
          // displayWords("Words starting with a, b or c: ", cursor);
        });
      });
    });
  };

  this.GetCurrSensData = function name(res) {
    MongoClient.connect(url, opt, function (err, gDB) {
      if (err) throw err;
      const dbo = gDB.db('SensDb');
      dbo.collection('currSensData', function (err, items) {
        if (err) throw err;
        items.find({}, function (err, cursor) {
          if (err) throw err;
          cursor.toArray(function (err, itemArr) {
            if (err) throw err;
            // console.log('finding data: %d', itemArr.length);
            res.json(itemArr);
            gDB.close();
          });
        });
      });
    });
  };

  this.AddCurrSensData = function name(sensData) {
    // for shell db.createCollection("currSensData", { capped : true, size : 256, max : 1 } )
    MongoClient.connect(url, opt, function (err, gDB) {
      if (err) throw err;
      const dbo = gDB.db('SensDb');
      dbo.collection('currSensData').insertOne(sensData, function (err, res) {
        if (err) throw err;
        // console.log('1 document inserted');
        gDB.close();
      });
    });
  };
}

module.exports = DataCollector;
