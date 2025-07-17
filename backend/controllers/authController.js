const User = require('../models/user');
const bcrypt = require('bcrypt');

// User Registration
const registerUser = async (name, email, password) => {
    try {
        const existingUser = await User.findOne({ email: email.trim().toLowerCase() });
        if (existingUser) {
            throw new Error('User already exists');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        return { message: 'User registered successfully', userId: newUser._id };
    } catch (error) {
        return { error: error.message };
    }
};

// User Login
const loginUser = async (email, password) => {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('User not found');
        }

        const matchPassword = await bcrypt.compare(password, user.password);
        if (!matchPassword) {
            throw new Error('Incorrect password');
        }

        return {
            message: 'Login successful',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar || null,
                bio: user.bio || '',
                skills: user.skills || []
            }
        };
    } catch (error) {
        return { error: error.message };
    }
};


module.exports = { registerUser, loginUser };