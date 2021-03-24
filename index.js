

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

// connect to db
// mongoose.connect(
// process.env.DB,
// {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// },
// () => console.log("connected to db")
// );


// import routes
const verifyToken = require("./routes/verifyjwt");
const loginRoutes = require("./routes/login");
const userRoutes = require("./routes/users");
const patientRoutes = require("./routes/patients")
const labResultsRoutes = require("./routes/labResults")
const appointmentRoutes = require("./routes/appointments")
const treatmentRoutes = require("./routes/treatments")

// route middlewares
app.use(express.json()); // for body parser
app.use("/api/login", loginRoutes);
app.use("/api/users",verifyToken, userRoutes);
app.use("/api/patients",verifyToken, patientRoutes);
app.use("/api/labResults",verifyToken, labResultsRoutes);
app.use("/api/appointments", verifyToken, appointmentRoutes);
app.use("/api/treatments/", verifyToken, treatmentRoutes);

app.listen(3000, () => console.log("server is running..."));

module.exports = app