// config/passport.js

// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;

var users = [
    { id: 1, username: 'coolpad', password: '9527', email: 'abcd@yulong.com' }
  , { id: 2, username: 'treant', password: 'birthday', email: 'treant1128@gmail.com' }
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
    if(user.email === username){		
								console.log('Find User:' + JSON.stringify(user));
      return fn(null, user);
    }
  }
  return fn(null, null);
}
 
// expose this function to our app using module.exports
module.exports = function(passport) {

	// =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session

    // used to deserialize the user
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
		findById(id, function (err, user) {
			done(err, user);
		});
	});

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'
	passport.use('local', new LocalStrategy(
		{
// 			by default, local strategy uses username and password, we will override with email
			usernameField : 'userEmail',
			passwordField : 'passWord',
//        	passReqToCallback : true // allows us to pass back the entire request to the callback
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
};
