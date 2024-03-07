const User = require("../models/user");
const path = require("path");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRET_KEY;
const dotenv = require("dotenv").config();
const ForgotPasswordModel = require("../models/forgotpassword");
const nodemailer = require("nodemailer");
const uuid = require("uuid");


function generateAccessToken(id, username) {

  return jwt.sign({ userId: id, username: username }, secretKey);
}

exports.getLogin = (req, res, next) => {
  res.sendFile(path.join(__dirname, "..", "views", "login.html"));
};

exports.login = async (req, res, next) => {
  try {
      const { email, password } = req.body;

      const existingUser = await User.findOne({ email } );

      if (!existingUser) {
          return res.status(401).json({ success: false, message: "User not exists!" });
      }

      bcrypt.compare(password, existingUser.password, (err, result) => {
          if (err) {
              return res.status(500).json({ success: false, message: 'Something went wrong' });
          }
          if (result === true) {
              res.status(200).json({ success: true, message: 'User logged in successfully', token: generateAccessToken(existingUser.id, existingUser.username) });
          } else {
              res.status(401).json({ success: false, message: 'Password incorrect' });
          }
      });
  } catch (err) {
      console.error('Error user login:', err);
      res.status(500).json({ success: false, error: err.message });
  }
};

exports.getSignup = (req, res, next) => {
  res.sendFile(path.join(__dirname, "..", "views", "signup.html"));
};

exports.signup = async (req, res, next) => {
  try {
      const { username, email, password } = req.body;

      const existingUser = await User.findOne({ where: { email } });

      if (existingUser) {
          return res.status(400).json({ success: false, message: 'Email already in use' });
      }

      const saltrounds = 10;
      bcrypt.hash(password, saltrounds, async (err, hash) => {
          if (err) {
              return res.status(500).json({ success: false, message: 'Error hashing password' });
          }

          const userData = await User.create({ username, email, password: hash });
          res.status(201).json({ newUserDetails: userData, message: 'User signup successful' });
      });
  } catch (err) {
      console.error('Error creating user:', err);
      res.status(500).json({ success: false, error: err.message });
  }
};

exports.signup = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        const existingUser = await User.findOne({ where: { email } });

        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email already in use' });
        }

        const saltrounds = 10;
        bcrypt.hash(password, saltrounds, async (err, hash) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Error hashing password' });
            }

            const userData = await User.create({ username, email, password: hash });
            res.status(201).json({ newUserDetails: userData, message: 'User signup successful' });
        });
    } catch (err) {
        console.error('Error creating user:', err);
        res.status(500).json({ success: false, error: err.message });
    }
};



//User forgot password >>

exports.forgotPassword = async (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'forgotPassword.html'));
}

exports.forgotPasswordVerification = async (req, res, next) => {
    const { email } =  req.body;
    console.log('forgotid>>', email);
    try {

        const user = await User.findOne({ email });

        if (user) {
            return res.status(200).json({ success: true });
        } else {
            res.status(401).json({ error: "User is unauthorized" });
        }
    } catch (err) {
        console.log(err);
        res.status(500);
    }
};

exports.resetPasswordForm = async (req, res, next) => {
    const _id = req.params._id;
    try {
        const response = await ForgotPasswordModel.findOne({ _id: _id });

        if (response) {
            const updationOfactive = await ForgotPasswordModel.updateOne({ _id: _id }, { active: false });

            if (updationOfactive) {
                return res.status(200).send(`
          <html>
            <script>
              console.log("Passing the form to updatePassword");
            </script>

            <form action="/password/updatepassword/${_id}" method="post" enctype="application/x-www-form-urlencoded">

            <label for="newpassword">Enter New password</label>
            <input name="newpassword" type="password" required></input>
            <button type="submit">Reset Password</button>
          </form>

          </html>`);
            }
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Error in resetPasswordForm" });
    }
};

// Calling the SMTP to send mail to the user for password reset link
exports.resettingPassword = async (req, res, next) => {
    const emailOfUser = req.body.email;

    try {
        const uid = uuid.v4();

        const responseOfForgotPasswordModel = await ForgotPasswordModel.create({ _id: uid, active: true });

        if (responseOfForgotPasswordModel) {
            const user = await User.findOne({ email: emailOfUser });

            if (user) {
                await ForgotPasswordModel.updateOne({ _id: uid }, { userId: user._id });
            }
        }

        var transporter = nodemailer.createTransport({
            host: SMTP_HOST,
            port: SMTP_PORT,
            secure: false,
            requireTLS: true,
            auth: {
                user: process.env.NODEMAILER_USER_EMAIL,
                pass: process.env.NODEMAILER_USER_PASSWORD
            }
        });

        var mailOptions = {
            from: process.env.NODEMAILER_USER_EMAIL,
            to: emailOfUser,
            subject: "Password Reset Link of Expense Tracker",
            text: `Your OTP for ${emailOfUser}:`,
            html: `<a href="http://localhost:4000/password/resetpasswordform/${uid}">Reset password</a>`
        };

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.log('Error sending email:', err);
                return res.status(500).json({ success: false, message: 'Error sending email' });
            } else {
                console.log("Mail Sent Successfully.");
                return res.status(200).json({ success: true, message: 'Password reset link sent successfully' });
            }
        });
    } catch (err) {
        console.log(err);
    }
};

exports.updatePassword = async (req, res, next) => {
    const newpassword = req.body.newpassword;
    const id = req.params.id;

    try {
        const responseOfUpdatePassword = await ForgotPasswordModel.findOne({ _id: id });

        if (responseOfUpdatePassword) {
            const user = await User.findOne({ _id: responseOfUpdatePassword.userId });

            if (user) {
                const saltRounds = 10;
                const hash = await bcrypt.hash(newpassword, saltRounds);
                const updatingPassword = await User.updateOne({ _id: responseOfUpdatePassword.userId }, { password: hash });

                if (updatingPassword) {
                    return res.status(201).json({ message: 'Successfully updated the new password' });
                }
            } else {
                console.log('User not found');
                res.status(404).json({ error: 'User not found' });
            }
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Error updating password' });
    }
};
