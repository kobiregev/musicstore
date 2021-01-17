const router = require('express').Router()
const Orders = require('../models/orders')
const Users = require('../models/users')
const Carts = require('../models/carts')
const { verifyUser } = require('../verify')
const moment = require('moment')

router.post('/', verifyUser, async (req, res) => {
    const { city, street, creditCard, deliveryDate } = req.body
    if (city && street && creditCard && creditCard.length === 8 && deliveryDate) {
        try {
            const date = deliveryDate.split('T')[0]
            const user = await Users.findById(req.user.id)
            const cart = await Carts.findById(user.cart)
            const orders = await Orders.find({ deliveryDate: date })
            if (orders.length < 3) {
                if (cart && cart.products.length > 0) {
                    let lastFourNumbers = +creditCard.toString().split('').slice(4).join('')
                    const order = await new Orders({ user: user._id, cart: cart._id, finalPrice: cart.price, street, city, creditCard: lastFourNumbers, orderdDate: new Date(), deliveryDate: date })
                    user.cart = undefined
                    await user.save()
                    await order.save()
                    const orderStatus = await Orders.find({ user: user._id })
                    res.json({ error: false, cartStatus: 'notActive', msg: `Your last order was on ${moment(orderStatus[orderStatus.length - 1].orderdDate).format('MMMM Do YYYY')}`})
                } else {
                    res.status(400).json({ error: true, msg: 'You must have at least 1 item in cart to purchse.' })
                }
            } else {
                res.status(400).json({ error: true, msg: 'Sorry there are no more deliveries for today Please select another delivery day.' })
            }
        } catch (error) {
            res.sendStatus(500)
        }
    } else {
        res.status(400).json({ error: true, msg: 'Missing some info.' })
    }
})
router.get('/', verifyUser, async (req, res) => {
    try {
        const dates = await Orders.find({})
        let deliveryDates = dates.map(o => o.deliveryDate.toString())
        let set = [...new Set([...deliveryDates])]
        let fullDates = []
        for (let i = 0; i < set.length; i++) {
            let count = deliveryDates.filter(d => d == set[i]).length
            count >= 3 ? fullDates.push(set[i]) : null
        }
        res.json(fullDates)
    } catch (error) {
        res.sendStatus(500)
    }
})

module.exports = router