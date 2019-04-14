const bcryptjs = require("bcryptjs");

exports.passwordHelpers = ({
  encrypt(password) {
    // 12 is considered to v.secure value
    // higher the value longer time is needed to decrypt!
    return bcryptjs.hash(password,12);
  },
  decrypt(password) {
    
  }
})