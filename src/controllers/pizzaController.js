const validator = require("../utils/validator");
const pizzaModel = require("../models/pizzaModel");
const ObjectId = require("mongoose")._id;

//Add different pizzas into the DB
const createPizza = async (req, res) => {
  try {
    const requestBody = req.body;

    if (!validator.isValidRequestBody(requestBody)) {
      return res.status(400).send({
        status: false,
        message: "Please provide data for successful pizza creation",
      });
    }

    const { name, description, size_price, imageUrl } = requestBody;

    if (!validator.isValid(name)) {
      return res.status(400).send({
        status: false,
        message: "Please provide the pizza name",
      });
    }

    const duplicateTitle = await pizzaModel.findOne({ name });
    if (duplicateTitle) {
      return res.status(400).send({
        status: false,
        message: "A pizza with this name already exists",
      });
    }

    if (!validator.isValid(description)) {
      return res.status(400).send({
        status: false,
        message: "Please provide a description for the pizza",
      });
    }

    if (!Array.isArray(size_price) || size_price.length === 0) {
      return res.status(400).send({
        status: false,
        message: "Please provide size & price details for creating pizza",
      });
    }

    // Validate individual prices within size_price array
    for (const size of size_price) {
      const isSValid =
        size.S !== "" && (size.S === undefined || !isNaN(size.S));
      const isMValid =
        size.M !== "" && (size.M === undefined || !isNaN(size.M));
      const isLValid =
        size.L !== "" && (size.L === undefined || !isNaN(size.L));

      if (!isSValid || !isMValid || !isLValid) {
        return res.status(400).send({
          status: false,
          message: "Pizza prices must be valid number",
        });
      }

      const hasAtLeastOnePrice =
        (size.S !== undefined && !isNaN(size.S)) ||
        (size.M !== undefined && !isNaN(size.M)) ||
        (size.L !== undefined && !isNaN(size.L));

      if (!hasAtLeastOnePrice) {
        return res.status(400).send({
          status: false,
          message: "Please provide at least one size (S, M, L) of pizza",
        });
      }
    }

    const pizzaData = { name, description, size_price, imageUrl };

    const newPizza = await pizzaModel.create(pizzaData);
    return res.status(201).send({
      status: true,
      message: "Pizza created successfully",
      data: newPizza,
    });
  } catch (err) {
    console.error("Error in createPizza:", err);
    return res.status(500).send({
      status: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

//Fetch all pizzas...
const getPizzaList = async (req, res) => {
  try {
    let productFound2 = await pizzaModel.find();
    return res.status(200).send({
      status: true,
      message: "Success",
      length: productFound2.length,
      data: productFound2,
    });
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};

//Fetch pizza by pizzaId...
const getPizzaById = async (req, res) => {
  try {
    let param = req.params.pizzaId;
    let checkParams = await pizzaModel.findOne({ _id: param });
    if (!checkParams) {
      return res
        .status(404)
        .send({ status: false, msg: "There is no pizza exist with this id" });
    }
    return res.status(200).send({
      status: true,
      message: "Success",
      length: [checkParams].length,
      data: checkParams,
    });
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};
module.exports = { createPizza, getPizzaList, getPizzaById };
