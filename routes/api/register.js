var express = require('express');
var router = express.Router();
const db = require("../../server")

/* GET users listing. */
router.post('/', function(req, res, next) {
    console.log(db.register(req, res));
    console.log(req.body);
});

module.exports = router;
