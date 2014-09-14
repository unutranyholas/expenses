Records = new Meteor.Collection('records');

Pages = new Meteor.Pagination(Records, {
	infinite: true,
	itemTemplate: 'list',
	//layoutTemplate: 'layout',
	sort: {date: -1},
	router: 'iron-router',
	//fastRender: true
});

Records.allow({
	insert: function(userId, doc) {
		return 1;
	},
	remove: function(userId, doc) {
		return 1;
	},
	update: function(userId, doc) {
		return 1;
	},
});

//console.log(moment() + ' records');