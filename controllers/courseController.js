const Course = require("../models/Course");
const Category = require("../models/Category");

exports.createCourse = async (req, res) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json({
      status: "success",
      course,
    });
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
    // burada findOne ile istek atılan kategoriyi buluyoruz
    const category = await Category.findOne({ slug: categorySlug });
    // burada ise filtreleme yapıyoruz. let ile değişken oluşturarak ileride arama yapmak için de kullanabiliriz.
    let filter = {};
    // eğer categorySlug varsa filtreleme yapılacak yoksa tüm kurslar gelecek
    if (categorySlug) {
      // category._id ile ilgili kategoriye ait kursları buluyoruz
      filter = { category: category._id };
    }
    // find ile filtreleme yapıyoruz
    const courses = await Course.find(filter);
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
    const course = await Course.findOne({ slug: req.params.slug });
    res.status(200).render("course", {
      course,
      page_name: "courses",
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
