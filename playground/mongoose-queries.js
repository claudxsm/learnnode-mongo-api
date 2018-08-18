const {ObjectID} = require('mongodb');
const { mongoose } = require('./../server/db/mongoose');
const { Todo } = require('./../server/models/todo');
const { User } = require('./../server/models/user');

var id = '5b78a676ef14be8130164e4f';

if(!ObjectID.isValid(id)){
    console.log('ID not valid');
}

Todo.find({
    _id: id
}).then((todos) => {
    console.log('Todos', todos);
});

Todo.findOne({
    _id: id
}).then((todo) => {
    console.log('Todo', todo);
});

Todo.findById(id).then((todo) => {
    if(!todo){
        return console.log('id not found');
    }
    console.log('Todo', todo);
}).catch((e) => console.log(e));

var userid = '5b7799c7c9f9e86927b26b80';

User.findById(userid).then((user) => {
    if(!user){
        return console.log('id not found');
    }
    console.log('User', user);
}).catch((e) => console.log(e));