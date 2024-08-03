const express = require("express");

const router = express.Router();

const { catchErrors } = require("../handlers/errorHandlers");

const {
    isValidToken,
    login,
    logout,
  } = require("../Controller/authAdminContrller");

const { loginDemo } = require("../routers/");
// use {login } from authController , uncomment line below

// for development & production don't use this line router.route("/login").post(catchErrors(loginDemo)); (you should remove it) , this is just demo login contoller

router.route("/logout").post(isValidToken, catchErrors(logout));

module.exports = router;
