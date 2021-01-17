const Users = require('../models/users')
const Carts = require('../models/carts')
const Products = require('../models/products')
const { verifyUser } = require('../verify')
const router = require('express').Router()

router.get('/', verifyUser, async (req, res) => {
    try {
        const user = await Users.findById(req.user.id)
        const cart = await Carts.findById(user.cart).populate({
            path: 'products.productId',
            model: Products,
        })
        res.json(cart)
    } catch (error) {
        res.sendStatus(500)
    }
})

router.post('/add', verifyUser, async (req, res) => {
    let { productId, quantity } = req.body
    if (productId && quantity) {
        try {
            quantity = Math.floor(quantity)
            const user = await Users.findById(req.user.id)
            const cart = await Carts.findById(user.cart)
            const product = await Products.findById(productId)
            const tempCart = cart.products.find(product => product.productId == productId)
            tempCart ? tempCart.quantity += +quantity : cart.products.push({ productId: product._id, quantity })
            await cart.save()
            const updatedCart = await calculateCartPrice(user.cart)
            res.json(updatedCart)
        } catch (error) {
            res.sendStatus(500)
        }
    } else {
        res.status(400).json({ error: true, msg: 'Missing some info' })
    }
})

router.post('/remove', verifyUser, async (req, res) => {
    const { productId, clearCart } = req.body
    if (productId || clearCart) {
        try {
            const user = await Users.findById(req.user.id)
            const cart = await Carts.findById(user.cart)
            if (clearCart) {
                cart.products = []
                cart.price = 0
                await cart.save()
                res.json(cart)
            } else {
                const product = await Products.findById(productId)
                const productToRemove = cart.products.find(product => product.productId == productId)
                const tempCart = cart.products.filter(product => product.productId != productId)
                cart.price -= product.price * +productToRemove.quantity
                cart.products = tempCart
                await cart.save()
                const updatedCart = await calculateCartPrice(user.cart)
                res.json(updatedCart)
            }
        } catch (error) {
            res.sendStatus(500)
        }
    } else {
        res.status(400).json({ error: true, msg: 'missing some info' })
    }
})

router.post('/createcart', verifyUser, async (req, res) => {
    try {
        const user = await Users.findById(req.user.id)
        if (!user.cart) {
            const newCart = await new Carts({ dateCreated: new Date(), products: [], price: 0 })
            user.cart = newCart._id
            await newCart.save()
            await user.save()
            res.status(201).json({ error: false, msg: 'Cart created successfully.' })
        } else {
            res.status(400).json({ error: true, msg: 'You already have an open cart.' })
        }
    } catch (error) {
        res.sendStatus(500)
    }
})

const calculateCartPrice = async cartId => {
    const reducer = (a, c) => a + (c.quantity * c.productId.price)
    const cart = await Carts.findById(cartId).populate({
        path: 'products.productId',
        model: Products,
    })
    cart.price = cart.products.reduce(reducer, 0).toFixed(2)
    await cart.save()
    return cart
}


module.exports = router

