const express = require("express");
const router = express.Router();
const axios = require('axios').default;


/* GET goal map */
router.get("/map", function(req, res, next) {
  axios.get('https://challenge.crossmint.io/api/map/d5bae61f-59d3-40ca-98ef-5667082a3710/goal')
  .then(function (response) {
    res.send(response.data);
  });
});

/* call the polyanets endpoint */
router.post("/create-polyanet", function(req, res, next) {
  axios.post('https://challenge.crossmint.io/api/polyanets', req.body)
  .then(function (response) {
    res.send(response.data);
  });
});

/* call the soloons endpoint */
router.post("/create-soloon", function(req, res, next) {
  axios.post('https://challenge.crossmint.io/api/soloons', req.body)
  .then(function (response) {
    res.send(response.data);
  });
});

/* call the comeths endpoint */
router.post("/create-cometh", function(req, res, next) {
  axios.post('https://challenge.crossmint.io/api/comeths', req.body)
  .then(function (response) {
    res.send(response.data);
  });
});

module.exports = router;
