const mongoose = require('mongoose');
const util_1 = require('util');
//SCHEMA FOR USER COLLECTION;
const validator = {
    userName: {
        validator: function (v) {
            return !util_1.isNullOrUndefined(v) && v !== '';
        }, message: 'userName should not be null or empty'
    },
    firstName: {
        validator: function (v) {
            return !util_1.isNullOrUndefined(v) && v !== '';
        }, message: 'firstName should not be null or empty'
    },
    lastName: {
        validator: function (v) {
            return !util_1.isNullOrUndefined(v) && v !== '';
        }, message: 'lastName should not be null or empty'
    },
    email: {
        validator: function (v) {
            return !util_1.isNullOrUndefined(v) && v !== '';
        }, message: 'email should not be null or empty'
    },
    password: {
        validator: function (v) {
            return !util_1.isNullOrUndefined(v) && v !== '';
        }, message: 'password should not be null or empty'
    },
    mobileNo: {
        validator: function (v) {
            return !util_1.isNullOrUndefined(v) && v !== '';
        }, message: 'mobileNo should not be null or empty'
    },
    address: {
        validator: function (v) {
            return !util_1.isNullOrUndefined(v) && v !== '';
        }, message: 'address should not be null or empty'
    }
}

const UserModel = new mongoose.Schema(
    {
        userName : {type: String, default: null , validate:validator.userName}, 
        firstName:{type: String, default: null , validate:validator.firstName}, 
        lastName:{type: String, default: null, validate:validator.lastName }, 
        email:{type: String, default: null,validate:validator.email }, 
        password:{type: String, default: null,validate:validator.password }, 
        mobileNo:{type: String, default: null,validate:validator.mobileNo }, 
        address:{type: String, default: null,validate:validator.address },
        role : {type: String, default: 'Student' },
    },{
        timestamps: true
      }
)

module.exports = mongoose.model('User', UserModel);