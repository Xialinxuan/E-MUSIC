const operation = require('./operation')

module.exports = {
    "insert": operation.insert,
    "selectForBuild": operation.selectForBuild,
    "clean": operation.clean,
    "selectForRecommend": operation.selectForRecommend
}