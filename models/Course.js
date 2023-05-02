const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slugify = require("slugify");

const CourseSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: { type: Date, default: Date.now },
  slug: {
    type: String,
    unique: true,
  },
  category: {
    // burada category modeline referans veriyoruz
    type: mongoose.Schema.Types.ObjectId,
    // burada da referans verdiğimiz modeli belirtiyoruz
    ref: "Category",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

// strict gereksiz boşlukları ve karakterleri siler
CourseSchema.pre("validate", function (next) {
  this.slug = slugify(this.name, { lower: true, strict: true });
  next();
});

const Course = mongoose.model("Course", CourseSchema);

module.exports = Course;
