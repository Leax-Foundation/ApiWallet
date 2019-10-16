const nodemailer = require("nodemailer");
const config = require("../config/config.json");

class Mailer {
  constructor() {}

  createTransporter() {
    return nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secureConnection: true,
      auth: {
        user: config.emailUser,
        pass: config.emailPass
      },
      tls: {
        rejectUnauthorized: false
      }
    });
  }

  sendMailWallet(email, wallet) {
    return new Promise((resolve, reject) => {
      let transporter = this.createTransporter();
      console.log(transporter);
      // setup email data with unicode symbols
      let mailOptions = {
        from: '"Silpay" <silpaysolutions@gmail.com>', // sender address
        to: email, // list of receivers
        subject: "Silpay Wallet", // Subject line
        html:
          '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"><html data-editor-version="2" class="sg-campaigns" xmlns="http://www.w3.org/1999/xhtml"> <head> <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/> <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1"/> <meta http-equiv="X-UA-Compatible" content="IE=Edge"/><!--[if (gte mso 9)|(IE)]> <xml> <o:OfficeDocumentSettings> <o:AllowPNG/> <o:PixelsPerInch>96</o:PixelsPerInch> </o:OfficeDocumentSettings> </xml><![endif]--><!--[if (gte mso 9)|(IE)]> <style type="text/css"> body{width: 600px;margin: 0 auto;}table{border-collapse: collapse;}table, td{mso-table-lspace: 0pt;mso-table-rspace: 0pt;}img{-ms-interpolation-mode: bicubic;}</style><![endif]--> <style type="text/css"> body, p, div{font-family: arial; font-size: 14px;}body{color: #000000;}body a{color: #1188E6; text-decoration: none;}p{margin: 0; padding: 0;}table.wrapper{width:100% !important; table-layout: fixed; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: 100%; -moz-text-size-adjust: 100%; -ms-text-size-adjust: 100%;}img.max-width{max-width: 100% !important;}.column.of-2{width: 50%;}.column.of-3{width: 33.333%;}.column.of-4{width: 25%;}@media screen and (max-width:480px){.preheader .rightColumnContent, .footer .rightColumnContent{text-align: left !important;}.preheader .rightColumnContent div, .preheader .rightColumnContent span, .footer .rightColumnContent div, .footer .rightColumnContent span{text-align: left !important;}.preheader .rightColumnContent, .preheader .leftColumnContent{font-size: 80% !important; padding: 5px 0;}table.wrapper-mobile{width: 100% !important; table-layout: fixed;}img.max-width{height: auto !important; max-width: 480px !important;}a.bulletproof-button{display: block !important; width: auto !important; font-size: 80%; padding-left: 0 !important; padding-right: 0 !important;}.columns{width: 100% !important;}.column{display: block !important; width: 100% !important; padding-left: 0 !important; padding-right: 0 !important; margin-left: 0 !important; margin-right: 0 !important;}}</style> </head> <body> <center class="wrapper" data-link-color="#1188E6" data-body-style="font-size: 14px; font-family: arial; color: #000000; background-color: #ffffff;"> <div class="webkit"> <table cellpadding="0" cellspacing="0" border="0" width="100%" class="wrapper" bgcolor="#ffffff"> <tr> <td valign="top" bgcolor="#ffffff" width="100%"> <table width="100%" role="content-container" class="outer" align="center" cellpadding="0" cellspacing="0" border="0"> <tr> <td width="100%"> <table width="100%" cellpadding="0" cellspacing="0" border="0"> <tr> <td><!--[if mso]> <center> <table><tr><td width="600"><![endif]--> <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width: 100%; max-width:600px;" align="center"> <tr> <td role="modules-container" style="padding: 0px 0px 0px 0px; color: #000000; text-align: left;" bgcolor="#ffffff" width="100%" align="left"> <table class="module preheader preheader-hide" role="module" data-type="preheader" border="0" cellpadding="0" cellspacing="0" width="100%" style="display: none !important; mso-hide: all; visibility: hidden; opacity: 0; color: transparent; height: 0; width: 0;"> <tr> <td role="module-content"> <p></p></td></tr></table> <table class="wrapper" role="module" data-type="image" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;"> <tr> <td style="font-size:6px;line-height:10px;padding:50px 0px 50px 0px;background-color:#3A3F7B;" valign="top" align="center"> <img class="max-width" border="0" style="display:block;color:#000000;text-decoration:none;font-family:Helvetica, arial, sans-serif;font-size:16px;max-width:40% !important;width:40%;height:auto !important;" src="https://marketing-image-production.s3.amazonaws.com/uploads/1808af723777a905dd45147abe9030692431ba2ddbf422e2e79c48bc3b5a73bb3e7fae8d90c942f9b1b2f2b59a260dbdd969ac402c03db1b6c2703cb80630cec.png" alt="" width="240"> </td></tr></table> <table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;"> <tr> <td style="padding:50px 20px 50px 20px;line-height:20px;text-align:justify;" height="100%" valign="top" bgcolor=""> <div><h1 style="font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-family: arial; color: rgb(0, 0, 0); text-align: center;"><span style="font-size: 28px;"><span style="font-size: 28px; color: rgb(51, 51, 51);">YOUR WALLET</span></span></h1><div style="font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; font-family: arial; font-size: 14px; color: rgb(0, 0, 0); text-align: center;"><span style="font-size: 12px;"><span style="font-family: tahoma, geneva, sans-serif; font-size: 12px;"><span style="font-size: 12px; color: rgb(51, 51, 51);">We have attached your wallet to this email.</span></span></span></div><div style="font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; font-family: arial; font-size: 14px; color: rgb(0, 0, 0); text-align: center;">&nbsp;</div><div style="font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; font-family: arial; font-size: 14px; color: rgb(0, 0, 0); text-align: center;"><span style="font-size: 12px;"><span style="font-family: tahoma, geneva, sans-serif; font-size: 12px;"><font color="#333333">Please keep the wallet safe. The wallet is encrypted with the password that you chose and cannot be used without it.</font></span></span></div><div>&nbsp;</div></div></td></tr></table> <table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;"> <tr> <td style="background-color:#f3f3f3;padding:40px 0px 40px 0px;line-height:22px;text-align:inherit;" height="100%" valign="top" bgcolor="#f3f3f3"> <div><address style="font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; font-family: arial; font-size: 14px; color: rgb(0, 0, 0); text-align: center;"><span style="font-size: 11px;"><span style="font-size: 11px;"><span style="font-weight: 600; background: transparent; font-size: inherit;"><span style="font-family: tahoma, geneva, sans-serif; font-size: 11px;">leax.io</span></span></span></span></address><address style="font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; font-family: arial; font-size: 14px; color: rgb(0, 0, 0); text-align: center;"><span style="font-size: 11px;"><span style="font-size: 11px;"><span style="font-family: tahoma, geneva, sans-serif; font-size: 11px;">Copyright &copy; 2018 Leaxcoin. All Rights Reserved</span></span></span></address></div></td></tr></table> </td></tr></table><!--[if mso]> </td></tr></table> </center><![endif]--> </td></tr></table> </td></tr></table> </td></tr></table> </div></center> </body></html>', // html body
        attachments: [
          {
            // utf-8 string as an attachment
            filename: "wallet-Silpay.json",
            content: JSON.stringify(wallet)
          }
        ]
      };
      // send mail with defined transport object
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
          reject("error");
        } else {
          console.log(info);
          resolve("success");
        }
      });
    });
  }
}

module.exports = new Mailer();
