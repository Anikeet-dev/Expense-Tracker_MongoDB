require("dotenv").config();
const express = require("express");
const userRoutes = require("./routes/user");
const expenseRoutes = require("./routes/expenseRoutes");
const purchaseRoute = require("./routes/purchase");
const premiumFeatureRoute = require("./routes/premiumFeature");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.static("views"));
app.use(express.json());

app.use(userRoutes);
app.use(expenseRoutes);
app.use(purchaseRoute);
app.use(premiumFeatureRoute);

const port = process.env.PORT;

app.listen(port, (err) => {
  if (err) {
      console.error('Error starting the server:', err);
  } else {
      console.log('Server Initialized...');
  }
});