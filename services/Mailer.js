import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';

class Mailer {
  constructor() {

    this.transporter = nodemailer.createTransport({
      host: 'smtp.mailgun.org',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: 'postmaster@simco-online.com', // generated ethereal user
        pass: 'aef770d5e52f9de09bc945f6a098ed8f',
      }
    });

  }

  verificationEmail(user, res){
    const {transporter} = this;
    let encrypt = jwt.sign({_id: user._id, token: user.token}, '6A586E327235753878214125442A472D');


    let mailOptions = {
        from: 'Group <no-reply@connectdex.com>', // sender address
        to: user.email, // list of receivers
        subject: 'Email Verification ✔', // Subject line
        text: 'yout accoutn has been created please verified your email address', // plain text body
        html: `<a href={localhost:3000/verified/?token=${encrypt}}>localhost:3000/verified/?token=${encrypt}</a>` // html body
    };

    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log(info);
      }
    });
  }
}

export default Mailer;
