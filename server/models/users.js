const { Schema, model } = require('mongoose')
const usersSchema = new Schema({
    israeliId:Number,
    fname: String,
    lname: String,
    email: String,
    password: String,
    role: String,
    city: String,
    street: String,
    cart: { type: Schema.Types.ObjectId,ref:"carts" }
})
const Users = model('user', usersSchema)
module.exports = Users