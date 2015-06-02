/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');
var auth = require('./auth/auth.service');
var jwt = require('jsonwebtoken');  

module.exports = function(app) {

  // Insert routes below
  app.use('/api/things', require('./api/thing'));
  app.use('/api/users', require('./api/user'));

  app.use('/auth', require('./auth'));
  
  app.use('/main', function(req, res, next){
    console.log(auth.isAuthenticated());
    if (auth.isAuthenticated() !== true){
      console.log("not authed")
      res.redirect('http://localhost:9000/login')
    }
    else {
      next();
    }
  });

  // app.use('/main', auth.isAuthenticated(), function(req, res, next){
  //     res.sendfile(app.get('appPath') + '/index.html');
  // });

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      res.sendfile(app.get('appPath') + '/index.html');
    });
};
