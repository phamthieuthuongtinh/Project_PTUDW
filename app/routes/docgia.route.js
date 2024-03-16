const express = require("express");
const docgia = require("../controllers/docgia.controller");

const router =express.Router();

router.route("/")
    .get(docgia.findAll)
    .post(docgia.create)
    .delete(docgia.deleteAll);

router.route("/favorite")
    .get(docgia.findAllFavorite);

router.route("/:id")
    .get(docgia.findOne)
    .put(docgia.update)
    .delete(docgia.delete);

module.exports=router; 