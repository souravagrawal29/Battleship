module.exports = (passport) =>{
    let exp = {};

    exp.login = passport.authenticate('local', {
        successRedirect: '/user',
        failureRedirect: '/',
        failureFlash: true
    });
    
    return exp;
}