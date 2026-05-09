const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'nguyenphuoctai3717@gmail.com',
    pass: 'dfjc dssk iwkp zfxe'
  }
});

exports.sendMail = async ({ to, subject, html }) => {
  try {
    const info = await transporter.sendMail({
      from: '"CacCongNghePhanMemMoi" <nguyenphuoctai3717@gmail.com>',
      to,
      subject,
      html
    });
    console.log('Email sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Lỗi khi gửi email:', error);
    throw error;
  }
};
