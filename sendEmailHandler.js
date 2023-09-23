const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = (url) => {
  const msg = {
    to: process.env.MAIL,
    from: process.env.MAIL,
    subject: "Email verification",
    text: `Verify your email by clicking on the link - ${url}`,
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });
};

module.exports = {
  sendEmail,
};
