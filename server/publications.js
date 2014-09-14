Meteor.publish('allRecords', function(options) {
	return Records.find();
});

if (Records.find().count() === 0) {

	var types = ['daily', 'monthly', 'extra']; 

	function makeid(size) {
		var text = "";
		var possible = "abcdefghijklmnopqrstuvwxyz0123456789";

		for( var i=0; i < size; i++ )
			text += possible.charAt(Math.floor(Math.random() * possible.length));

		return text;
	}

	for (i = 0; i < 500; i++){ 

	Records.insert({
			'type': types[Math.floor((Math.random() * 3))],
			'sum': Math.floor((Math.random() * 950) + 50),
			'what': makeid(Math.floor((Math.random() * 5)  + 5)),
			'date': new Date().getTime() - Math.floor((Math.random() * 10000000000) + 1),
		});
	};
};


Meteor.startup(function() {
	return Meteor.methods({
		removeAll: function() {
			return Records.remove({});
		}
	});
});