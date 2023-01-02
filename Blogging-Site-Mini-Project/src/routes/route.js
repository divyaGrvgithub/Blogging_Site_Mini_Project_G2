//__________________________ Import or Require Module ___________________________________________

const express = require('express')
const router = express.Router()
const blogController = require('../Controllers/blogController')
const authorController = require('../Controllers/authorController')
const MW = require('../middlewares/auth.js')

//__________________________ get api : for Test ___________________________________________

router.get("/test", function (req, res) {
    return res.send({ status: true, message: "This is My Group7 For Blog Mini Project" });
})

// //__________________________ post api : Create Author ___________________________________________

router.post("/authors", authorController.createAuthor)

// //__________________________ post api : Login Author ___________________________________________

router.post("/login", authorController.logInUser)

// //__________________________ post api : Create Blog ___________________________________________

router.post("/blogs", blogController.createBlog)

// //__________________________ get api : Get Blog ___________________________________________

router.get("/blogs", blogController.getBlogs)

// //__________________________ put api : Update  ___________________________________________

router.put("/blogs/:blogId", blogController.putBlog)

// //__________________________ delete api : delete  ___________________________________________

router.delete("/blogs/:blogId", blogController.deleteBlog)

// //__________________________ Delete api : Delete by Query ___________________________________________

router.delete("/blogs", blogController.blogByQuery)

// //__________________________ Export : Router ___________________________________________

module.exports = router;