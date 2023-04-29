const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const pageRoute = require("./routes/pageRoute");
const courseRoute = require("./routes/courseRoute");
const categoryRoute = require("./routes/categoryRoute");
const userRoute = require("./routes/userRoute");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const app = express();
// Template Engine
app.set("view engine", "ejs");

// Global Variable
global.userIN = null;

// connect DB
mongoose
  .connect("mongodb://localhost/smartedu-db", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connected");
  });

// Middleware
app.use(express.static("public"));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
// burada session ile kullanıcı bilgilerini tutuyoruz
app.use(
  session({
    secret: "my_keyboard_cat",
    resave: false,
    saveUninitialized: true,
    // MongoStore ile session'ları veritabanında tutuyoruz. Böylece sunucu her yeniden başladığında session'lar silinmiyor.
    store: MongoStore.create({ mongoUrl: "mongodb://localhost/smartedu-db" }),
  })
);

// Routes
// burada kullanıcı giriş yapmış mı diye kontrol ediyoruz
app.use("*", (req, res, next) => {
  userIN = req.session.userID;
  next();
});
app.use("/", pageRoute);
app.use("/courses", courseRoute);
app.use("/categories", categoryRoute);
app.use("/users", userRoute);

const port = 3000;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
