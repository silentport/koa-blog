// 获取文件名后缀
const getUploadFileExt = (name) => {
    let ext = name.split('.');
    return ext[ext.length - 1];
}

// mongoose数据库操作promisify
const promisifyModel = (MODEL_LIST) => {
  Object.keys(MODEL_LIST).forEach(item => {
    const model = MODEL_LIST[item];
    const find = model.find.bind(model);
    const update = model.update.bind(model);
    const remove = model.remove.bind(model);
    const countDocuments = model.countDocuments.bind(model); 
    model.find = (args, option) => {
      if (option && option.limit) {
        let query = find(args);
        return new Promise((resolve, reject) => {
          query.skip(option.skip).limit(option.limit).sort({
            _id: -1
          }).exec((err, docs) => {
            if (!err) {
              resolve(docs)
            } else {
              reject(err)
            }
          });
        })
      }
      return new Promise((resolve, reject) => {
        find(args, (err, docs) => {
          if (!err) {
            resolve(docs)
          } else {
            reject('查找失败')
          }
        })
      })
    }

    model.countDocuments = (args) => {
      return new Promise((resolve, reject) => {
        countDocuments(args, (err, count) => {
          if (!err) {
            resolve(count);
          } else {
            reject('获取总数失败')
          }
        })
      })
    }

    model.remove = (args) => {

      return new Promise((resolve, reject) => {
        remove(args, (err) => {
          if (!err) {
            resolve('删除成功')
          } else {
            reject('删除失败')
          }
        })
      })
    }

    model.update = (query, replace) => {
      return new Promise((resolve, reject) => {
        update(query, replace, (err, res) => {
          if (!err) {
            resolve(res && res.ok > 0 && "更新成功")
          } else {
            reject(err)
          }
        })
      })
    }
  })
}

// 创建schema并Promisify
const schemaPromisify = (mongoose, schemaData) => {

  const schema = mongoose.Schema(schemaData);
  schema.methods.mySave = function () {

    return new Promise((resolve, reject) => {
      this.save(err => {
        if (!err) {
          resolve('该类别已存入数据库')
        } else {
          reject(err)
        }
      })
    })
  }

  return schema;

}

module.exports = {
    getUploadFileExt,
    promisifyModel,
    schemaPromisify,
}