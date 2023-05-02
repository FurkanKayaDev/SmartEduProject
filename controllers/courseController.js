const Course = require("../models/Course");
const Category = require("../models/Category");
const User = require("../models/User");

exports.createCourse = async (req, res) => {
  try {
    const course = await Course.create({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      user: req.session.userID,
    });
    res.status(201).redirect("/courses");
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.getAllCourses = async (req, res) => {
  try {
    const categorySlug = req.query.category;
    const query = req.query.search;
    // burada findOne ile istek atılan kategoriyi buluyoruz
    const category = await Category.findOne({ slug: categorySlug });
    // burada ise filtreleme yapıyoruz. let ile değişken oluşturarak ileride arama yapmak için de kullanabiliriz.
    let filter = {};
    // eğer categorySlug varsa filtreleme yapılacak yoksa tüm kurslar gelecek
    if (categorySlug) {
      // category._id ile ilgili kategoriye ait kursları buluyoruz
      filter = { category: category._id };
    }

    if (query) {
      filter = { name: query };
    }

    if (!query && !categorySlug) {
      filter.name = "";
      filter.category = null;
    }
    // find ile filtreleme yapıyoruz
    const courses = await Course.find({
      $or: [
        { name: new RegExp(filter.name, "i") },
        { category: filter.category },
      ],
    })
      .sort("-createdAt")
      .populate("user");
    const categories = await Category.find();
    res.status(200).render("courses", {
      courses,
      categories,
      page_name: "courses",
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.getCourse = async (req, res) => {
  try {
    const user = await User.findById({ _id: req.session.userID });
    const categories = await Category.find();
    const course = await Course.findOne({ slug: req.params.slug }).populate(
      "user"
    );
    res.status(200).render("course", {
      course,
      page_name: "courses",
      user,
      categories,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

// Kurs ekleme işlemi
exports.enrollCourse = async (req, res) => {
  try {
    // Önce kullanıcıyı buluyoruz
    const user = await User.findById(req.session.userID);
    // Kullanıcının kurslar kısmına is'si gönderilen kursu ekliyoruz
    // push yerine addToSet kullanmamızın sebebi aynı kursu birden fazla kez eklemesini engellemek
    await user.courses.addToSet({ _id: req.body.course_id });
    // Kullanıcıyı kaydediyoruz
    await user.save();
    // Dashboard'a yönlendiriyoruz
    res.status(200).redirect("/users/dashboard");
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error,
    });
  }
};

exports.releaseCourse = async (req, res) => {
  try {
    // Önce kullanıcıyı buluyoruz
    const user = await User.findById(req.session.userID);
    // Kullanıcının kurslar kısmına is'si gönderilen kursu çıkartıyoruz
    await user.courses.pull({ _id: req.body.course_id });
    // Kullanıcıyı kaydediyoruz
    await user.save();
    // Dashboard'a yönlendiriyoruz
    res.status(200).redirect("/users/dashboard");
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error,
    });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    await Course.findOneAndDelete({ slug: req.params.slug });
    res.status(200).redirect("/users/dashboard");
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error,
    });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    await Course.findOneAndUpdate(
      {
        slug: req.params.slug,
      },
      req.body
    );

    res.status(200).redirect("/users/dashboard");
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error,
    });
  }
};
