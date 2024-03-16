const express = require("express");
const theodoi = require("../controllers/theodoi.controller");

const router =express.Router();

router.route("/")
    .get(theodoi.findAll)
    .post(theodoi.create)
    .delete(theodoi.deleteAll);

router.route("/favorite")
    .get(theodoi.findAllFavorite);

router.route("/:id")
    .get(theodoi.findOne)
    .put(theodoi.update)
    .delete(theodoi.delete);

module.exports=router; 