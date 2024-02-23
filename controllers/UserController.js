const User = require("../models/UserModel");
const httpStatus = require("http-status");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const registerUser = async (req, res) => {
    try {
        const { username, password, email } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10)

        const user = new User({ username, email, password: hashedPassword, date: Date.now() })
        await user.save();

        res.status(httpStatus.OK).json({
            message: 'User registered succcesfully!',
            data: {
                userId: user._id,
            },
        })
    } catch (error) {
        res.status(httpStatus.UNAUTHORIZED).json({ error: 'Registration failed' });
    }
}

const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(httpStatus.UNAUTHORIZED).json({ error: 'Authentication failed' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(httpStatus.UNAUTHORIZED).json({ error: 'Authentication failed' });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_TOKEN, {
            expiresIn: '1h',
        });
        res.status(httpStatus.OK).json({ 
            message: "Successfully logged In",
            data: {
                UserName: user.username,
                token: token
            }
         });
    } catch (error) {
        res.status(httpStatus.UNAUTHORIZED).json({ error: 'Login failed' });
    }
}

module.exports = {
    registerUser,
    login
}
