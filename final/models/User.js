const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = new mongoose.Schema(
  {
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true 
    },
    password: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
        minLength: [3, 'First Name too short'],
        maxLength: [50, 'First Name too long']
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        minLength: [3, 'Last Name too short'],
        maxLength: [50, 'Last Name too long']
    },
  },
  { timestamps: true }
);

userSchema.set('toJSON', {
  transform: (document,returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.password //do not reveal password
    delete returnedObject.createdAt
    delete returnedObject.updatedAt
  }
})
userSchema.plugin(uniqueValidator)
module.exports = mongoose.model('User', userSchema)