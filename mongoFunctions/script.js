var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://127.0.0.1:27017/";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("academiaLuis");
  dbo.collection('alumnos').aggregate([
    { $lookup:
       {
         from: 'profesores',
         localField: 'Profesor',
         foreignField: '_id',
         as: 'profesorDetails'
       }
    }
    ]).toArray(function(err, res) {
    if (err) throw err;
    console.log(JSON.stringify(res));
    db.close();
  });
});