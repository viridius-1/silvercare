module.exports = function(req, res, next) {
  if (!req.user) {
    // console.log('isloggin');
    req.flash('error', 'You must be logged in to access that page');
    res.redirect('/caregiver/login');
  } else {
    next();
  }
};
