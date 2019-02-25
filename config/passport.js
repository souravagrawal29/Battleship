module.exports = (passport) => {
    passport.serializeUser((User,done) => {
    	console.log("Serialized");
    	return done(null,User);
    });
  
    passport.deserializeUser((User,done) => {
    	console.log("Deserialized");
    	return done(null,User);    
    });
}