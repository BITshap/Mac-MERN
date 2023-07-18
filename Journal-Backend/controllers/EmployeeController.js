const Employee = require('../models/Employee')

//Show the list of Employees
const index = (req, res, next) => {
    Employee.find()
    .then(response => {
        res.json({
            response
        })
    })
    .catch(error => {
        res.json({
            message: 'An error Occured!'
        })
    })
}

const show = (req, res, next) => {
    let employeeID = req.body.employeeID
    Employee.findById(employeeID)
    .then(response => {
        res.json({
            response
        })
    })
    .catch(error => {
        res.json({
            message: 'An error Occured!'
        })
    })
}

// add new employee
const store = (req, res, next) => {
    let employee = new Employee({
        name: req.body.name,
        designation: req.body.designation,
        email: req.body.email,
        phone: req.body.phone,
        age: req.body.age,
    })
    employee.save()
    .then(response => {
        res.json({
            message: "Employee Added Sucessfully!"
        })
    })
    .catch(error => {
        res.json({
            message: 'An error Occured!'
        })
    })
}

//update an employee
const update = (req,res,next) => {
    let employeeID = req.body.employeeID

    let updatedData = {
        name: req.body.name,
        designation: req.body.designation,
        email: req.body.email,
        phone: req.body.phone,
        age: req.body.age,
    }

    Employee.findByIDAndUpdate(employeeID, {$set: updatedData})
    .then(response => {
        res.json({
            message: "Employee updated Sucessfully!"
        })
    })
    .catch(error => {
        res.json({
            message: 'An error Occured!'
        })
    })
}

//Delete an employee
const destroy = (req, res, next) => {
    let employeeID = req.body.employeeID
    Employee.findByIDAndRemove(employeeID)
    .then(response => {
        res.json({
            message: "Employee deleted sucessfully!"
        })
    })
    .catch(error => {
        res.json({
            message: 'An error occured!'
        })
    })
}


module.exports = {
    index, show, store, update, destroy
}