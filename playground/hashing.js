const {SHA256} =  require('crypto-js');
const jwt = require('jsonwebtoken');

var data = {
    id: 10
};

var token = jwt.sign(data, 'somesecret');
console.log('token',token);

var decoded = jwt.verify(token, 'somesecret');
console.log('decoded', decoded);
//jwt.verify

// var message = 'I am user number 3';
// var hash = SHA256(message).toString();

// console.log('message', message);
// console.log('hash', hash);

// var data = {
//     id: 4
// };

// var token = {
//     data, 
//     hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// }

// token.data.id = 5;
// //token.hash = SHA256(JSON.stringify(token.data)).toString();

// var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();
// if(resultHash === token.hash){
//     console.log('data was not changed');
// }
// else {
//     console.log('data was changed, dont trust');
// }