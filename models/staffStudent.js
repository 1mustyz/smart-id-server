const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const StaffStudentSchema = new Schema({
    username: { type: String, required: true, unique: [ true, 'username already exist' ] },
    firstName: { type: String, required: true},
    lastName: { type: String, required: true},
    otherName: { type: String},
    department: { type: String},
    state: { type: String},
    faculty: { type: String},
    level: { type: String},
    email: { type: String, required: true, unique: [ true, 'Email already exist' ] },
    gender: { type: String},
    phone: { type: String, required: true},
    address: { type: String},
    dob: { type: String},
    image: { type: String, default: '1.jpg' },
    role: { type: String, required: true},
    active: { type: Boolean, default: true}
}, { timestamps: true });

//plugin passport-local-mongoose to enable password hashing and salting and other things
StaffStudentSchema.plugin(passportLocalMongoose);

//connect the schema with user table
const StaffStudent = mongoose.model('staffStudent', StaffStudentSchema);

//export the model 
module.exports = StaffStudent;