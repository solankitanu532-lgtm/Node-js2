const Home = require('../models/home')
const User = require('../models/user')

exports.getIndex = (req,res,next)=>{
    Home.find().then((registeredHomes) => res.render('store/index',{registeredHomes: registeredHomes,  
      pageTitle: 'airbnb Home',
      currentPage: 'Index',
      isLoggedIn: req.isLoggedIn,
      user: req.session.user,
    }))
}

exports.getHomes = (req,res,next)=>{
   Home.find().then((registeredHomes) => res.render('store/home-list',{registeredHomes: registeredHomes, 
      pageTitle: 'Home List',
      currentPage: 'Home',
      isLoggedIn: req.isLoggedIn,
      user: req.session.user,
   }))
}

exports.getBookings = (req,res,next)=>{
   res.render('store/booking',{pageTitle: 'My Bookings'
      ,currentPage: 'Bookings',
   isLoggedIn: req.isLoggedIn,
   user: req.session.user,
})
}


exports.getFavouriteList = async (req,res,next)=>{
   const userId = req.session.user._id
   const user = await User.findById(userId).populate('favourites')
    res.render('store/favourite-list',{
      favouriteHome: user.favourites,  
      pageTitle: 'My Favourite List',
      currentPage: 'Favourite List',
      isLoggedIn: req.isLoggedIn,
      user: req.session.user,
  })
}

exports.postAddTOFavourite = async(req,res,next)=>{
   const homesId = req.body.id
   const userId = req.session.user._id
   const user = await User.findById(userId)
   if(!user.favourites.includes(homesId)){
      user.favourites.push(homesId)
      await user.save()
   }
      res.redirect('/favourites') 
}

exports.postDeleteFromFavourite = async (req,res,next)=>{
  const homesId = req.params.homesId
  const userId = req.session.user._id
  const user = await User.findById(userId)
  if(user.favourites.includes(homesId)){
     user.favourites = user.favourites.filter(fav => fav !== homesId)
       await user.save()
  }
   res.redirect('/favourites') 
}

exports.getHomesDetails = (req,res,next)=>{
   const homesId = req.params.homesId
   Home.findById(homesId).then(home =>{
      if(!home){
         res.redirect("/homes")
      }else
         {
        res.render('store/home-detail',{home: home, pageTitle:"Home detail",currentPage: 'Home',
         isLoggedIn: req.isLoggedIn,
         user: req.session.user,
        })}
   })
}