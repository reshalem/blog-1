const nodemailer = require('nodemailer');

function sendEmailTo(sender, recipients, articleId) {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.COMPANY_EMAIL,
            pass: process.env.COMPANY_PASSWORD
        }
    });

    let mailOptions = {
        from: `"Blogate" <${process.env.COMPANY_EMAIL}>`,
        to: recipients,
        subject: `Newest Article From ${sender}`,
        html: `
            <h2>
                Hi, We're sending you this email to notify you about the newest article posted by user ${sender} whom you've followed.
            </h2>
            <p>
                For dear followers of ${sender},
            </p>
            <p>
                Below is the direct link to see what the new article is all about. You really don't want to be late to read what your favorite writers have got for you.
            </p>    
            <p>
                <a href="https://blo-gate.firebaseapp.com/articles/${articleId}" target="blank">
                    Quickly check this out!
                </a>
            </p>
            <p>Thank you for your patience!</p>
            <hr>
            <p>
                Should you have any queries, please don't hesitate to contact us at this email address.
            </p>
            <p>Best Regards, </p><br />
            <p>Blogate Team</p>
        `
    };

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log('Send Mail Error: ', error);
            console.log('Error Message: ', error.message);
        }

        console.log('Send Email Result: ', info);
        console.log('Preview URL: ', nodemailer.getTestMessageUrl(info));
    });
}

module.exports = sendEmailTo;