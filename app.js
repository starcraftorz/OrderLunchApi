//app.js
//create by Max Yi-Hsun Chou

var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var mongoOp     =   require("./models/db");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 3000;

// =============================================================================
var router = express.Router();

// write and config api routes below

router.route('/')
    .all(function(req, res) {
      res.json({"status": "Eroor",
                "message": "hey guy! Nothing here!"
              })
    });

router.route('/order/add')
      .post(function(req,res){
          var db = new mongoOp();
          var response = {};
          //add param process
          var studentId = req.param('studentid');
          var studentNumber = req.param('studentnumber');
          var mealNumber = req.param('mealnumber');

          //db data insert process
          db.studentId = studentId;
          db.studentNumber = studentNumber;
          db.mealNumber = mealNumber;
          db.createTime = Date.now();
          // Hash the password using SHA1 algorithm.
          db.save(function(err){
          // save() will run insert() command of MongoDB.
          // it will add new data in collection.
              if(err) {
                  response = {"message" : "error"};
              } else {
                  response = {"message" : "success"};
              }
              res.json(response);
          });
      });


router.route('/order/views')
    .get(function(req, res) {
      var response = {};
        mongoOp.find({},function(err, data){
        // Mongo command to fetch all data from collection.
            if(err) {
                response = {"message" : "Error fetching data"};
            } else if (data == 0) {
                response = {"message" : "No any data to show."};
            } else {
                response = {"message" : data}
            }
            res.json(response);
        });
    });

router.route('order/views/:id')
    .all(function(req, res) {
      var response = {};
        mongoOp.findById(req.params.id, function(err, data){
        // This will run Mongo Query to fetch data based on ID.
            if(err) {
                response = {"error" : true, "message" : "Error fetching data"};
            } else {
                response = {"error" : false, "message" : data};
            }
            res.json(response);
        });
    });

// =============================================================================
// Success
app.use('/api', router);


// Handle 500
app.use(function(error, req, res, next) {
  res.send('500: Internal Server Error', 500);
});

app.listen(port);
console.log('Api server is already run on ' + port);
