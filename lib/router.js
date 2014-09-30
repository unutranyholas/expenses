Router.map(function() {
	this.route('app', { path: '/' });
	this.route('settings', { path: 'settings/' });
	this.route('stats', { path: 'stats/' });
});

Router.onBeforeAction('auth', {except: ['signIn']});

Router.configure({
  auth: {
    template: 'signIn'
  }
});