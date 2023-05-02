// Eğer kullanıcı giriş yapmışsa ana sayfaya yönlendir
module.exports = (req, res, next) => {
  if (req.session.userID) {
    return res.redirect("/");
  }
  next();
};
