const { Schema, model } = require('mongoose')

const productsSchema = new Schema({
    name: String,
    category: { type: Schema.Types.ObjectId, ref: "Categories" },
    price: Number,
    imgUrl: String
})
const Products = model('product', productsSchema)
module.exports = Products