'use strict'

const express = require('express')
const morgan = require('morgan')
const taskDao = require('./taskdao.js')
const userDao = require('./userdao')
const jwt = require('express-jwt')
const jsonwebtoken = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const jwtSecret = require('./secret')

const expireTime = 300
const authErrorObj = {errors: [{'param': 'Server', 'msg': 'Authorization error'}]};

const app = express()
const port = 3001
app.use(morgan('tiny'))
app.use(express.json())


//Authentication endpoint
app.post('/api/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    userDao.getUser(username)
        .then((user) => {
            if (user === undefined) {
                res.status(404).send({
                    errors: [{'param': 'Server', 'msg': 'Invalid e-mail'}]
                });
            } else {
                if (!userDao.checkPassword(user, password)) {
                    res.status(401).send({
                        errors: [{'param': 'Server', 'msg': 'Wrong password'}]
                    });
                } else {
                    //successful authentication
                    const token = jsonwebtoken.sign({user: user.id}, jwtSecret, {expiresIn: expireTime});
                    res.cookie('token', token, {httpOnly: true, sameSite: true, maxAge: 1000 * expireTime});
                    res.json({id: user.id, name: user.name})
                }
            }
        }).catch(// Delay response when wrong user/pass is sent to avoid fast guessing attempts
        (err) => {
            new Promise((resolve) => {
                setTimeout(resolve, 1000)
            }).then(() => res.status(401).json(authErrorObj))
        })
})

app.use(cookieParser());

app.post('/api/logout', (req, res) => {
    res.clearCookie('token').end();
});

//GET /tasks/public
app.get('/api/tasks/public', (req, res) => {
    taskDao.getPublicTasks()
        .then((tasks) => {
            res.json(tasks);
        })
        .catch((err) => {
            res.status(500).json({
                errors: [{'msg': err}],
            });
        });
});

// For the rest of the code, all APIs require authentication
app.use(
    jwt({
        secret: jwtSecret,
        getToken: req => req.cookies.token
    })
);

// To return a better object in case of errors
app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json(authErrorObj);
    }
});



// AUTHENTICATED REST API endpoints

//GET /user
app.get('/api/user', (req, res) => {
    const user = req.user && req.user.user;
    userDao.getUserById(user)
        .then((user) => {
            res.json({id: user.id, name: user.name});
        }).catch(
        (err) => {
            res.status(401).json(authErrorObj);
        }
    );
});

//GET /tasks
app.get('/api/tasks', (req, res) => {
    const user = req.user && req.user.user;
    taskDao.getTasks(user, req.query.filter)
        .then((tasks) => {
            res.json(tasks);
        })
        .catch((err) => {
            res.status(500).json({
                errors: [{'msg': err}],
            });
        });
});

//GET /tasks/<taskId>
app.get('/api/tasks/:taskId', (req, res) => {
    taskDao.getTask(req.params.taskId)
        .then((course) => {
            if (!course) {
                res.status(404).send();
            } else {
                res.json(course);
            }
        })
        .catch((err) => {
            res.status(500).json({
                errors: [{'param': 'Server', 'msg': err}],
            });
        });
});

//POST /tasks
app.post('/api/tasks', (req, res) => {
    const task = req.body;
    if (!task) {
        res.status(400).end();
    } else {
        const user = req.user && req.user.user;
        task.user = user;
        taskDao.createTask(task)
            .then((id) => res.status(201).json({"id": id}))
            .catch((err) => {
                res.status(500).json({errors: [{'param': 'Server', 'msg': err}],})
            });
    }
});

//DELETE /tasks/<taskId>
app.delete('/api/tasks/:taskId', (req, res) => {
    taskDao.deleteTask(req.params.taskId)
        .then((result) => res.status(204).end())
        .catch((err) => res.status(500).json({
            errors: [{'param': 'Server', 'msg': err}],
        }));
});

//PUT /tasks/<taskId>
app.put('/api/tasks/:taskId', (req, res) => {
    if (!req.body.id) {
        res.status(400).end();
    } else {
        const task = req.body;
        task.user = req.user && req.user.user;
        taskDao.updateTask(req.params.taskId, task)
            .then((result) => res.status(200).end())
            .catch((err) => res.status(500).json({
                errors: [{'param': 'Server', 'msg': err}],
            }));
    }
});

app.listen(port, () => console.log(`Server ready: listening at http://localhost:${port}`))