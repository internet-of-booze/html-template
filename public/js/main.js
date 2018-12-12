

var heatr = {};

heatr.db = {};
heatr.instance = {
	user : {
		'name' : false
	}
};

heatr.config = {
	app : {
		apiKey: "AIzaSyBCRZqXvgO-AIj76YFtdCsiibHnGLxMad4",
	     authDomain: "internet-of-booze-xmas.firebaseapp.com",
	     databaseURL: "https://internet-of-booze-xmas.firebaseio.com",
	     projectId: "internet-of-booze-xmas",
	     storageBucket: "internet-of-booze-xmas.appspot.com",
	     messagingSenderId: "766249372237"
	}
	, db : {
	  timestampsInSnapshots: true
	}
};

heatr.define = function() {
	var user = JSON.parse(localStorage.getItem('user'));
	if(user) {
		heatr.instance.user = user;
	}
}
heatr.start = function() {
	firebase.initializeApp(this.config.app);
	this.define();
	this.setup();
}

heatr.init = function() {
	this.start();

	this.register.on();
	this.register.listeners();

	// Lets configure the unique names and make sure we register them into our system //
	this.unique_name();

	this.template.init();
}

heatr.setup = function() {
	this.db = firebase.firestore();

	// Disable deprecated features
	this.db.settings(this.config.db);

}

heatr.register = {
	on : function() {
		$('#heatr').on('click', heatr.handle.clicked);
	}
	, listeners : function() {
		document.getElementById('about').addEventListener('click', function () {
		  document.getElementById('front').classList.add('hide');
		  document.getElementById('back').classList.remove('hide');
		});

		document.getElementById('x').addEventListener('click', function () {
		  document.getElementById('back').classList.add('hide');
		  document.getElementById('front').classList.remove('hide');
		});

	}
}

heatr.template = {
	init : function() {
		// set up our interface dynamics //
		var userbanner = $('.user');

		if(userbanner) {
			heatr.template.userbanner();
		}
	}
	, userbanner : function() {
		heatr.define();
		var target = $('.user');
		user = heatr.instance.user;

		target.html(
			'<span class="greeting">Hello</span><span class="info">' + user.name + '#' + user.id + '</span>'
		);
	}
}

heatr.handle = {
	clicked : function() {
		heatr.define();
		console.log('clicked', heatr.db, $(this));
		var db = heatr.db
		, date = new Date()
		, now = date.getTime()
		, user = heatr.instance.user;

		db.collection("queue").add({
			connect_id: 1,
		     timestamp: now,
			username: user.name,
			user_uid: user.uid,
		     fireball: false
		})
		.then(function(docRef) {
		    console.log("Document written with ID: ", docRef.id);
		})
		.catch(function(error) {
		    console.error("Error adding document: ", error);
		});
	}
	, added : {
		user : function(result) {
			console.log('User added', result);

			localStorage.setItem('user', JSON.stringify(user));

			return true;
		}
	}
};

heatr.g = {
	id : function() {
		return '_' + Math.random().toString(36).substr(2, 9);
	}
};

heatr.unique_name = function() {
	// call out to the db and see if any apps have been registered with the name if so then change it //
	if(!localStorage.getItem('user')) {
		heatr.db.collection("users").get()
		.then(function(users) {
			console.log('Users', users);
			var id = Math.floor(Math.random() * usernames.length)
			, username = usernames[id];

			// no user so lets create our first one //
			user = {
				'name' : username
				, 'id' : id
				, 'uid' : heatr.g.id()
			};

			heatr.db.collection("users").add(user)
			.then(heatr.handle.added.user)
			.then(heatr.template.userbanner);


		});
	}else {
		// we already have the user data, not sure we need to do anything else //

	}
}
