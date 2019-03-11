module.exports = (passport) => {
    let exp = {};

    exp.login = passport.authenticate('local', {
        successRedirect: '/user',
        failureRedirect: '/',
        failureFlash: true
    });

    exp.isLoggedIn = (req, res, next) => {
        if(req.isAuthenticated())
            next();
        else
            res.redirect('/');
    };

    exp.isAdminLoggedIn = (req, res, next) => {
        if (req.isAuthenticated() && req.user.access == 1)
            return next();
        
        else if (req.isAuthenticated())
            res.redirect('/questions');
        
        else
            res.redirect('/');
    };

    exp.redirectIfLoggedIn = (req,res,next) => {
        if(req.isAuthenticated())
            res.redirect('/user');
        else
            return next();
    };

    exp.logout = (req, res) => {
        req.logout();
        res.redirect('/');
    };
    
    return exp;
}