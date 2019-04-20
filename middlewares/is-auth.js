exports.isAuth = (req,res,next) => {
  console.log("middleware :",req.session.isAuthenticated)
  if (req.session.isAuthenticated) {
      //req.user = req.session.user;
      next();
     
      return;
    }
 
  res.redirect("/auth/signin");
}