const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('./../server')
const { Todo } = require('./../models/todo');
const { User } = require('./../models/user');
const { todos, populateTodos, users, populateUsers } = require('./seed/seed');


beforeEach(populateUsers);
beforeEach(populateTodos);

describe('GET /todos', () => {
    it('should get all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2)
            })
            .end(done);
    })
});

describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        var text = 'do something';

        request(app)
            .post('/todos')
            .send({ text })
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.find({ text }).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((e) => done(e));
            }

            );
    });

    it('should not create todo with invalid data', (done) => {
        var text = '';

        request(app)
            .post('/todos')
            .send({ text })
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2);
                    done();
                }).catch((e) => done(e));
            }

            );
    }, (e) => {

    });
});

describe('GET /todos/:id', () => {
    it('should return todo doc', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    }, (e) => {
    })

    it('should return 404 if todo not found', (done) => {
        var newID = new ObjectID();
        request(app)
            .get(`/todos/${newID.toHexString()}`)
            .expect(404)
            .end(done);
    }, (e) => { });

    it('should return 404 for non-object ids', (done) => {
        request(app)
            .get('/todos/123')
            .expect(404)
            .end(done);
    }, (e) => { });
});

describe('DELETE /todos/:id', () => {
    it('should remove a todo', (done) => {
        var hexID = todos[1]._id.toHexString();

        request(app)
            .delete(`/todos/${hexID}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(hexID);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Todo.findById(hexID).then((todo) => {
                    expect(todo).toNotExist();
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should return 404 if todo not found', (done) => {
        var newID = new ObjectID();
        request(app)
            .delete(`/todos/${newID.toHexString()}`)
            .expect(404)
            .end(done);
    }, (e) => { });

    it('should return 404 if object id is invalid', (done) => {
        request(app)
            .delete('/todos/123')
            .expect(404)
            .end(done);
    }, (e) => { });
});

describe('PATCH /todos/:id', () => {
    it('should update the todo', (done) => {
        var hexID = todos[0]._id.toHexString();
        var newValues = {
            text: 'new text',
            completed: true
        };

        request(app)
            .patch(`/todos/${hexID}`)
            .send(newValues)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.findById(hexID).then((todo) => {
                    expect(todo.text).toBe(newValues.text);
                    expect(todo.completed).toBe(newValues.completed);
                    expect(todo.completedAt).toBeA('number');
                    done();
                }).catch((e) => done(e));
            });
    }, (e) => { });

    it('should clear completedAt when todo is not completed', (done) => {
        var hexID = todos[1]._id.toHexString();

        var newValues = {
            text: 'new text',
            completed: false
        };

        request(app)
            .patch(`/todos/${hexID}`)
            .send(newValues)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.findById(hexID).then((todo) => {
                    expect(todo.text).toBe(newValues.text);
                    expect(todo.completed).toBe(newValues.completed);
                    expect(todo.completedAt).toNotExist();
                    done();
                }).catch((e) => done(e));
            });
    }, (e) => { });
});

describe('GET /users/me', () => {
    it('should return user if authenticated', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            })
            .end(done);
    });

    it('should return a 401 if not authenticated', (done) => {
        request(app)
            .get('/users/me')
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({});
            })
            .end(done);
    }, (e) => { });
});

describe('POST /users', () => {
    it('should create a user', (done) => {
        var email = 'test@test.com';
        var password = 'pass123';

        request(app)
            .post('/users')
            .send({ email, password })
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toExist();
                expect(res.body._id).toExist();
                expect(res.body.email).toBe(email);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                User.findOne({ email }).then((user) => {
                    expect(user).toExist();
                    expect(user.password).toNotBe(password);
                    done();
                });
            });
    }, (e) => { });

    it('should validation errors if request invalid', (done) => {       
        request(app)
            .post('/users')
            .send({ 
                email: 'xyz',
                password: '123' })
            .expect(400)
            .end(done);
    }, (e) => { });

    it('should not create user if email in use', (done) => {      
        request(app)
        .post('/users')
        .send({ 
            email: users[0].email,
            password: 'Password123'
        })
        .expect(400)
        .end(done);
    });
});