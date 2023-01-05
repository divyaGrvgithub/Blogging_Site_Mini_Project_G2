//______________________ Import or Require Modules ________________________________//

const blogModel = require("../Models/BlogsModel");
const authorModel = require("../Models/AuthorModel");
const validator = require("../Validation/validator");

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
        const { title, body, authorId, category } = data;
        if (!title) {
            return res.status(400).send({ status: false, msg: "title is required" });
        }
        if (!body) {
            return res.status(400).send({ status: false, msg: "body is required" });
        }
        if (!validator.isValidObjectId(authorId)) {
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

const getBlogs = async (req, res) => {
    try {
        let data = req.query;
        let filter = {
            isdeleted: false,
            isPublished: true,
            ...data,
        };
        const { category, subcategory, tags, authorId } = data;
        if (authorId) {
            console.log(authorId)
            let verifyAuthorId = await blogModel.find({ authorId: authorId });
            if (!verifyAuthorId) {
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
        let getSpecificBlogs = await blogModel.find(filter);
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
        let data = req.body;
        let authorId = req.query.authorId;
        let id = req.params.blogId;
        if (!id) {
            return res
                .status(400)
                .send({ status: false, message: "Blog Id is Mandatory" });
        }
        if (Object.keys(data).length == 0) {
            return res.status(400).send({
                status: false,
                message: "Please Enter the Valid Key and Value to Update",
            });
        }
        if (!validator.isValidObjectId(id)) {
            return res
                .status(400)
                .send({ status: false, msg: "this is not a valid blog Id" });
        }
        const deleteBlog = await blogModel.findById(id);
        if (!deleteBlog.isdeleted == true) {
            return res
                .status(404)
                .send({ status: false, msg: "Blog already Deleted" });
        }
        let blogFound = await blogModel.findOne({ _id: id });
        if (!blogFound) {
            return res
                .status(400)
                .send({ status: false, msg: "No Blog with this Id exist" });
        }
        if (blogFound.authorId != authorId) {
            return res.status(401).send({
                status: false,
                msg: "You are trying to perform an Unauthorized action",
            });
        }
        let updatedBlog = await blogModel.findOneAndUpdate(
            { _id: id },
            {
                $addToSet: { tags: data.tags, subcategory: data.subcategory },
                $set: { title: data.title, body: data.body, category: data.category },
            },
            { new: true, upsert: true }
        );
        return res.status(200).send({ status: true, data: updatedBlog });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

//______________________ Delete api : Delete Blog ________________________________
//<----------------These APIs used for Deleting Blogs--------->//

const deleteBlog = async (req, res) => {
    try {
        let blog = req.params.blogId;
        let authorId = req.query.authorId;
        if (!blog) {
            return res.status(400).send({
                status: false,
                msg: "blogId must be present in order to delete it",
            });
        }
        let blogFound = await blogModel.findOne({ _id: blog });
        if (!blogFound) {
            return res.status(400).send({
                status: false,
                msg: "No blog exists with this Blog Id, please provide another one",
            });
        }
        if (blogFound.authorId != authorId) {
            return res.status(401).send({
                status: false,
                msg: "You are trying to perform an Unauthorized action",
            });
        }
        if (!blogFound.isdeleted === true) {
            return res
                .status(404)
                .send({ status: false, msg: "this blog has been deleted by You" });
        }
        let deletedBlog = await blogModel.findOneAndUpdate(
            { _id: blog },
            { $set: { isdeleted: true }, deletedAt: Date.now() },
            { new: true, upsert: true }
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

        const queryParams = req.query;  //category, authorid, tag name, subcategory name
        if (Object.keys(queryParams).length == 0)
            return res.
                status(400).send({ status: false, msg: "Please enter some data in the body" });

        const blog = await blogModel.find({ $and: [queryParams, { isDeleted: true }, { isPublished: false }] });

        if (Object.keys(blog).length == 0)
            return res.
                status(404).send({ msg: "Document is already Deleted " })

        const updatedBlog = await blogModel.updateMany(queryParams,
            { $set: { isDeleted: true, isPublished: false, deletedAt: Date.now() } },
            { new: true });

        return res.
            status(200).send({ status: true, data: updatedBlog })
    }
    catch (err) {
        return res.status(500).send({ error: err.message })
    }
}

//______________________ Export the Modules ________________________________

module.exports.createBlog = createBlog;
module.exports.getBlogs = getBlogs;
module.exports.putBlog = putBlog;
module.exports.deleteBlog = deleteBlog;
module.exports.deleteByQuery = deleteByQuery;
