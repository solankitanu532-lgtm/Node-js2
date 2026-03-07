exports.getLogin = (req, res, next) => {
    res.render("auth/login" , {
        pageTitle: "Login",
        currentPage: "Login",
          isLoggedIn: false
    });
}

exports.postLogin = (req, res, next) => {
    console.log(req.body)
    res.redirect("/")
}

exports.postLogout = (req, res, next) => {
    res.redirect("/")
}