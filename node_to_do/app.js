require('dotenv').config();

const http = require('http');
const mongoose = require('mongoose');
const express = require('express');
const cors = require("cors");

const adminsRoutes = require('./routes/admins');
const registrationRouter = require('./routes/registration');
const loginRouter = require('./routes/login');
const tasksRoutes = require('./routes/tasks');
const usersRoutes = require('./routes/users');

const User = require('./models/user');
const Admin = require('./models/admin');

const app = express();
const server = http.createServer(app);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use(async (req, res, next) => {

    try {
        if (
            !req.headers.token &&
            req.url !== '/login' &&
            !req.url.includes('/registration') &&
            req.url !== '/admins') {

            throw new Error('Unauthorized');

        } else {

            next();

        }

    } catch (err) {

        console.error(err.message);

        if (err.message === 'Unauthorized') {

            res.sendStatus(401);

        } else {

            res.status(500).send(err);

        }

    }

}, async (req, res, next) => {

    try {

        let user;

        if (
            req.url !== '/login' &&
            !req.url.includes('/registration') &&
            req.url !== '/admins') {

            user = await User.findOne({ token: req.headers.token }).exec();

            if (!user) {

                user = await Admin.findOne({ token: req.headers.token }).exec();

            }

            if (!user || user.timeToLive < new Date().getTime()) {

                throw new Error('Unauthorized');

            }

            next();

        } else {

            next();

        }

    } catch (err) {

        console.error(err.message);

        if (err.message === 'Unauthorized') {

            res.sendStatus(401);

        } else {

            res.status(500).send(err);

        }

    }

});

app.use('/admins', adminsRoutes);
app.use('/registration', registrationRouter);
app.use('/login', loginRouter);
app.use('/tasks', tasksRoutes);
app.use('/users', usersRoutes);



const PORT = parseInt(process.env.PORT) || 8080;
const DB_URL = process.env.DB_URL;

async function start() {

    try {

        await mongoose.connect(DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
        });

        server.listen(PORT, () => {
            console.log(`Server is running on ${PORT}`);
        });

    } catch (e) {

        console.error(e);

    }

}

start();


