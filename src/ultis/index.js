"use strict";

const _ = require("lodash");
//const {Types} = require('mongoose');

//const convertToObjectIdMongo = (id) => Types.ObjectId(id);

const getInfoData = ({ fields = [], object = {} }) => {
  return _.pick(object, fields);
};

const getSelectData = (select = []) => {
  return Object.fromEntries(select.map((item) => [item, 1]));
};

const unGetSelectData = (select = []) => {
  return Object.fromEntries(select.map((item) => [item, 0]));
};

const removeUndefinedObject = (obj) => {
  const result = {};
  Object.keys(obj).forEach((k) => {
    const current = obj[k];
    if ([null, undefined].includes(current)) return;
    if (Array.isArray(current)) return;

    if (typeof current === "object") {
      result[k] = removeUndefinedNullObject(current);
      return;
    }
    result[k] = current;
  });
  return result;
};

const updateNestedObjectParse = (object) => {
  const final = {};
  Object.keys(object || {}).forEach((key) => {
    if (typeof object[key] === "object" && !Array.isArray(object[key])) {
      const response = updateNestedObjectParse(object[key]);
      Object.keys(response || {}).forEach((a) => {
        final[`${key}.${a}`] = response[a];
      });
    } else {
      final[key] = object[key];
    }
  });
  return final;
};

const convertCheckbox = (value) => {
  return value ? "☑" : "☐";
};

const convertSoPhieu = (str) => {
  return str?.replace(/\//g, "_");
};

module.exports = {
  getInfoData,
  getSelectData,
  unGetSelectData,
  removeUndefinedObject,
  updateNestedObjectParse,
  convertCheckbox,
  convertSoPhieu,
};
