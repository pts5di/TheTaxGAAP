const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt')

const UserSchema = new Schema ({

    username: String,
    password: String,
    email: String

})


UserSchema.pre('save', function(next) {
    // Mongoose makes the User schema available vis 'this'
    const user = this

    bcrypt.hash(user.password, 5, (error, hash) => {
        user.password = hash
        next()
    })
})

const User = mongoose.model('User', UserSchema);
module.exports = User