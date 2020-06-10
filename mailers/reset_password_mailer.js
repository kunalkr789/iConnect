const nodemailer = require('../config/nodemailer');

exports.resetPassword = (resetuser) =>
{
    let htmlstring=nodemailer.renderTemplate({resetuser: resetuser},'/reset_password/reset_password.ejs');
    nodemailer.transporter.sendMail(
        {   
            from:'team.iconnectt@gmail.com',
            to: resetuser.user.email,
            subject:'Reset Your Password',
            html: htmlstring
        },(err,info)=>
        {
            if(err){console.log('error in delivering mail', err); return;}

            console.log(info);
        }
    );
}