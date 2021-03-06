module.exports = Utils = function() {
  var mongodb = require('mongodb')
    , Db = mongodb.Db
    , Server = mongodb.Server
    , store = mongodb.GridStore
    , model = require('./node_modules/mongolia/lib/model')
    , validator = require('./node_modules/mongolia/lib/validator')
    , db = new Db(process.env.DB || 'simaya', new Server(process.env.HOST || 'localhost', 27017, {auto_reconnect: true, native_parser: true}), {safe: false, j:true})
    , ObjectID = db.bson_serializer.ObjectID

  
  var simaya = {
    administrationRole: 'tatausaha', 
    administratorEmail: 'Administrator Simaya <no-reply@layanan.go.id',
    url: 'https://simaya.layanan.go.id',
    smtp: {
      // Using all default values
      //service: 'Gmail',
      //host: '127.0.0.1',
      /*
      auth: {
        user: '',
        pass: '',
      }*/
    },
    gearmanServer: [
      { host: process.env.GEARMAN || "127.0.0.1" },
    ],
    installationId: process.env.INSTALL_ID || "",
    installation : process.env.INSTALL || "service", // set it to local for `L` 
  }

  if (simaya.installation == "local" &&
      simaya.installationId == "0") {
    console.log("Installation ID must be set for local installation");
    process.exit();
  }

if (simaya.installation == "local" &&
    simaya.installationId) {
    var fs = require("fs");
    var certFile = __dirname + "/certs/local/private.pem";
    if (!fs.existsSync(certFile)) {
      console.log("Please install siMAYA-L local private key in " + certFile);
      process.exit(-1);
    }
    simaya.privateCertFile = certFile;
  }

  var grid = require("gridfs-stream")(db, mongodb);
  return {
    db: db
    , model: model
    , validator: validator
    , store: store
    , ObjectID: ObjectID
    , simaya: simaya
    , grid: grid
  }
}();
