const { ObjectID } = require('mongodb');
const { mongoose } = require('./../server/db/mongoose');
const { Todo } = require('./../server/models/todo');
const { User } = require('./../server/models/user');

// Todo.remove({}).then((result) => {
//     console.log(result);
// });

// Todo.findByIdAndRemove('5b79ce2358d13a835bcf3569').then((todo) => {
//     console.log(todo);
// });

Todo.findOneAndRemove({_id: '5b79ce2358d13a835bcf3569'}).then((todo) => {
        console.log(todo);
    });