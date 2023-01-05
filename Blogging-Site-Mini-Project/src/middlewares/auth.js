const blogModel = require('../Models/BlogsModel');
const jwt = require('jsonwebtoken');
const ObjectId = require("mongoose").Types.ObjectId

//=============================================== Authentication <=============================================//

const tokenAuthentication = (req, res, next) => {
    try {
        let token = req.headers["x-api-key"];
        if (!token) {
          return res.
          status(400).send({ status: false, msg: "the header token is required." });
        }  
        let decoded = jwt.verify(token, "functionUp-project-blogging-site");
        if (!decoded) {
          return res.
          status(401).send({ status: false, msg: "Invalid token id." });
        }
        next();
      } catch (err) {
        res.status(500).send({ msg: "Error", Error: err.message });
      }
}

// =============================================== Authorization =======================================================//
const tokenAuthorization = (req, res, next) => {
    try {
        let token = req.headers["x-api-key"];
        if (!token) {
            return res.status(400).send({ status: false, msg: "the header token is required." });
        }
        let decoded = jwt.verify(token, "functionUp-project-blogging-site");
        if (!decoded) {
            return res.
            status(401).send({ status: false, msg: "Invalid token id." });
        }
        if (decoded.userId != req.params.userId) {
            return res.
            status(403).send({ status: false, msg: "The loggdin user is not authorized." });
        }
        next();
    } catch (err) {
        res.status(500).send({ msg: "Error", Error: err.message });
    }
}

module.exports.tokenAuthentication = tokenAuthentication;
module.exports.tokenAuthorization = tokenAuthorization;
