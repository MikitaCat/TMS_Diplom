const { Router } = require('express');

const User = require('../models/user');
const Admin = require('../models/admin');

const router = Router();

router.get('/', async (req, res) => {
    try {
        const admin = await Admin.findOne({ token: req.headers.token }).exec();
        if (admin) {
            const filteredUsers = await User.find({ adminId: admin });
            res.status(200).send(filteredUsers);
        } else {
            throw new Error('Forbidden');
        }
    } catch (e) {
        console.error(e);
        if (e.message === 'Forbidden') {
            res.sendStatus(403);
        } else {
            res.status(500).send(e);
        }
    }
});

router.get('/userId', async (req, res) => {
    try {
        const user = await User.findOne({ token: req.headers.token }).exec();
        if (user) {
            res.status(200).send(user._id);
        } else {
            throw new Error('Forbidden');
        }
        res.status(200).send(user._id);

    } catch (e) {
        console.error(e);
        if (e.message === 'Forbidden') {
            res.sendStatus(403);
        } else {
            res.status(500).send(e);
        }
    }
});

module.exports = router;