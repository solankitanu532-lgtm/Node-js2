const { validationResult } = require("express-validator");
const User = require("../models/user");

exports.getLogin = (req, res, next) => {
    res.render("auth/login" , {
        pageTitle: "Login",
        currentPage: "Login",
        isLoggedIn: false
    });
}

exports.getSignUp = (req, res, next) => {
    res.render("auth/signup" , {
        pageTitle: "Sign Up",
        currentPage: "Sign Up",
        isLoggedIn: false,
        errors: [],
        oldInput: {firstName: "", lastName: "", email: "", password: "", userType: ""}
    });
}

exports.postSignUp = [(req, res, next) => {

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
    })

    check("userType")
    .notEmpty()
    .withMessage("User type is required")
    .isIn(["guest", "host"])
    .withMessage("Invalid user type"),

    check("terms")
    notEmpty()
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
        return res.status(422).render
        ("auth/signup", {
            pageTitle: "Sign Up",
            currentPage: "Sign Up",
            isLoggedIn: false,
            errors: errors.array().map[err => err.msg],
            oldInput: {firstName, lastName, email, password, userType}
        })
    }        
    
    const user = new User({ firstName, lastName, email, password, userType});
    user.save().then(() =>{
        res.redirect("/login")
    }).catch(err => {
        return res.status(422).render
        ("auth/signup", {
            pageTitle: "Sign Up",
            currentPage: "Sign Up",
            isLoggedIn: false,
            errors: [err.msg],
            oldInput: {firstName, lastName, email, password, userType}
        })
    })
}
}]

exports.postLogin = (req, res, next) => {
    const {firstName, lastName, email, password, userType} = req.body;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).render
        ("auth/signup", {
            pageTitle: "Sign Up",
            currentPage: "Sign Up",
            isLoggedIn: false,
            errorMessage: errors.array().map[err => err.msg],
            oldInput: {firstName, lastName, email, password, userType}
        })
    }        
    
    const user = new User({ firstName, lastName, email, password, userType});
    user.save().then(() =>{
        res.redirect("/login")
    }).catch(err => {
        return res.status(422).render
        ("auth/signup", {
            pageTitle: "Sign Up",
            currentPage: "Sign Up",
            isLoggedIn: false,
            errorMessage: errors.array().map[err => err.msg],
            oldInput: {firstName, lastName, email, password, userType}
        })
    })
    
    req.session.isLoggedIn = true;
    res.redirect("/")
}

exports.postLogout = (req, res, next) => {
       req.session.destroy(() =>{
       res.redirect("/")
    }) 
}