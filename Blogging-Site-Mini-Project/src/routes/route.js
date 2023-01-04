//__________________________ Import or Require Library Modules ___________________________________________

const express = require('express')
const router = express.Router()
const blogController = require('../Controllers/blogController')
const authorController = require('../Controllers/authorController')
const MW = require("../middlewares/auth")

//__________________________ get api : for Test ___________________________________________

router.get("/test", (req, res) => {
    return res.send({ status: true, message: "This is My Group1 For Blog Mini Project" });
})

// //__________________________ post api : Create Author ___________________________________________
//<-------------This API used for Create Author---------------->//

router.post("/authors", authorController.createAuthor)

// //__________________________ post api : Login Author ___________________________________________
//<--------------This API used for Log in Author------------------>// 

router.post("/login", authorController.logInUser)

// //__________________________ post api : Create Blog ___________________________________________
//<--------------------This API used for Create Blogs-------------->//

router.post("/blogs", MW.tokenAuthentication, blogController.createBlog)

// //__________________________ get api : Get Blog ___________________________________________
//<----------------This API used for Fetch Blogs of Logged in Author----------->//

router.get("/blogs", MW.tokenAuthentication, blogController.getBlogs)

// //__________________________ put api : Update  ___________________________________________
//<----------------This API used for Update Blogs of Logged in Author---------->//

router.put("/blogs/:blogId", MW.tokenAuthentication, MW.tokenAuthorization, blogController.putBlog)

// //__________________________ delete api : delete  ___________________________________________
//<----------------These APIs used for Deleting Blogs--------->//

router.delete("/blogs/:blogId", MW.tokenAuthentication, MW.tokenAuthorization, blogController.deleteBlog)

// //__________________________ Delete api : Delete by Query ___________________________________________
//<----------------These APIs used for Deleting Blogs by query of Logged in Author--------->//

router.delete("/blogs", MW.tokenAuthentication, MW.tokenAuthorization, blogController.deleteByQuery)


router.all("/*", function (req, res) {
    res.status(404).send({ msg: "invalid http request" })
})

// //__________________________ Export : Router ___________________________________________

module.exports = router;