const mongoose = require('mongoose')
const url = 'mongodb+srv://root:ofj9vGrfytj0lSWt@onlineshop.hw8cd.mongodb.net/onlineshop'
//'mongodb://localhost/onlineShop'
mongoose.connect(url, { useNewUrlParser: true ,useUnifiedTopology: true})

const db = mongoose.connection
db.on('error', (error) => console.error('connection error:', error));
db.once('open', function () {
    console.log('connected to onlineShop database on mongo atlas')
});