const User = require('../models/user');
const bcrypt = require('bcrypt');

// User Registration
function registerUser(name, email, password) {
    const cleanEmail = email.trim().toLowerCase();

    return User.findOne({ email: cleanEmail })
        .then(existingUser => {
            if (existingUser) {
                return { error: 'User already exists' };
            }
            return bcrypt.hash(password, 10)
                .then(hashedPassword => {
                    const newUser = new User({
                        name,
                        email: cleanEmail,
                        password: hashedPassword
                    });

                    return newUser.save().then(() => {
                        return {
                            message: 'User registered successfully',
                            userId: newUser._id
                        };
                    });
                });
        })
        .catch(error => {
            return { error: error.message };
        });
}

// User Login
function loginUser(email, password) {
    return User.findOne({ email })
        .then(user => {
            if (!user) {
                return { error: 'User not found' };
            }

            return bcrypt.compare(password, user.password)
                .then(match => {
                    if (!match) {
                        return { error: 'Incorrect password' };
                    }

                    return {
                        message: 'Login successful',
                        userId: user._id,
                        name: user.name,
                        email: user.email
                    };
                });
        })
        .catch(error => {
            return { error: error.message };
        });
}

module.exports = {
    registerUser,
    loginUser
};