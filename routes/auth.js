module.exports = (passport) =>{
    let exp = {};

    exp.login = passport.authenticate('local', {failureRedirect: '/login'});
    
    return exp;
}