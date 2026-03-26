const Home = require('../models/home')

exports.getAddHome = (req,res,next)=>{ 
res.render('host/edit-Home',{
pageTitle: 'Add Home to airbnb',
currentPage: 'Add Home', editing: false,

})
} 

exports.getEditHome = (req,res,next)=>{
const homeId = req.params.homeId
const editing = req.query.editing === 'true'

Home.findById(homeId).then(home =>{
   if(!home){
    return res.redirect("/host/host-home-list")
   }
res.render('host/edit-Home',{
   home: home, 
   pageTitle: 'Edit your home',
   currentPage: 'Host Homes', 
   editing: editing,
  
})
})
} 

exports.getHostHomes = (req,res,next)=>{
   Home.find().then((registeredHomes) => res.render('host/host-home-list',{registeredHomes: registeredHomes, 
      pageTitle: 'Host Homes List',
      currentPage: 'Host Homes',
   
   }))
}


exports.postAddHome = (req,res,next)=>{
const{houseName, price, location, rating, photoUrl} = req.body;

const home = new Home({
    houseName,
    price,
    location, 
    rating, 
    photoUrl})
   home.save().then(()=>{
})
res.redirect('/host/host-home-list')
}


exports.postEditHome = (req,res,next)=>{
const{id,houseName, price, location, rating, photoUrl,description} = req.body;
Home.findById(id).then(home =>{
   if(!home){
    return res.redirect("/host/host-home-list")
   }
   home.houseName = houseName
   home.price = price
   home.location = location
   home.rating = rating
   home.photoUrl = photoUrl
   home.description = description
   home.save().then(()=>{
    console.log('home updated successfully')
   }).catch(err =>{
      console.log(err)
   })
   res.redirect('/host/host-home-list')
}).catch(err =>{
   console.log(err)
})
}

exports.postDeleteHome = (req,res,next)=>{
const homeId = req.params.homeId
Home.findByIdAndDelete(homeId).then(()=>{
   res.redirect('/host/host-home-list')
})

}