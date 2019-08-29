const fs = require('fs')

module.exports = (filePath, content) => {
  fs.writeFileSync(filePath, JSON.stringify(content, null, 2))
}
