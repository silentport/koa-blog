const {promisifyModel} = require('../utils');
module.exports = function (instance) {
    const MODEL_LIST = {
        User: require('./User')(instance),
        Session: require('./Session')(instance),
        Catagory: require('./Catagory')(instance),
        Article: require('./Article')(instance)
    }
    
    promisifyModel(MODEL_LIST);

    return MODEL_LIST;
}
