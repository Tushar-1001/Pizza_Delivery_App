const mongoose = require("mongoose");

// Validation checking function
const isValid = function (value) {
  if (typeof value === "undefined" || value === null) return false; //it checks whether the value is null or undefined.
  if (typeof value === "string" && value.trim().length === 0) return false; //it checks whether the string contain only space or not
  return true;
};
const isValidObjectId = function (objectId) {
  return mongoose.Types.ObjectId.isValid(objectId);
};
const isValidRequestBody = function (requestBody) {
  return Object.keys(requestBody).length > 0;
};

//only check empty string value.
const validString = function (value) {
  if (typeof value === "string" && value.trim().length === 0) return false; //it checks whether the string contain only space or not
  return true;
};

const isValidStatus = function (status) {
  return ["pending", "delivered"].indexOf(status) !== -1;
};

module.exports = {
  isValid,
  isValidRequestBody,
  isValidObjectId,
  validString,
  isValidStatus,
};
