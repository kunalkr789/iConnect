const express = require('express');
const router = express.Router();
const passport = require('passport');

const usersController = require('../controllers/users_controller');
const freindcontroler=require('../controllers/friendship_controller');

router.get('/profile/:id', passport.checkAuthentication, usersController.profile);
router.get('/profile-freind',passport.checkAuthentication,freindcontroler.freindprofile);

router.post('/update/:id', passport.checkAuthentication, usersController.update);
router.get('/search', passport.checkAuthentication, usersController.search);

router.get('/sign-up', usersController.signUp);
router.get('/sign-in', usersController.signIn);


router.post('/create', usersController.create);
router.get('/removefriend',freindcontroler.removeFreind);

// use passport as a middleware to authenticate
router.post('/create-session', passport.authenticate(
    'local',
    {failureRedirect: '/users/sign-in'},
), usersController.createSession);


router.get('/sign-out', usersController.destroySession);
router.get('/resetpassword/page', usersController.resetpasswordpage);
router.post('/resetpassword/email', usersController.resetPasswordEmail);
router.get('/resetpassword/update', usersController.resetPasswodUpdatePage);
router.post('/resetPassword', usersController.resetPassword);


router.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));
router.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: '/users/sign-in'}), usersController.createSession);

module.exports = router;