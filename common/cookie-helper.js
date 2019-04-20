const cookieHelper = ({
  isAuthenticated(req) {
    try {
      return JSON.parse(String(req.get("COOKIE")).split('=')[1]);
    }catch(e) {
      console.log("Fail cookieHelper:cookieHelper" ,e);
      return false;
    }
  }
});

exports.cookieHelper = cookieHelper;