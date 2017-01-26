module.exports = function(req, res, next) {
  if (!req.user) {
    // console.log('isloggin2');
    req.flash('error', 'You must be logged in to access that page');
    res.redirect('/careseeker/login');
  } else {
    // console.log('isloggifire');
    next();
  }
};
