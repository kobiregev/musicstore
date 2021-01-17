const { verifyUser } = require('../verify')
const router = require('express').Router()
const moment = require('moment')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const Users = require('../models/users')
const Carts = require('../models/carts')
const Orders = require('../models/orders')
const isIsraeliIdValid = require('israeli-id-validator')

router.post('/register', async (req, res) => {
    const { fname, lname, email, password, city, street, israeliId } = req.body
    if (fname && lname && email && password && city && street && israeliId) {
        try {
            const user = await Users.findOne({ email })
            if (!user || isIsraeliIdValid(israeliId) || user && user.israeliId != israeliId && user.email != email) {
                const salt = bcrypt.genSaltSync(10)
                const hash = bcrypt.hashSync(password, salt)
                const newUser = await new Users({ fname, lname, email, password: hash, city, street, israeliId, role: "user" })
                await newUser.save()
                res.status(201).json({ error: false, msg: 'Account created successfully.' })
            } else {
                res.status(400).json({ error: true, msg: 'Email or Id already taken.' })
            }
        } catch (error) {
            res.sendStatus(500)
        }
    } else {
        res.status(400).json({ error: true, msg: 'Missing some info.' })
    }
})
router.post('/login', async (req, res) => {
    const { email, password } = req.body
    if (email && password) {
        try {
            const user = await Users.findOne({ email })
            if (user && bcrypt.compareSync(password, user.password)) {
                let cart
                if (user.cart) {
                    const userCart = await Carts.findById(user.cart)
                    cart = { cartStatus: "open", msg: `You have an open cart from - ${moment(userCart.dateCreated).format('MMMM Do YYYY')}, With current price of ${userCart.price}$` }
                } else {
                    const order = await Orders.find({ user: user._id })
                    cart = order.length > 0 ? { cartStatus: 'notActive', msg: `Your last order was on ${moment(order[order.length - 1].orderdDate).format('MMMM Do YYYY')}` } : { cartStatus: 'newUser', msg: "welcome to your first buy" }
                }
                const token = jwt.sign({ id: user._id, fname: user.fname, role: user.role, city: user.city, street: user.street }, process.env.SECRET, { expiresIn: '20m' })
                res.status(200).json({ error: false, token, cart })
            } else {
                res.status(400).json({ error: true, msg: 'Wrong email or password.' })
            }
        } catch (error) {
            res.sendStatus(500)
        }
    } else {
        res.status(400).json({ error: true, msg: 'Missing some info.' })
    }
})
router.post('/validateEmail', async (req, res) => {
    const { email } = req.body
    try {
        const result = await Users.find({ email })
        result.length > 0 ? res.status(200).json({ error: true, msg: "Email Already Taken." }) : res.status(200).json({ error: false, msg: "Email is not taken." })
    } catch (error) {
        res.sendStatus(500)
    }
})
router.post('/validateIsraeliId', async (req, res) => {
    const { israeliId } = req.body
    try {
        const result = await Users.find({ israeliId })
        result.length > 0 ? res.status(200).json({ error: true, msg: "Id Already Taken." }) : res.status(200).json({ error: false, msg: "Id is not taken." })
    } catch (error) {
        res.sendStatus(500)
    }
})

router.get('/validateToken', verifyUser, async (req, res) => {
    try {
        const user = await Users.findById(req.user.id)
        if (user) {
            if (user.cart) {
                const userCart = await Carts.findById(user.cart)
                cart = { cartStatus: "open", msg: `You have an open cart from - ${moment(userCart.dateCreated).format('MMMM Do YYYY')}, With current price of ${userCart.price}$` }
            } else {
                const order = await Orders.find({ user: user._id })
                cart = order.length > 0 ? { cartStatus: 'notActive', msg: `Your last order was on ${moment(order[order.length - 1].orderdDate).format('MMMM Do YYYY')}` } : { cartStatus: 'newUser', msg: "welcome to your first buy" }
            }
            res.status(200).json({ error: false, cart })
        } else {
            res.status(403).json({ error: true, msg: "Can't find this user" })
        }
    } catch (error) {
        res.sendStatus(500)
    }
})
module.exports = router