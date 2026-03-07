const Favourite = require('../models/favourite')
const Home = require('../models/home')

exports.getIndex = (req,res,next)=>{
    Home.find().then((registeredHomes) => res.render('store/index',{registeredHomes: registeredHomes,  pageTitle: 'airbnb Home',currentPage: 'Index',
      isLoggedIn: req.isLoggedIn
    }))
}

exports.getHomes = (req,res,next)=>{
   Home.find().then((registeredHomes) => res.render('store/home-list',{registeredHomes: registeredHomes, pageTitle: 'Home List',currentPage: 'Home',
      isLoggedIn: req.isLoggedIn
   }))
}

exports.getBookings = (req,res,next)=>{
   res.render('store/booking',{pageTitle: 'My Bookings'
      ,currentPage: 'Bookings',
   isLoggedIn: req.isLoggedIn})
}


exports.getFavouriteList = (req,res,next)=>{
   Favourite.find().then(favourites =>{
      favourites = favourites.map(favourite => favourite.homesId.toString())
      Home.find().then((registeredHomes) =>{
         const favouriteHome = registeredHomes.filter(home => favourites.includes(home._id.toString()))
         console.log(favouriteHome)
         res.render('store/favourite-list',{favouriteHome: favouriteHome,  pageTitle: 'My Favourite List'
      ,currentPage: 'Favourite List',
   isLoggedIn: req.isLoggedIn})
   })
   })
    
}

exports.postAddTOFavourite = (req,res,next)=>{
   const homesId = req.body.id
   Favourite.findOne({homesId: homesId}).then(favourite =>{
      if(favourite){
         return res.redirect('/favourites')
      }
      const newFavourite = new Favourite({homesId: homesId})
      newFavourite.save().then(() =>{
      res.redirect('/favourites') })
   }).catch(err =>{
      console.log(err)})  
}

exports.postDeleteFromFavourite = (req,res,next)=>{
  const homesId = req.params.homesId
   Favourite.findOneAndDelete({homesId: homesId}).then(() =>{
      res.redirect('/favourites')
   }).catch(err =>{
      console.log(err)
   })
}

exports.getHomesDetails = (req,res,next)=>{
   const homesId = req.params.homesId
   Home.findById(homesId).then(home =>{
      if(!home){
         res.redirect("/homes")
      }else
         {
        res.render('store/home-detail',{home: home, pageTitle:"Home detail",currentPage: 'Home',
         isLoggedIn: req.isLoggedIn
        })}
   })
}