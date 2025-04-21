const mongoose = require('mongoose');
const slugify = require('slugify');

// 1- Create Schema
const markSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'mark required'],
      unique: [true, 'mark must be unique'],
      minlength: [2, 'Too short mark name'],
      maxlength: [32, 'Too long mark name'],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  { timestamps: true }
);


const setImageURL = (doc) => {
  if (doc.image) {
    const modelFolder = doc.constructor.modelName.toLowerCase() + 's';
    doc.image = `${process.env.BASE_URL}/${modelFolder}/${doc.image}`;
  }
};
// findOne, findAll and update
markSchema.post('init', (doc) => {
  setImageURL(doc);
});

// create
markSchema.post('save', (doc) => {
  setImageURL(doc);
});

markSchema.pre('save', function (next) {
  if (this.name) {
    this.slug = slugify(this.name, { lower: true });
  }
  next();
});
// 2- Create model
module.exports = mongoose.model('Mark', markSchema);
