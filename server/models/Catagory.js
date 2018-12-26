const {schemaPromisify} = require('../utils');
module.exports = function (mongoose) {
    const schema = schemaPromisify(mongoose, {
        name: {
            type: String,
            required: true, 
            unique: true 
        },
        date: {
            type: Number, 
            required: true, 
            unique: true
        },
        count: {
            type: Number, 
            required: true, 
            unique: true
        }
    })

    const Catagory = mongoose.model('Catagory', schema);

    return Catagory;
}
