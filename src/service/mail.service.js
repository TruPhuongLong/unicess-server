import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'longbaloca@gmail.com',
        pass: 'bqds ohzp mybo zeuv'
    }
});

export const mailOptionsDefault = {
    from: 'longbaloca@gmail.com', // sender address
    to: 'dangvanduoc1997@gmail.com ', // list of receivers
    subject: 'test send gmail', // Subject line
    html: '<p>good afternoon Mr.Yes</p>'// plain text body
};
