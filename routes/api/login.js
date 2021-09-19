var express = require('express');
var router = express.Router();
const db = require("../../server")

/* GET users listing. */
router.post('/', function(req, res, next) {
    console.log(db.login(req, res));
});

module.exports = router;
