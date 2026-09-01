const mongoose=require('mongoose')

const blacklistTokenSchema=new mongoose.Schema({
    token: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

const blacklist = mongoose.model('blacklistModel', blacklistTokenSchema)

module.exports = blacklist