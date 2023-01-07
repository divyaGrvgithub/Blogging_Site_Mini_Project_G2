//______________________ Import or Require Modules ________________________________//

const authorModel = require("../Models/AuthorModel");
const validator = require("../Validation/validator");
const jwt = require("jsonwebtoken");

//______________________ post api : Create Author ________________________________
//<-------------This API used for Create Authors---------------->//


const createAuthor = async (req, res) => {
    try {
        const data = req.body;

        if (Object.keys(data).length == 0) {
            return res
                .status(400)
                .send({ status: false, message: "All Field are Mandatory" });
        }

        const { fname, lname, title, email, password } = data;

        if (!validator.isValidName(fname)) {
            return res
                .status(400)
                .send({ status: false, msg: "first name is required" });
        }

        if (!validator.isValidName(lname)) {
            return res
                .status(400)
                .send({ status: false, msg: "last name is required" });
        }

        if (!title) {
            return res.status(400).send({ status: false, msg: "title is required" });
        } else {
            if (title.trim() != "Mr" && title.trim() != "Mrs" && title.trim() != "Miss") {
                return res
                    .status(400)
                    .send({ status: false, msg: "title can be Mr. Miss or Mrs " });
            }
        }
        if (!validator.isValidEmail(email)) {
            return res
                .status(400)
                .send({ status: false, msg: "Please Enter Valid Email Address" });
        }
        const isEmailAlreadyUsed = await authorModel.findOne({ email });
        if (isEmailAlreadyUsed) {
            return res.status(200).send({
                status: false,
                msg: "Oooh...Email already Registered. Please Login...",
            });
        }
        if (!validator.isValidPassword(password)) {
            return res.status(400).send({
                status: false,
                msg: "Password is required and Should Contain Min 8 character and 1 Special Symbol",
            });
        }
        const newAuthor = await authorModel.create(data);
        res.status(201).send({
            status: true,
            msg: "Author Created successfully....",
            data: newAuthor,
        });
    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message });
    }
};

// ______________________ post api : Login Author ________________________________//
//<--------------This API used for Log in Author------------------>// 


const logInUser = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        if (!validator.isValidEmail(email)) {
            return res.status(400).send({ status: false, msg: "Email is required" });
        }
        if (!validator.isValidPassword(password)) {
            return res
                .status(400)
                .send({ status: false, msg: "password is required" });
        }
        const author = await authorModel.findOne({ email, password });
        if (!author) {
            return res
                .status(401)
                .send({ status: false, msg: "Invalid login credentials" });
        }
        let token;
        try {
            token = jwt.sign({                   //jwt.sign to creating the token 
                authorId: author._id.toString(),
                Batch: "Californium Group1",     //   payload
                Project: "Blogging site mini project"

            }, "functionUp-project-blogging-site");    // signature key
        } catch (err) {
          return res.status(400).send({ status: false, msg: "Error", error: err.message })
        }
        //====================================================setHeader with some information ======================================================//
        res.setHeader("x-api-key", token);
        return res.status(201).send({ status: true, msg: "User login sucessful", token })
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: "Error", error: err.message })
    }
}
module.exports.createAuthor = createAuthor;
module.exports.logInUser = logInUser;
