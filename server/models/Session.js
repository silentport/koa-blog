const {schemaPromisify} = require('../utils');
module.exports = function (mongoose) {
    const schema = schemaPromisify(mongoose, {
        session: {
            type: String, 
            required: true, 
            unique: true, 
            expires: '15d'
        }
    })

    const Session = mongoose.model('Session', schema);

    return Session;
}
