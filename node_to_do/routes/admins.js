const {Router} = require('express');

const Admin = require('../models/admin');

const router = Router();

router.get('/', async (req, res) => {

    try {

        const admins = await Admin.find();

        console.log('admins ', admins);

        res.status(200).send(admins);

    } catch(e) {

        console.error(e);

        res.status(500).send();

    }

});

module.exports = router;
