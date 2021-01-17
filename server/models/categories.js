const { Schema, model } = require('mongoose')

const categoriesSchema = new Schema({
    category: String,
    products: [{ type: Schema.Types.ObjectId, ref: "product" }],
})
const Categories = model('categories', categoriesSchema)
module.exports = Categories