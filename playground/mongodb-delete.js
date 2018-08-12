const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');

    const db = client.db('TodoApp');

    //delete many
    // db.collection('Todos').deleteMany({ text: 'eat lunch' })
    //     .then((result) => {
    //         console.log(result);
    //     })

    //delete one
    // db.collection('Todos').deleteOne({ text: 'eat lunch' })
    //     .then((result) => {
    //         console.log(result);
    //     })

    //find one and delete
    // db.collection('Todos').findOneAndDelete({ completed: false })
    // .then((result) => {
    //     console.log(result);
    // })



    //delete many
    db.collection('Users').deleteMany({ name: 'Bob' })
        .then((result) => {
            console.log(result);
        })

    //find one and delete
    db.collection('Users').findOneAndDelete({ _id: new ObjectID("5b6f4a387341220b7c8d817a") })
    .then((result) => {
        console.log(result);
    })
    

    //client.close();
});