const {Router} = require('express');

const Admin = require('../models/admin');
const User = require('../models/user');

const router = Router();


router.post('/admin', async (req, res) => {
   
    try {
        const {name, login, password} = req.body;
        const existedAdmin = await Admin.findOne().or([{ name: name }, { login: login }]);
        if(existedAdmin) {
            throw new Error('Dublicate type create');
        } else {
            const admin = new Admin({name, login, password});
            await admin.save();
            res.sendStatus(201);
        }
    } catch(err) {
        console.error(err);
        if(err.message === 'Dublicate type create') {
            res.sendStatus(409);
        } else {
            res.status(500).send(err);
        }
    }
});


router.post('/user', async (req, res) => {
   
    try {
        const {name, login, password, adminId} = req.body;
        const existedAdmin = await User.findOne().or([{ name: name }, { login: login }]);
        if(existedAdmin) {
            throw new Error('Dublicate type create');
        } else {
            const user = new User({name, login, password, adminId});
            await user.save();
            res.sendStatus(201);
        }
    } catch(err) {
        console.error(err);
        if(err.message === 'Dublicate type create') {
            res.sendStatus(409);
        } else {
            res.status(500).send(err);
        }
    }

});

module.exports = router;
