const User = require("../models/User");
const bcrypt = require("bcrypt");

exports.createUser = async (req, res) => {
  try {
    // gelen isteğin body'sindeki bilgileri al
    const user = await User.create(req.body);
    res.status(201).json({
      status: "success",
      user,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.loginUser = async (req, res) => {
  // gelen isteğin body'sindeki email ve password bilgilerini al
  const body = req.body;
  // böyle bir email'e sahip kullanıcı var mı?
  const user = await User.findOne({ email: body.email });
  if (user) {
    // şifre doğru mu?
    const valid = await bcrypt.compare(body.password, user.password);
    // şifre doğruysa giriş yap
    if (valid) {
      req.session.userID = user._id;
      res.status(200).redirect("/");
    } else {
      // şifre yanlışsa hata döndür
      res.status(400).json({
        status: "fail",
        message: "Şifre yanlış",
      });
    }
  } else {
    // böyle bir email'e sahip kullanıcı yoksa hata döndür
    res.status(400).json({
      status: "fail",
      message: "Böyle bir kullanıcı yok",
    });
  }
};

exports.logoutUser = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};
