const fs = require('fs');
const path = require('path');
const koaBody = require('koa-body');
const host = require('../config').host;
const {getUploadFileExt} = require('../utils')
const uploadDir = path.resolve(__dirname, '../') + '/public/upload/';

module.exports = filUpload = (app) => {
    return koaBody({
        multipart: true, // 支持文件上传
        encoding: 'gzip',
        formidable: {
            formLimit: "10mb",
            jsonLimit: "10mb",
            textLimit: "10mb",
            uploadDir: uploadDir, // 设置文件上传目录
            keepExtensions: true, // 保持文件的后缀
            maxFieldsSize: 2 * 1024 * 1024, // 文件上传大小
            onFileBegin: (name, file) => { // 文件上传前的设置
                const ext = getUploadFileExt(file.name);
                const dir = `${uploadDir}/${name}`;
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir)
                }
                const fileName = new Date().getTime()
                file.path = `${dir}/${fileName}.${ext}`
                app.context.uploadpath = app.context.uploadpath
                    ? app.context.uploadpath
                    : {};
                app.context.uploadpath[name] = `${host}/upload/${name}/${fileName}.${ext}`;
            }
        }
    })
}
