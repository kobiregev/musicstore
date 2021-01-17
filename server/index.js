require('dotenv').config()
require('./db')
const express = require('express')
const fileUpload = require('express-fileupload');
const app = express()
const Orders = require('./models/orders')
const Products = require('./models/products')
const port = process.env.PORT

app.use(require('cors')())
app.use(express.json())
app.use(express.static('public'))
app.use(require('express-fileupload')())
app.use('/users', require('./routes/users'))
app.use('/products', require('./routes/products'))
app.use('/cart', require('./routes/cart'))
app.use('/orders', require('./routes/orders'))

app.get('/storeinfo', async (req, res) => {
    try {
        const numberOfOrders = await Orders.find({})
        const numberOfProducts = await Products.find({})
        res.status(200).json({ error: false, numberOfOrders: numberOfOrders.length, numberOfProducts: numberOfProducts.length })
    } catch (error) {
        res.sendStatus(500)
    }
})


app.listen(port, () => console.log(`runing on port ${port}`))