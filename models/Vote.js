const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const VoteSchema = new Schema({
    userId: mongoose.Schema.Types.ObjectId,
    itemId: mongoose.Schema.Types.ObjectId,
    itemType: {
        type: String,
        enum: ["Question", "Answer"],
        trim: true
    },
    voteValue: Number
});
const Vote = mongoose.model('Vote', VoteSchema);

module.exports = Vote

