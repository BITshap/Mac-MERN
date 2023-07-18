const User      = require('../models/UserV1')
const bcrypt    = require('bcryptjs')
const jwt       = require('jsonwebtoken')

const env = require('../.env')
const secret = env.secretKey

//Register a new user
const register = (req,res,next) => {
    bcrypt.hash(req.body.password, 10, function(err, hashedPass) {
        if(err) {
            res.json({
                error: err
            })
        }
        var username = req.body.username
        var email = req.body.email

        let newUser = new User ({
            version: 1,
            username: username,
            email: email,
            emailVerified: false,
            password: hashedPass
        })
        //Check if username is already in use
        User.findOne({username:username})
        .then(user => {
            if(user) {
                res.json({
                    message: 'Username in use'
                })
            } else {
                //Check if email is already in use
                User.findOne({email:email})
                .then(user => {
                    if(user) {
                        res.json({
                            message: 'Email in use'
                        })
                    } else {
                        //Save the new user
                        newUser.save()
                        .then(newUser => {
                            res.json({
                                message: 'User Added Sucessfully'
                            })
                        })
                        .catch(error => {
                            res.json({
                                message: 'An error occured!'
                            })
                        })
                    }
                })
            }
        })
    })
}

//User Login
const login = (req, res, next) => {
    //How long should the jwt last?
    const tokenTime = '24h'

    var username = req.body.username
    var password = req.body.password

    User.findOne({username:username})
    .then(user => {
        if(user){
            bcrypt.compare(password, user.password, function (err, result) {
                if(err) {
                    res.json({
                        error: err
                    })
                }
                if(result) {
                    let token = jwt.sign({username: user.username}, secret, {expiresIn: tokenTime})
                    res.json({
                        message: 'Login Sucessful!',
                        token
                    })
                } else {
                    res.json({
                        message: 'Password does not match'
                    })
                }
            })
        }
        else{
            res.json({
                message: 'No user found!'
            })
        }
    })
}

//Index: Returns username and publicData for each user
//No auth required
const index = (req, res, next) => {
    User.find().select({username: 1, publicData: 1})
    .then(User => {
        res.json({
            User
        })
    })
    .catch(error => {
        res.json({
            message: 'An error Occured!'
        })
    })
}

//Get User's data
//Requires User to be logged in
const show = (req, res, next) => {
    User.findOne({username:req.data.username})
    .then(User => {
        res.json({
            User
        })
    })
    .catch(error => {
        res.json({
            message: 'An error Occured!'
        })
    })
}


module.exports = {
    register, login, index, show
}