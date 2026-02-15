const express = require('express');
const User = require('../models/User');

const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// register a user.

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new system user (Manager or SalesAgent). Password is hashed before being stored.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *               - role
 *             properties:
 *               username:
 *                 type: string
 *                 example: Alex
 *               email:
 *                 type: string
 *                 example: alex@kgl.com
 *               password:
 *                 type: string
 *                 example: password123
 *               role:
 *                 type: string
 *                 enum: [Manager, SalesAgent]
 *                 example: Manager
 *     responses:
 *       200:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User registered successfully
 *                 user:
 *                   type: object
 *       401:
 *         description: Failed to create user
 *       400:
 *         description: Error registering user
 */

router.post('/register', async (req, res) => {
    try {
        const user = new User(req.body);

        user.password = await bcrypt.hash(user.password, 10);

        await user.save();

        res.status(201).json({
            message: "User registered successfully",
            user
        });

    } catch (error) {
        res.status(400).json({
            message: "Error registering user",
            details: error.message
        });
    }
});


// Login
/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login a user
 *     description: Authenticates a registered user (Manager or SalesAgent) and returns a JWT token valid for 1 hour.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: manager@kgl.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login successful
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       401:
 *         description: User does not exist or invalid credentials
 *       500:
 *         description: Server error
 */

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: "User does not exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(200).json({
            message: "Login successful",
            token
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            details: error.message
        });
    }
});


router.get('/', authMiddleware, async (req, res) => {
    try {
        const users = await User.find();
        if (!users) {
            return res.status(404).json({ message: "No users found" });
        }
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: `Error fetching users: ${error}` });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ messsage: `Error fetching user: ${error}` });
    }
});

router.patch('/:id', async (req, res) => {
    let body = req.params.body;
    try {
        let user = await User.findByIdAndUpdate(
            req.params.id,
            body,
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({ message: `User with id ${req.params.id} not found` });
        }
        res.status(200).json({ message: "User updated successfully", user });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user', error });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        let user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: `User deleted successfully:`, user });
    } catch (error) {
        res.status(500).json({ message: `Error deleting user ${error}` });
    }
});

module.exports = router;
