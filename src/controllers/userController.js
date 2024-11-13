const userModel = require("../models/userModel");
const validator = require("../utils/validator");
const jwt = require("jsonwebtoken");

const bcrypt = require("bcrypt");
const saltRounds = 10;

const userCreation = async (req, res) => {
  try {
    let requestBody = req.body;
    let { name, email, phone, password, address } = requestBody;

    //validation starts
    if (!validator.isValidRequestBody(requestBody)) {
      return res
        .status(400)
        .send({ status: false, message: "please provide valid request body" });
    }

    if (!validator.isValid(name)) {
      return res
        .status(400)
        .send({ status: false, message: "name is required" });
    }
    if (!validator.isValid(email)) {
      return res
        .status(400)
        .send({ status: false, message: "email is required" });
    }

    //searching email in DB to maintain its uniqueness
    const isEmailAleadyUsed = await userModel.findOne({ email });
    if (isEmailAleadyUsed) {
      return res.status(400).send({
        status: false,
        message: `${email} is alraedy in use. Please try another email Id.`,
      });
    }

    //validating email using RegEx.
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
      return res
        .status(400)
        .send({ status: false, message: "Invalid Email id." });

    if (!validator.isValid(phone)) {
      return res
        .status(400)
        .send({ status: false, message: "phone number is required" });
    }

    //searching phone in DB to maintain its uniqueness
    const isPhoneAleadyUsed = await userModel.findOne({ phone });
    if (isPhoneAleadyUsed) {
      return res.status(400).send({
        status: false,
        message: `${phone} is already in use, Please try a new phone number.`,
      });
    }

    //validating phone number of 10 digits only.
    if (!/^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/.test(phone))
      return res.status(400).send({
        status: false,
        message: "Phone number must be a valid Indian number.",
      });

    if (!validator.isValid(password)) {
      return res
        .status(400)
        .send({ status: false, message: "password is required" });
    }
    if (password.length < 6 || password.length > 15) {
      return res
        .status(400)
        .send({ status: false, message: "Password must be of 8-15 letters." });
    }
    if (!validator.isValid(address)) {
      return res
        .status(400)
        .send({ status: false, message: "Address is required" });
    }

    //validation ends

    const encryptedPassword = await bcrypt.hash(password, saltRounds);

    //object destructuring for response body.
    userData = {
      name,
      email,
      phone,
      password: encryptedPassword,
      address,
    };

    const saveUserData = await userModel.create(userData);
    return res.status(201).send({
      status: true,
      message: "user created successfully.",
      data: saveUserData,
    });
  } catch (err) {
    return res.status(500).send({
      status: false,
      message: "Error is : " + err,
    });
  }
};

const userLogin = async function (req, res) {
  try {
    const requestBody = req.body;

    const { email, password } = requestBody;

    // Validation starts
    if (!validator.isValidRequestBody(requestBody)) {
      return res.status(400).send({
        status: false,
        message: "Invalid request parameters. Please provide login details",
      });
    }
    if (!validator.isValid(requestBody.email)) {
      return res
        .status(400)
        .send({ status: false, message: "Email Id is required" });
    }

    if (!validator.isValid(requestBody.password)) {
      return res
        .status(400)
        .send({ status: false, message: "Password is required" });
    }
    // Validation ends

    //finding user's details in DB to verify the credentials.
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(401).send({
        status: false,
        message: `Login failed! email id is incorrect.`,
      });
    }

    let hashedPassword = user.password;
    const encryptedPassword = await bcrypt.compare(password, hashedPassword); //converting normal password to hashed value to match it with DB's entry by using compare function.

    if (!encryptedPassword)
      return res.status(401).send({
        status: false,
        message: `Login failed! password is incorrect.`,
      });

    //Creating JWT token through userId.
    const userId = user._id;
    const token = await jwt.sign(
      {
        userId: userId,
        iat: Math.floor(Date.now() / 1000), //time of issuing the token.
        exp: Math.floor(Date.now() / 1000) + 3600 * 24 * 7, //setting token expiry time limit.
      },
      "privateKey"
    );

    return res.status(200).send({
      status: true,
      message: `user login successfull `,
      data: {
        userId,
        token,
      },
    });
  } catch (err) {
    return res
      .status(500)
      .send({ status: false, message: err.message, lska: "alsk" });
  }
};

module.exports = {
  userCreation,
  userLogin,
};
