exports.get500 =
(req, res, next) => {
  res.status(500).render("500", {
    title: "Some error occured" , path : "500",
    isAuthenticated: req.session.isAuthenticated
  })
};