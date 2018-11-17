const nodemailer = require('nodemailer');

function sendEmailTo(sender, recipients) {
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
        subject: 'Test email sent from nodemailer',
        html: `
            <h2>
                Hi bro, this is an email sent with nodemailer. Sorry for the inconvenience. Cheers and have a good day!
            </h2>
            <p>
                For dear followers of user ${sender},
            </p>
            <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias neque consequuntur nobis officia perspiciatis maxime quae eius rerum iure voluptate, commodi veniam temporibus possimus minus illo error dignissimos reprehenderit asperiores quod ducimus perferendis? Delectus fugiat, nam at sint illo commodi a est quaerat! Odio quas exercitationem beatae eos totam doloribus.
            </p>    
            <p>
                <a href="https://blogv4-b1e95.firebaseapp.com/articles/5bcda379ddde9b0e0553fb84" target="blank">
                    Check out this new article from Mr.X!
                </a>
            </p>
            <p>Thank you for your patience!</p>
            <hr>
            <p>
                Should you have any query, don't hesitate to contact us at this email address.
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