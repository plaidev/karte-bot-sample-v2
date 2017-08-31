const express = require('express');
const router = express.Router();
const config = require('../config');
const _send = require('../logics/_send');

/* GET home page. */

router.get('/', (req, res, next) => {
  return res.render('index', {title: 'karte io bot sample server'});
});

module.exports = router;
