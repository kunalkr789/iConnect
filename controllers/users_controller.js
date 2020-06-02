module.exports.profile = function(req, res){
    return res.render('user_profile', {
        title: 'user profile'
    });
}

module.exports.signUp = function(req, res){
    return res.render('user_sign_up', {
        title: 'Sign Up'
    });
}

module.exports.signIn = function(req, res){
    return res.render('user_sign_in', {
        title: 'Sign In'
    });
}
//get the sign up data
module.exports.create = function(req, res){
    
}