//______________________ Import or Require Modules ________________________________

const mongoose = require("mongoose")
const objectId = mongoose.Schema.Types.ObjectId;

//____________________________ Creating Schema _____________________________________

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    authorId: {
        type: objectId,
        ref: 'Project1Author'
    },
    tags: [String],

    category: {
        type: String,
        required: true
    },
    subcategory: {
        type: [String]
    },
    deletedAt: {
        type: Date
    },
    isdeleted: {
        type: Boolean,
        default: false
    },
    publishedAt: {
        type: Date
    },
    isPublished: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

//__________________________ Exporting Blog Schema ___________________________________________

module.exports = new mongoose.model("Project1Blog", blogSchema)