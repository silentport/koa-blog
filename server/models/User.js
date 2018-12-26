const {schemaPromisify} = require('../utils');
module.exports = function (mongoose) {
    const schema = schemaPromisify(mongoose, {
        username: {
            type: String, 
            required: true,
            unique: true
        },
        password: {
            type: String
        },
        admin: {
            type: Boolean,
        },
        avator: {
            type: String
        }
    })

    const User = mongoose.model('User', schema);

    return User;
}
