const { validationResult } = require("express-validator");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const { check } = require("express-validator");

exports.getLogin = (req, res, next) => {
    res.render("auth/login" , {
        pageTitle: "Login",
        currentPage: "Login",
        isLoggedIn: false,
        errors: [],
        oldInput: {email: ""},
        user: {},
    });
}

exports.getSignUp = (req, res, next) => {
    res.render("auth/signup" , {
        pageTitle: "Sign Up",
        currentPage: "Sign Up",
        isLoggedIn: false,
        errors: [],
        oldInput: {firstName: "", lastName: "", email: "", password: "", userType: ""},
        user: {},
    });
}


exports.postSignUp = [
    check("firstName")
    .trim()
    .isLength({min: 2})
    .withMessage("First name must be at least 2 characters long")
    .matches(/^[A-Za-z\s]+$/)
    .withMessage("First name must contain only letters and spaces"),

    check("lastName")
    .matches(/^[A-Za-z\s]+$/)
    .withMessage("Last Name must contain only letters"),

    check("email")
    .isEmail()
    .withMessage("Please enter a valid email address")
    .normalizeEmail(),

    check("password")
    .isLength({min: 8})
    .withMessage("Password must be at least 8 characters long")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number")
    .matches(/[@$!%*?&]/)
    .withMessage("Password must contain at least one special character")
    .trim(),

    check("confirmPassword")
    .trim()
    .custom((value, {req}) => {
        if(value !== req.body.password){
            throw new Error("Passwords do not match")
        }
        return true;
    }),

    check("userType")
    .notEmpty()
    .withMessage("User type is required")
    .isIn(["guest", "host"])
    .withMessage("Invalid user type"),

    check("terms")
    .notEmpty()
    .withMessage("You must accept the terms and conditions")
    .custom((value) => {
        if(value !== "on"){
            throw new Error("You must accept the terms and conditions")
        }
        return true;
    }),

   (req, res, next) =>{
    const {firstName, lastName, email, password, userType} = req.body;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).render("auth/signup", {
            pageTitle: "Sign Up",
            currentPage: "Sign Up",
            isLoggedIn: false,
            errors: errors.array().map(err => err.msg),
            oldInput: {firstName, lastName, email, password, userType},
            user: {},
        })
    }        
    
    bcrypt.hash(password, 12).then(hashedPassword => {
        const user = new User({ 
            firstName: firstName, 
            lastName: lastName, 
            email: email,
            password: hashedPassword, 
            userType: userType
        });
            return user.save().then(() =>{
            res.redirect("/login")
    }).catch(err => {
        return res.status(422).render("auth/signup", {
            pageTitle: "Sign Up",
            currentPage: "Sign Up",
            isLoggedIn: false,
            errors: [err.message],
            oldInput: {firstName, lastName, email, password, userType},
            user: {},
        })
    })
   })
}
]

exports.postLogin = async(req, res, next) => {
    const {email, password} = req.body;
    const user = await User.findOne({email})
    if(!user){
        return res.status(422).render("auth/login", {
        pageTitle: "Login",
        currentPage: "Login",
        isLoggedIn: false,
        errors: ["User does not exist"],
        oldInput: {email},
        user: {},
    })
    }
    const doMatch = await bcrypt.compare(password, user.password);
    if(!doMatch){
        return res.status(422).render("auth/login", {
        pageTitle: "Login",
        currentPage: "Login",
        isLoggedIn: false,
        errors: ["Invalid password"],
        oldInput: {email},
        user: {},
    })
    }

    req.session.isLoggedIn = true;
    req.session.user = JSON.parse(JSON.stringify(user));
    await req.session.save(() => {
    res.redirect("/");
  });
}

exports.postLogout = (req, res, next) => {
        req.session.destroy(() =>{
       res.redirect("/")
     }) 
}