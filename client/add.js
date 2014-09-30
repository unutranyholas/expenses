Template.add.events({
	'submit form': function(e) {
		e.preventDefault();

		/*30 Sep 2014*/
		var currencies = [{
				key: 'f',
				abbr: 'HUF',
				exRate: 43
			},
			{
				key: 'z',
				abbr: 'PLN',
				exRate: 3217
			},
			{
				key: 'e',
				abbr: 'EUR',
				exRate: 13430
			},
			{
				key: '$',
				abbr: 'USD',
				exRate: 10590
			}];


		var record = {
			type: $(e.target).find('[name=type]:checked').val(),
			//sum: $(e.target).find('[name=sum]').val(),
			what: $(e.target).find('[name=what]').val(),
			date: new Date().getTime(),
			user: Meteor.userId()
		}	
		var sum = $(e.target).find('[name=sum]').val()
		var numbers = sum.replace(/\D/g,'');
		var chars = sum.replace(/[0-9]/g, '');

		if(chars !== ''){ 
			var currency = _.find(currencies, function(item){ return item.key === chars });
		}

		if(typeof(currency) === 'undefined'){
			record.sum = numbers;
			record.sumOrigin = numbers;
			record.currency = 'BYR';
		} else {
			record.sum = Math.round(numbers * currency.exRate / 1000);
			record.sumOrigin = numbers;
			record.currency = currency.abbr;
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