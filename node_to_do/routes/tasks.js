const { Router } = require('express');

const Task = require('../models/task');
const User = require('../models/user');
const Admin = require('../models/admin');

const router = Router();

router.get('/:userId', async (req, res) => {
    try {
        const admin = await Admin.findOne({ token: req.headers.token }).exec();
        const user = await User.findOne({ _id: req.params.userId, adminId: admin }).exec();
        if (user) {
            const tasks = await Task.find({ userId: req.params.userId });
            res.status(200).send(tasks);
        } else {
            const user = await User.findOne({ _id: req.params.userId, token: req.headers.token }).exec();
            if (user) {
                const tasks = await Task.find({ userId: req.params.userId });
                res.status(200).send(tasks);
            } else {
                throw new Error('Forbidden');
            }
        }
    } catch (e) {
        if (e.message === 'Forbidden') {
            res.sendStatus(403);
        } else {
            res.status(500).send(e);
        }
    }

});


router.post('/:userId', async (req, res) => {
    try {
        const admin = await Admin.findOne({ token: req.headers.token }).exec();
        const user = await User.findOne({ _id: req.params.userId, adminId: admin }).exec();
        if (user) {
            const { name, type, checked } = req.body;
            const task = new Task({ userId: req.params.userId, name, type, checked });
            await task.save();
            res.status(200).send(task);

        } else {
            throw new Error('Forbidden');
        }
    } catch (e) {
        if (e.message === 'Forbidden') {
            res.sendStatus(403);
        } else {
            res.status(500).send(e);
        }
    }
});


router.put('/:userId', async (req, res) => {
    try {
        const admin = await Admin.findOne({ token: req.headers.token }).exec();
        const user = await User.findOne({ _id: req.params.userId, adminId: admin }).exec();
        if (user) {
            const { id } = req.body;
            delete req.body.id;
            const task = await Task.findByIdAndUpdate(id, { ...req.body, userId: req.params.userId, useFindAndModify: true });
            res.sendStatus(204);
        } else {
            const user = await User.findOne({ _id: req.params.userId, token: req.headers.token }).exec();
            if (user) {
                const { id } = req.body;
                delete req.body.id;
                const task = await Task.findByIdAndUpdate(id, { ...req.body, userId: req.params.userId, useFindAndModify: true });
                res.sendStatus(204);
            } else {
                throw new Error('Forbidden');
            }
        }
    } catch (e) {
        if (e.message === 'Forbidden') {
            res.sendStatus(403);
        } else {
            res.status(500).send(e);
        }
    }

});


router.delete('/:userId/:taskId', async (req, res) => {
    try {
        const admin = await Admin.findOne({ token: req.headers.token }).exec();
        const user = await User.findOne({ _id: req.params.userId, adminId: admin }).exec();
        if (user) {
            const { taskId } = req.params;
            await Task.deleteOne({ _id: taskId });
            res.sendStatus(204);
        } else {
            throw new Error('Forbidden');
        }
    } catch (e) {
        if (e.message === 'Forbidden') {
            res.sendStatus(403);
        } else {
            res.status(500).send(e);
        }
    }
})

module.exports = router;
