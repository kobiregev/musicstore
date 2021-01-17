const { Schema, model } = require('mongoose')

const ordersSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "Users" },
    cart: { type: Schema.Types.ObjectId, ref: "Carts" },
    finalPrice: Number,
    city: String,
    street: String,
    orderdDate: Date,
    deliveryDate: Date,
    creditCard: Number,
})

const Orders = model('order', ordersSchema)
module.exports = Orders