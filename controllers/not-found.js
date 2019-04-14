const {cookieHelper} = require("../common/cookie-helper");

exports.get404 =
(req, res, next) => {
  //const notFoundFilePath = path.resolve(__dirname, "./views/404.html")
  //res.status(404).sendFile(notFoundFilePath)
  res.status(404).render("404", {
    title: "Page not found" , path : "",
    isAuthenticated: req.session.isAuthenticated
  })
};