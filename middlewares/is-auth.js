exports.isAuth = (req,res,next) => {
  if (req.session.isAuthenticated) {
      //req.user = req.session.user;
      next();
     
      return;
    }
 
  res.redirect("/auth/signin");
}