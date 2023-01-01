const nodemailer = require("nodemailer");
const path = require("path");
const htmlToText = require("html-to-text");
const ejs = require("ejs");

module.exports = class Emailer {
  constructor(user, url) {
    this.to = user.email;
    this.user = user;
    this.url = url;
    this.from = `AfroHK Team <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    return nodemailer.createTransport({
      service: "SendGrid",
      auth: {
        user: `${process.env.SG_API_KEY}`,
        pass: `${process.env.SG_API_KEY_PASSWORD}`,
      },
    });

    /*	      
	  if (process.env.NODE_ENV === 'production') {
	    // Sendgrid
	   
	  }
      
	  return nodemailer.createTransport({
	    host: process.env.EMAIL_HOST,
	    port: process.env.EMAIL_PORT,
	    auth: {
	      user: process.env.EMAIL_USERNAME,
	      pass: process.env.EMAIL_PASSWORD
	    }
	  });
	  */
  }

  // Send the actual email
  async send(template, subject) {
    // 1) Render HTML based on a pug template
    let html;

    ejs.renderFile(
      `${__dirname}/../views/emails/${template}.ejs`, {
        user: this.user,
        url: this.url,
        subject,
      },
      function (err, str) {
        if (err) {
          console.log(err);
        } else {
          html = str;
        }
      }
    );
    // 2) Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.convert(html, {
        wordwrap: 130,
      }),
    };
    // 3) Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendVerifyEmail() {
    await this.send("welcome_mail", "Welcome to the Afrohk Family!");
  }

  async sendPasswordReset() {
    await this.send(
      "passwordReset",
      "Réinitialisation de mot de passe"
    );
  }
};

/*
const sgTransport = nodemailer.createTransport({
  service: "SendGrid",
  auth: {
    user: process.env.SG_API_KEY,
    pass: process.env.SG_API_KEY_PASSWORD
  },
});

module.exports.sendResetEmail = async (email, token) => {
   // change first part to your domain
  let url = "http://localhost:8000/user/reset-password?token=" + token;

  await sgTransport.sendMail({
    from: "<afrohouseofknowledge@gmail.com>",
    to: email,
    subject: "RESET YOUR PASSWORD",
    text: `Click on this link to reset your password ${url}`,
    html: `<h3> Click on this link to reset your password : ${url} </h3>`,
  });
};

module.exports.sendVerifyEmail = async (user, token) => {
  // change first part to your domain
  let url;
  if(process.env.NODE_ENV == "production") {
	url = "https://www.afrohk.com/user/verifyemail?token=" + token;
    }else{
	url = "http://localhost:3000/user/verifyemail?token=" + token;
    }
console.log(url, user.username, user.email);
const html = ejs.renderFile(path.join(__dirname, "../views/emails/welcome_mail.ejs"),{
	username: user.username,
	url
});

  await sgTransport.sendMail({
    from: "<afrohouseofknowledge@gmail.com>",
    to: user.email,
    subject: "Activation votre compte",
    text: `Cliquez sur ce lien pour activer votre compte ${url}`,
    html
  });
};
*/