import jwt from 'jsonwebtoken';
import passport from 'passport';

const signToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role, email: user.email },
        JWT_SECRET,
        { expiresIn: '30d' }
    );
};

export const login = async (req, res, next) => {
    passport.authenticate('local', { session: false }, async (err, user, info) => {
        if (err) {
            console.error('Login error:', err);
            return next(err);
        }

        if (!user) {
            return res.status(401).json({
                success: false,
                message: info ? info.message : 'Invalid email or password'
            });
        }

        try {
            const token = signToken(user);

            user.password = undefined;

            res.json({
                success: true,
                message: 'Logged in successfully',
                token,
                user: {
                    id: user._id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    phone: user.phone,
                    role: user.role
                }
            });
        } catch (error) {
            console.error('Token generation error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to generate authentication token'
            });
        }
    })(req, res, next);
};

export const register = async (req, res) => {
    try {
        const { email, password, firstName, lastName } = req.body;

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({
                success: false,
                message: 'Email already exists'
            });
        }

        const newUser = await User.create({
            email,
            password,
            firstName,
            lastName
        });

        const token = signToken(newUser);
        newUser.password = undefined;

        res.status(201).json({
            success: true,
            token,
            user: {
                id: newUser._id,
                email: newUser.email,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                role: newUser.role
            }
        });
    } catch (error) {
        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            return res.status(400).json({
                success: false,
                message: `${field} already exists`
            });
        }
        res.status(500).json({
            success: false,
            message: 'Failed to create account'
        });
    }
};