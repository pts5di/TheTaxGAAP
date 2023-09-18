const User = require('../models/User')

module.exports = async (req, res) => {
    let email = req.query.email;
    let secret = req.query.secret;
    const user = User.findOne({ where: { email, } });
    const errors = [];

    if (!user) {
        errors.push("No user found");
    }
    else if (!email) {
        errors.push("No email provided");
    }
    else if (user.unsubscribeSecret == secret) {
        user.unsubscribedFromMonthly = true;
        await user.save();
    } else {
        errors.push("Incorrect secret provided");
    }
    res.render('unsubscribe', {
        errors
    })
}
