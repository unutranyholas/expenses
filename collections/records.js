Records = new Meteor.Collection('records');

Pages = new Meteor.Pagination(Records, {
	infinite: true,
	itemTemplate: 'list',
	//layoutTemplate: 'layout',
	sort: {date: -1},
	router: 'iron-router'
	//fastRender: true
});

Records.allow({
	insert: function(userId, doc) {
		return !! userId;
	},
	remove: function(userId, doc) {
		return !! userId;
	},
	update: function(userId, doc) {
		return !! userId;
	}
});

Accounts.config({
	forbidClientAccountCreation: true
});