Template.list.helpers({
	'rendered': function(){

		// add day divider
		if($('.table-view-divider:last').text() !== moment(this.data.date).format('D MMM YYYY')){
			this.$('.table-view-cell').before( '<li class="table-view-cell table-view-divider">' + moment(this.data.date).format('D MMM YYYY') + '</li>' );
		};
	}
});


Template.list.events({
	'click .table-view-cell': function(e){
		
		if ($(e.currentTarget).hasClass('delete-mode')){
			$(e.currentTarget).removeClass('delete-mode');

		} else {
			$('.delete-mode').removeClass('delete-mode');
			$(e.currentTarget).addClass('delete-mode');
		}
	},
	'click .delete': function(e){

		Records.remove(this._id, function(){

		// remove day divider
		var item = $(e.currentTarget);

		if (item.next().hasClass('table-view-divider') && item.prev().hasClass('table-view-divider')) {
			item.prev().remove();
		}

		});
	}
});
