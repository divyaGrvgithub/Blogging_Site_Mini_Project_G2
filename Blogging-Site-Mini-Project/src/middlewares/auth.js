const blogModel = require('../Models/BlogsModel');
const jwt = require('jsonwebtoken');
const ObjectId = require("mongoose").Types.ObjectId

//=============================================== Authentication <=============================================//

const tokenAuthentication = async function (req, res, next) {
    try {
        let token = req.headers["x-api-key"]
        if (!token) token = req.headers["x-api-Key"]
        if (!token) return res.status(400).send({ status: false, msg: "Token is required" })
        try {
            decodeToken = jwt.verify(token, "functionUp-project-blogging-site")
        } catch (err) {
            return res.status(401).send({ status: false, msg: "Error", error: err.message })
        }
        next()
    } catch (err) {
        return res.status(500).send({ status: false, msg: "Error", error: err.message })
    }
}

// =============================================== Authorization =======================================================//
const tokenAuthorization = async function (req, res, next) {
    try {
        let blogId = req.params.blogId || req.query.authorId.category.tags.subcategory
        console.log(blogId)
        if (!blogId) return res.status(400).send({ status: false, msg: "blogId id is required to perform this action." })
        if (!ObjectId.isValid(blogId))
            return res.status(400).send({ status: false, msg: "Not a valid blog id" })
        let getBlog = await blogModel.findById(blogId)
        if (!getBlog)
            return res.status(404).send({ status: false, msg: "Blog Not Found." })
        if (decodeToken.authorId.toString() !== getBlog.authorId.toString())
            return res.status(403).send({ status: false, msg: "You are not authorize to perform the action." })
        next();
    }
    catch (err) {
        console.log(err.message)
        return res.status(500).send({ status: false, msg: "Error", error: err.message })
    }
}
module.exports.tokenAuthentication = tokenAuthentication;
module.exports.tokenAuthorization = tokenAuthorization;
