require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../models');
const User = db.User;
const Op = db.Sequelize.Op;

// Register a new user
exports.register = (req, res) => {
    // Validate the request
    if (!req.body.name || !req.body.email || !req.body.password) {
        res.status(400).send({
            message: "Name, email, and password are required fields."
        });
        return;
    }

    // Check if the email is already registered
    User.findOne({
        where: {
            email: req.body.email
        }
    })
        .then(user => {
            if (user) {
                res.status(400).send({
                    message: "Email is already registered."
                });
                return;
            }

            // Create a new user object
            const newUser = {
                name: req.body.name,
                email: req.body.email,
                password: bcrypt.hashSync(req.body.password, 10) // Hash the password using bcrypt
            };

            // Save the new user to the database
            User.create(newUser)
                .then(data => {
                    // Generate a JWT token
                    const token = jwt.sign({ id: data.id }, process.env.JWT_SECRET, {
                        expiresIn: 86400 // Expires in 24 hours
                    });

                    res.send({ auth: true, token: token });
                })
                .catch(err => {
                    res.status(500).send({
                        message: err.message || "An error occurred while creating the user."
                    });
                });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "An error occurred while checking if the email is already registered."
            });
        });
};

// Login a user
exports.login = (req, res) => {
    // Validate the request
    if (!req.body.email || !req.body.password) {
        res.status(400).send({
            message: "Email and password are required fields."
        });
        return;
    }

    // Check if the user exists in the database
    User.findOne({
        where: {
            email: req.body.email
        }
    })
        .then(user => {
            if (!user) {
                res.status(404).send({
                    message: "User not found."
                });
                return;
            }

            // Check if the password is correct
            const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
            if (!passwordIsValid) {
                res.status(401).send({
                    auth: false,
                    token: null,
                    message: "Incorrect password."
                });
                return;
            }

            // Generate a JWT token
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
                expiresIn: 86400 // Expires in 24 hours
            });

            res.send({ auth: true, token: token });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "An error occurred while logging in."
            });
        });
};
exports.getAllUsers = (req, res) => {
    User.findAll({
        attributes: {
            exclude: ['password']
        }
    })
        .then(users => {
            res.send(users);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "An error occurred while retrieving users."
            });
        });
};
