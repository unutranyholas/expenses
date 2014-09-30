/*Meteor.publish('records', function(options) {

	if (Meteor.user()) {
		return Records.find();
	} else {
		return [];
	}

});*/

if (Records.find().count() === 0) {

	var types = ['daily', 'monthly', 'extra']; 

	function makeid(size) {
		var text = "";
		var possible = "abcdefghijklmnopqrstuvwxyz0123456789";

		for( var i=0; i < size; i++ )
			text += possible.charAt(Math.floor(Math.random() * possible.length));

		return text;
	}

	var getTime = new Date().getTime();
	for (i = 0; i < 500; i++){ 

	/*Records.insert({
			'type': types[Math.floor((Math.random() * 3))],
			'sum': Math.floor((Math.random() * 950) + 50),
			'what': makeid(Math.floor((Math.random() * 5)  + 5)),
			'date': new Date().getTime() - Math.floor((Math.random() * 10000000000) + 1),
			'user': this.userId
		});*/
	Records.insert({
			'type': types[Math.floor((Math.random() * 3))],
			'sum': 100,
			'what': makeid(Math.floor((Math.random() * 5)  + 5)),
			'date': getTime - (i * (86400000 / (i%2 + 1))),
			'user': this.userId
		});
	};
};


Meteor.startup(function() {
	Meteor.methods({
		removeAll: function() {
			return Records.remove({});
		}
	});
});