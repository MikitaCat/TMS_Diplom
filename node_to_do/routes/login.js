const { uuid } = require('uuidv4');
const { Router } = require('express');

const User = require('../models/user');
const Admin = require('../models/admin');

const router = Router();

router.get('/', async (req, res) => {
    try {
        let user;
        let isAdmin = false;
        const { token } = req.headers
        user = await User.findOne({ token: token }).exec()
        if (!user) {
            isAdmin = true;
            user = await Admin.findOne({ token: token }).exec();
        }
        if (!user) {
            throw new Error('Unauthorized');
        } else {
            const { token } = user;
            res.status(200).send({ token, isAdmin });
        }
    } catch (e) {
        console.error(e.message);
        if (e.message === 'Unauthorized') {
            res.sendStatus(401);
        } else {
            res.status(500).send(e);
        }
    }
})


router.post('/', async (req, res) => {
    try {
        let user;
        let isAdmin = false;
        const token = uuid();
        const timeToLive = new Date(new Date().getTime() + 3600000).getTime();
        const { login, password } = req.body;
        user = await User.findOneAndUpdate({ login: login, password: password }, { $set: { token, timeToLive } }, { new: true });
        if (!user) {
            isAdmin = true;
            user = await Admin.findOneAndUpdate({ login: login, password: password }, { $set: { token, timeToLive } }, { new: true });
        }
        if (!user) {
            throw new Error('Unauthorized');
        } else {
            const { token } = user;
            res.status(200).send({ token, isAdmin });
        }
    } catch (e) {
        console.error(e.message);
        if (e.message === 'Unauthorized') {
            res.sendStatus(401);
        } else {
            res.status(500).send(e);
        }
    }
});

module.exports = router;
