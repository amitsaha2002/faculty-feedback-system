const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const facultySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide name'],
      trim: true,
    },
    // username: {
    //   type: String,
    //   required: [true, 'Please provide username'],
    //   unique: true,
    //   trim: true,
    // },
    email: {
      type: String,
      required: [true, 'Please provide email'],
      unique: true,
      validate: {
        validator: validator.isEmail,
        message: 'Please provide valid email',
      },
    },
    department: {
      type: String,
      required: [true, 'Please provide department'],
      trim: true,
    },
    phoneno: {
      type: String,
      required: [true, 'Please provide phone number'],
      validate: {
        validator: function (v) {
          return /\d{10}/.test(v);
        },
        message: (props) => `${props.value} is not a valid phone number!`,
      },
    },
    // password: {
    //   type: String,
    //   required: [true, 'Please provide password'],
    //   minlength: 6,
    // }
  },
  { timestamps: true }
);

// Hash password before saving
facultySchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
facultySchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Faculty', facultySchema);
