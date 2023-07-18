const mongoose      = require('mongoose')
const Schema        = mongoose.Schema

const employeeSchema    = new Schema({
    name: {
        type: String
    },
    designation: {
        type: String
    },
    email: {
        String
    },
    phone: {
        type: String
    },
    age: {
        type: Number
    }
}, {timestamps: true})

const Employee = mongoose.model("Employee", employeeSchema)
module.exports = Employee

