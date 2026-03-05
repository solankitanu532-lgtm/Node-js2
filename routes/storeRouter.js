const express = require('express')
const storeRouter = express.Router()
const storeController = require('../controllers/storeController')

storeRouter.get('/',storeController.getIndex)
storeRouter.get('/homes',storeController.getHomes)
storeRouter.get('/bookings',storeController.getBookings)
storeRouter.get('/favourites',storeController.getFavouriteList)
storeRouter.get('/homes/:homesId',storeController.getHomesDetails)
storeRouter.post('/favourites',storeController.postAddTOFavourite)
storeRouter.post('/favourites/delete/:homesId',storeController.postDeleteFromFavourite)


module.exports = storeRouter