const { Schema, model } = require('mongoose')

const cartsSchema = new Schema({
    dateCreated: Date,
    products: [
        {
            productId: { type: Schema.Types.ObjectId, ref: "Products" },
            quantity: Number
        }
    ],
    price: Number
})
const Carts = model('cart', cartsSchema)
module.exports = Carts