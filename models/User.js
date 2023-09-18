const crypto = require('node:crypto')
const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt')


/* 
*   This uniqueValidator is used to deal with the situation where 
*   the username is not unique.  This won't get picked up by our
*   regular error handler because it is a validation error. 
*/

var uniqueValidator = require('mongoose-unique-validator');
const { intersect } = require('mathjs');

const UserSchema = new Schema({

    username: {
        type: String,
        required: [true, 'Please provide a username.'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Please provide a password.']
    },
    email: {
        type: String,
        required: [true, 'Please provide an email.']
    },
    asked: {
        type: Number,
        default: 0
    },
    answered: {
        type: Number,
        default: 0
    },
    askedscore: {
        type: Number,
        default: 0
    },
    answerscore: {
        type: Number,
        default: 0
    },
    rank: {
        type: Number,
        default: 0
    },
    unsubscribedFromMonthly: {
        type: Boolean,
        default: false
    },
    unsubscribeSecret: {
        type: String,
        default: () => crypto.randomBytes(64).toString('base64url')
    }
})

UserSchema.plugin(uniqueValidator);

UserSchema.pre('save', function (next) {
    // Mongoose makes the User schema available vis 'this'
    const user = this

    bcrypt.hash(user.password, 5, (error, hash) => {
        user.password = hash
        next()
    })
})

const User = mongoose.model('User', UserSchema);
module.exports = User