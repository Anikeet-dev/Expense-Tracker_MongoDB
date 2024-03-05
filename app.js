require("dotenv").config();
const express = require("express");
const userRoutes = require("./routes/user");
const expenseRoutes = require("./routes/expenseRoutes");
// const sequelize = require("./util/database");
const User = require("./models/user");
const Expense = require("./models/expense");
const path = require("path");
const Order = require("./models/orders");
const purchaseRoute = require("./routes/purchase");
const premiumFeatureRoute = require("./routes/premiumFeature");
const PasswordRequest = require("./models/forgotpassword");
const morgan = require("morgan");
const fs = require("fs");
const mongoose = require("mongoose");
const db = require('./util/database'); 

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.static("views"));
app.use(express.json());

// const accessLogStream = fs.createWriteStream(
//   path.join(__dirname, "access.log"),
//   { flags: "a" }
// );
// app.use(morgan("combined", { stream: accessLogStream }));

app.use(userRoutes);
app.use(expenseRoutes);
app.use(purchaseRoute);
app.use(premiumFeatureRoute);

// User.hasMany(Expense);
// Expense.belongsTo(User);

// User.hasMany(Order);
// Order.belongsTo(User);

// User.hasMany(PasswordRequest);
// PasswordRequest.belongsTo(User);


const ExpenseSchema = new mongoose.Schema({

  user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
  }
});

const port = process.env.PORT;

app.listen(port, (err) => {
  if (err) {
      console.error('Error starting the server:', err);
  } else {
      console.log('Server Initialized...');
  }
});