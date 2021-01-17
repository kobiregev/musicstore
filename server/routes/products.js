const { verifyUser, verifyAdmin } = require('../verify')
const Products = require('../models/products')
const categories = require('../models/categories')
const Categories = require('../models/categories')
const router = require('express').Router()

router.post('/editproduct', verifyAdmin, async (req, res) => {
    const { _id, name, category, price } = req.body
    let image
    req.files ? image = req.files.image : null
    if (_id && name && category && price) {
        try {
            let product = await Products.findById(_id)
            if (product) {
                if (product.category._id.toString() != category.toString()) {
                    let categoryToRemovePro = await Categories.findById(product.category._id)
                    let categoryToUpdate = await Categories.findById(category)
                    let indexToRemove = categoryToRemovePro.products.indexOf(_id)
                    categoryToRemovePro.products.splice(indexToRemove, 1)
                    categoryToUpdate.products.push(_id)
                    await categoryToUpdate.save()
                    await categoryToRemovePro.save()
                    product.category = category
                }
                product.name = name
                product.price = price
                if (image) {
                    if (fileType(image.name)) {
                        image.name = Date.now().toString() + image.name
                        product.imgUrl = `http://localhost:1000/images/${image.name}`
                        image.mv(`public/images/${image.name}`, err => { err ? res.sendStatus(500) : null })
                    } else {
                        res.status.json({ error: true, msg: 'You can upload jpg files only!' })
                    }
                }
                await product.save()
                const products = await Products.find({}).populate({
                    path: "category",
                    model: Categories,
                    select: { category: 1 }
                })
                res.json(products)
            } else {
                res.status(400).json({ error: true, msg: 'cant find this product.' })
            }
        } catch (error) {
            res.sendStatus(500)
        }
    }
})

router.post('/addproduct', verifyAdmin, async (req, res) => {
    const { name, category, price } = req.body
    let image
    req.files ? image = req.files.image : null
    if (name && category && price && image) {
        try {
            if (fileType(image.name)) {
                image.name = Date.now().toString() + image.name
                const imgUrl = `http://localhost:1000/images/${image.name}`
                image.mv(`public/images/${image.name}`, err => { err ? res.sendStatus(500) : null })
                const newProduct = await new Products({ name, category, price, imgUrl })
                const currentCategory = await categories.findById(category)
                currentCategory.products.push(newProduct._id)
                await currentCategory.save()
                await newProduct.save()
                const products = await Products.find({}).populate({
                    path: "category",
                    model: Categories,
                    select: { category: 1 }
                })
                res.json(products)
            } else {
                res.status.json({ error: true, msg: 'You can upload jpg files only!' })
            }
        } catch (error) {
            res.sendStatus(500)
        }
    } else {
        res.status(400).json({ error: true, msg: 'missing some info.' })
    }
})

router.get('/', verifyUser, async (req, res) => {
    const { category } = req.query
    try {
        if (category) {
            const cat = await Categories.find({ category }, { __v: 0 }).populate({
                path: 'products',
                model: Products,
                populate: { path: 'category', model: Categories, select: { category: 1 } }
            })
            res.json(cat[0].products)
        } else {
            const products = await Products.find({}, { __v: 0 }).populate({
                path: "category",
                model: Categories,
                select: { category: 1 }
            })
            res.json(products)
        }
    } catch (error) {
        res.sendStatus(500)
    }
})

router.post('/search', verifyUser, async (req, res) => {
    const { keywords } = req.body
    if (keywords) {
        try {
            const results = await Products.find({ name: { $regex: keywords } }, { __v: 0 }).populate({
                path: "category",
                model: Categories,
                select: { category: 1 }
            })
            results.length > 0 ? res.json(results) : res.status(400).json({ error: true, msg: "No results found." })
        } catch (error) {
            res.sendStatus(500)
        }
    } else {
        res.status(400).json({ error: true, msg: 'Missing some info.' })
    }
})

const fileType = fileName => {
    let imageFileType = fileName.split('.')
    return imageFileType[imageFileType.length - 1].toLowerCase() === 'jpg' ? true : false
}

module.exports = router
