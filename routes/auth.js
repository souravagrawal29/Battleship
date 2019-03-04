module.exports = (passport) =>{
    let exp = {};

    exp.login = passport.authenticate('local', {
        successRedirect: '/user',
        failureRedirect: '/',
        failureFlash: false
    });

    exp.logout = (req,res)=>{
        req.logout();
        res.redirect('/');
    };
    
    return exp;
}