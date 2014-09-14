Template.add.events({
	'submit form': function(e) {
		e.preventDefault();

		var record = {
			type: $(e.target).find('[name=type]:checked').val(),
			sum: $(e.target).find('[name=sum]').val(),
			what: $(e.target).find('[name=what]').val(),
			date: new Date().getTime()
		}	

		record._id = Records.insert(record);

		$(e.target).find('[name=sum]').val('');
		$(e.target).find('[name=what]').val('');
		$('#add').attr('disabled', 'disabled');

		// remove old day divider 
		if($('.table-view-divider:first').text() === moment(record.date).format('D MMM YYYY')) {
			$('.table-view-divider:first').remove();
		};

	},
	'keyup form input': function(e) {

	var empty = $('form input').filter(function(){
		return this.value === '';
	});

	if (empty.length) {
		$('#add').attr('disabled', 'disabled');
	} else {
		$('#add').removeAttr('disabled');
	};

	},
	'click label': function(e){
		$('input.sum').attr('class', 'sum ' + $(e.target).attr('class'));
	}
});