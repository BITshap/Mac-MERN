const mongoose      = require('mongoose')
const Schema        = mongoose.Schema

const userSchema    = new Schema({
    version: {
        type: Number
    },
    username: {
        type: String
    },
    email: {
        type: String
    },
    emailVerified: {
        type: Boolean
    },
    password: {
        type: String
    },
    privateData: {
        type: Array
    },
    publicData: {
        type: Array
    }
}, {timestapms: true})

const UserV1 = mongoose.model('User', userSchema)
module.exports = UserV1
