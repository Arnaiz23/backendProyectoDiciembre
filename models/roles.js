'use strict'

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// export const ROLES = ["user" , "admin"];

const rolesSchema = Schema({
    name: String
})

module.exports = mongoose.model("Role", rolesSchema);