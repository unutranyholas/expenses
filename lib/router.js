/*Router.configure({
	layoutTemplate: 'app'
}); 

ListController = RouteController.extend({
	template: 'list',
	increment: 10,
	limit: function() { 
		return parseInt(this.params.recordsLimit) || this.increment
	},
	findOptions: function() {
		return {sort: {date: -1}, limit: this.limit()}
	},
	waitOn: function(){
		return Meteor.subscribe('allRecords', this.findOptions());
	},
	data: function(){
		return {records: Records.find({}, this.findOptions())}
	}
});

Router.map(function() {
	this.route('list', {
		path: '/:recordsLimit?',
		controller: ListController
		})
});

Router.onBeforeAction('loading');
*/

Router.map(function() {
	this.route('app', { path: '/' });
	this.route('settings', { path: 'settings/' });
	this.route('stats', { path: 'stats/' });
});
