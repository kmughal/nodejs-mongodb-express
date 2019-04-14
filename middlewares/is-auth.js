exports.isAuth = (req,res,next) => {
  console.log("middleware :",req.session.isAuthenticated)
  if (req.session.isAuthenticated) {
      //req.user = req.session.user;
      next();
      console.log("ndext")
      return;
    }
  console.log('redirecting ok',req.session.isAuthenticated)
  res.redirect("/auth/signin");
}