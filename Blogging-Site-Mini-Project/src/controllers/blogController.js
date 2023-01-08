//______________________ Import or Require Modules ________________________________//

const blogModel = require("../Models/BlogsModel");
const authorModel = require("../Models/AuthorModel");
const validators = require("../Validation/validator");
const validator = require("validator")

const idcheck = function (value) {
  let a = validator.isMongoId(value)
  if (!a) {
    return true
  } else return false
}

//______________________ post api : Create Blog ________________________________//
//<--------------------This API used for Create Blogs-------------->//

const createBlog = async (req, res) => {
    try {
        const data = req.body;
        if (Object.keys(data).length == 0) {
            return res
                .status(400)
                .send({ status: false, message: "All Keys are Mandatory" });
        }
        const { title, body, tags, authorId, subcategory, category } = data;
        if (!title) {
            return res.status(400).send({ status: false, msg: "title is required" });
        }
        if (!body) {
            return res.status(400).send({ status: false, msg: "body is required" });
        }
        if (!tags) {
            return res.status(400).send({ status: false, msg: "tags is required" });
        }
        if (!subcategory) {
            return res.status(400).send({ status: false, msg: "subcategory is required" });
        }
        if (!validators.isValidObjectId(authorId)) {
            return res
                .status(400)
                .send({ status: false, msg: `${authorId} is not a valid authorId` });
        }
        if (!category) {
            return res
                .status(400)
                .send({ status: false, msg: "category title is required" });
        }
        const author = await authorModel.findById(authorId);
        if (!author) {
            return res
                .status(400)
                .send({ status: false, msg: "author does not exist" });
        }
        const savedData = await blogModel.create(data);
        res.status(201).send({ status: true, data: savedData });
    } catch (err) {
        return res.status(500).send({ status: false, err: err.message });
    }
};

//______________________ get api : get Blog ________________________________//
//<----------------This API used for Fetch Blogs of Logged in Author----------->//

const getBlogs = async function (req, res) {
    try {
        let data = req.query;
        let filter = {
            isdeleted: false,
            isPublished: true,
            ...data,
        };
        const { category, subcategory, tags, authorId } = data;
        if (authorId) {
            let verifyAuthorId = await blogModel.find({ authorId: authorId })
            if (verifyAuthorId.length == 0) {
                return res
                    .status(400)
                    .send({ status: false, msg: "No blogs in this AuthorId exist" });
            }
        }
        if (category) {
            let verifyCategory = await blogModel.find({ category: category });
            if (verifyCategory.length == 0) {
                return res
                    .status(400)
                    .send({ status: false, msg: "No blogs in this category exist" });
            }
        }
        if (tags) {
            let verifyTags = await blogModel.find({ tags: tags });
            if (verifyTags.length == 0) {
                return res
                    .status(400)
                    .send({ status: false, msg: "No blogs in this tags exist" });
            }
        }

        if (subcategory) {
            let verifySubcategory = await blogModel.find({ subcategory: subcategory });
            if (!verifySubcategory) {
                return res
                    .status(400)
                    .send({ status: false, msg: "No blogs in this Subcategory exist" });
            }
        }

        let getSpecificBlogs = await blogModel.find(filter)
        if (getSpecificBlogs.length == 0) {
            return res
                .status(400)
                .send({ status: false, data: "No blogs can be found" });
        } else {
            return res.status(200).send({ status: true, data: getSpecificBlogs });
        }
    } catch (error) {
        res.status(500).send({ status: false, err: error.message });
    }
};

//______________________ PUT api : Update Blog ________________________________//
//<----------------This API used for Update Blogs of Logged in Author---------->//

const putBlog = async (req, res) => {
    try {

        let final = { isPublished: true, publishedAt: Date.now() }
        const data = req.params.blogId

        const { title, body, tags, subcategory } = req.body

        if (Object.keys(req.body).length === 0) {
            return res.
                status(400).send({ status: false, msg: "Please enter details" })
        }

        let blogData = await blogModel.findOne({ _id: data });
        if (!blogData) {
            return res.
                status(404)
                .send({ status: false, msg: "Blog not found" })
        }
        if (blogData.isdeleted == true)
            return res.status(404)
                .send({ status: false, msg: "Blog is deleted" })

        if (title) {
            final.title = title
        }
        if (body) {
            final.body = body
        }
        if (tags) {
            let result = []

            if (Array.isArray(tags)) {
                for (let i = 0; i < tags.length; i++) {
                    if (typeof tags[i] !== "string") {
                        return res.status(404).send({ result: "invalid data passed in tags" })
                    }
                }
                result = [...tags]
            }
            else if (typeof tags === "string") { result.push(tags) }
            else {
                return res.status(400).send({ status: false, error: "Invalid data pass " })
            }
            let updatedTag = [...blogData.tags, ...result]
            final.tags = updatedTag;
        }

        if (subcategory) {
            let result = []
            if (Array.isArray(subcategory)) {
                for (let i = 0; i < subcategory.length; i++) {
                    if (typeof subcategory[i] !== "string") {
                        return res.status(404).send({ result: "invalid data passed in subcategory" })
                    }
                }
                console.log(subcategory)
                result = [...subcategory]
            }
            else if (typeof subcategory === "string") { result.push(subcategory) }
            else {

                return res.status(404).send({ result: "invalid data passed in subcategory" })
            }

            let updatedSubcategory = [...blogData.subcategory, ...result]
            final.subcategory = updatedSubcategory;
        }

        let result = await blogModel.findOneAndUpdate({ _id: data }, final, { new: true })
        return res
            .status(200)
            .send({ status: true, data: result })
    } catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
    }
};

//______________________ Delete api : Delete Blog ________________________________
//<----------------These APIs used for Deleting Blogs--------->//

const deleteBlog = async (req, res) => {
    try {
        let blog = req.params.blogId;
        if (!blog) {
            return res.status(400).send({
                status: false,
                msg: "blogId must be present in order to delete it",
            });
        }
        let blogFound = await blogModel.findById({ _id: blog });
        if (!blogFound) {
            return res.status(400).send({
                status: false,
                msg: "No blog exists with this Blog Id, please provide another one",
            });
        }
        if (blogFound.isdeleted !== true) {
            return res.status(404).send({
                status: false,
                msg: "no such id"
            });
        }
        let deletedBlog = await blogModel.findOneAndUpdate(
            { _id: blog },
            { $set: { isdeleted: true }, deletedAt: Date.now() },
            { new: true }
        );
        return res.status(200).send({
            status: true,
            msg: "Your Blog has been successfully deleted",
            deletedData: deletedBlog,
        });
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
};

//______________________ Delete api : Delete Blog by Query ________________________________
//<----------------These APIs used for Deleting Blogs by query of Logged in Author--------->//
const deleteByQuery = async (req, res) => {
    try {
        const { category, authorId, isPublished, tags, subCategory } = req.query

        if (!(category || authorId || isPublished || tags || subCategory)) {
            return res.status(400).send({
                status: false,
                msg: "Kindly enter any value"
            });
        }
        if (authorId) {
            if (idcheck(authorId))
                return res.status(400).send({
                    status: false,
                    msg: "Enter valid authorId"
                });
            let authorLoggedIn = req.token
            if (authorId != authorLoggedIn)
                return res.status(403).send({
                    status: false,
                    msg: 'Access is Denied'
                });
        }
        let check = await blogModel.find({ authorId: req.token, ...req.query, isdeleted: false })

        if (check.length == 0)
            return res.status(404).send({
                error: "no such blog"
            });
        let a = req.query.category

        const update = await blogModel.updateMany({
            authorId: req.token, ...req.query,
            isdeleted: false
        },
            { isdeleted: true, deletedAt: Date.now(), new: true })
        return res.status(200).send({
            status: true,
            data: `${check.length} data deleted`
        });
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
};

//______________________ Export the Modules ________________________________

module.exports.createBlog = createBlog;
module.exports.getBlogs = getBlogs;
module.exports.putBlog = putBlog;
module.exports.deleteBlog = deleteBlog;
module.exports.deleteByQuery = deleteByQuery;
