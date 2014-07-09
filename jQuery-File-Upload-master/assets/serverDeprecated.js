var express = require('express');
var passport = require('passport');
var flash = require('connect-flash');
var LocalStrategy = require('passport-local').Strategy;

var users = [
    { id: 1, username: 'bob', password: 'secret', email: 'bob@example.com' }
  , { id: 2, username: 'joe', password: 'birthday', email: 'joe@example.com' }
];

function findById(id, fn) {
  var idx = id - 1;
  if (users[idx]) {
    fn(null, users[idx]);
  } else {
    fn(new Error('User ' + id + ' does not exist'));
  }
}

function findByUsername(username, fn) {
  for (var i = 0, len = users.length; i < len; i++) {
    var user = users[i];
//    if (user.username === username) {         //�Ұ�username�ȵ���email
								
    if(user.email === username){		
								console.log('Find User:' + JSON.stringify(user));
      return fn(null, user);
    }
  }
  return fn(null, null);
}

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  findById(id, function (err, user) {
    done(err, user);
  });
});


//////////////////
// Use the LocalStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a username and password), and invoke a callback
//   with a user object.  In the real world, this would query a database;
//   however, in this example we are using a baked-in set of users.
passport.use(new LocalStrategy(
	{
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'userEmail',
        passwordField : 'passWord',
//        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
  function(username, password, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      console.log('UserName: ' + username.constructor + ', PassWord: ' + password);
      // Find the user by username.  If there is no user with the given
      // username, or the password is not correct, set the user to `false` to
      // indicate failure and set a flash message.  Otherwise, return the
      // authenticated `user`.
      findByUsername(username, function(err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
        if (user.password != password) { return done(null, false, { message: 'Invalid password' }); }
        return done(null, user);
      })
    });
  }
));


var app = express();

// configure Express
app.configure(function() {
//  app.set('views', __dirname + '/views');           			//not mine
//  app.set('view engine', 'ejs');								//not mine
//  app.engine('ejs', require('ejs-locals'));         			//not my
//  app.use(express.logger());    								//��ʱ��Ҫ��¼log
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.session({ secret: 'zui_mei_zhong_guo' }));
  app.use(flash());
  // Initialize Passport!  Also use passport.session() middleware, to support
  // persistent login sessions (recommended).
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
//  app.use(express.static(__dirname + '/../../public'));         	//not my	
});

///////////////////
app.use('/', express.static(__dirname + '/assets'));
app.set('views', __dirname);
app.engine('html', require('ejs').renderFile);


app.get('/', function(req, res){
	console.log('User: ' + req.user);
	res.render('./index.html', {user : req.user});
});

app.get('/upload', ensureAuthenticated, function(req, res){
	res.render('./angularjs.html', {user : req.user});
});

// POST /login
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
//
//   curl -v -d "username=bob&password=secret" http://127.0.0.1:3000/login
app.post('/login', 
	passport.authenticate('local', 
	  {	
		successRedirect: '/upload',
		failureRedirect: '/',
 		failureFlash: true 
	  }),
  	function(req, res) {
    		res.redirect('/');
  	}
  );

// POST /login
//   This is an alternative implementation that uses a custom callback to
//   acheive the same functionality.
/*
app.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err) }
    if (!user) {
      req.flash('error', info.message);
      return res.redirect('/login')
    }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.redirect('/users/' + user.username);
    });
  })(req, res, next);
});
*/

app.get('/logout', function(req, res){
  	req.logout();
  	res.redirect('/');
});


var PORT = 9527;
app.listen(PORT, function(){
	console.log('Server Listening Port ' + PORT + '...');
	//console.log('Path -> __dirname: ' + __dirname);
});

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/')
}