const express = require("express");
const pageController = require("../controllers/pageController");
const redirectMiddleware = require("../middlewares/redirectMiddleware");
const router = express.Router();

router.route("/").get(pageController.getIndexPage);
router.route("/about").get(pageController.getAboutPage);
// Önce kullanıcı giriş yapmış mı diye kontrol ediyoruz. Eğer giriş yapmışsa anasayfaya yönlendiriyoruz. Eğer giriş yapmamışsa register sayfasına yönlendiriyoruz.
router
  .route("/register")
  .get(redirectMiddleware, pageController.getRegisterPage);
// Önce kullanıcı giriş yapmış mı diye kontrol ediyoruz. Eğer giriş yapmışsa anasayfaya yönlendiriyoruz. Eğer giriş yapmamışsa login sayfasına yönlendiriyoruz.
router.route("/login").get(redirectMiddleware, pageController.getLoginPage);
router.route("/contact").get(pageController.getContactPage);
router.route("/contact").post(pageController.sendEmail);

module.exports = router;
