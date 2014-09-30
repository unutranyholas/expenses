/*TODO*/

/*Template.statsFromServer.helpers({
	'count': function(){
		return Session.get('count') || 'Loading';
	}
});

Template.statsFromServer.rendered = function(){
	Deps.autorun(function() {
		Meteor.call('getHistory2', function(error, result){
			Session.set('count', result);
		});
	});	
};*/


Template.stats.helpers({
	'chart': function(){

	var options = {
		from: moment().subtract(30, 'days').valueOf(),
		to: moment().valueOf(),
		period: 7 };

	var result = getHistory(options);

	var max = _.max(result, function(item){ return item.sum; });



	var size = _.map(result, function(num, key) {
		return { width: Math.floor(num.sum / max.sum * 80) + '%',
				 avr: num.avr,
				 date: num.date } });

	return size;
	}
});	

Template.shortStats.helpers({
	'getStats': function(period, aggrType, category) {

	var options = {};

		options.period = period;
		options.from = moment().valueOf();
		options.category = (typeof(category) === 'object') ? undefined : category;

		return commafy(getHistory(options)[0][aggrType]);
	}

});


Template.shortStats.events({
	'click': function(e){
		Router.go('stats');
	} 
});

Template.average.rendered = function () {

	var barWidth = 12;
	var lastDays = 60;

	var options = {
		from: moment().subtract(lastDays, 'days').valueOf(),
		to: moment().valueOf(),
		period: 1 };

	var parseDate = d3.time.format("%d %b %Y").parse;

	var margin = {top: 80, right: 40, bottom: 80, left: 10},
		width = barWidth * lastDays - margin.left - margin.right,
		height = 240 - margin.top - margin.bottom;

	var svg = d3.select('#average')
		.attr('width', width + margin.left + margin.right)
		.attr('height', height + margin.top + margin.bottom)
	.append("g")
		.attr("transform", "translate(" + (margin.left + 0.5) + "," + (margin.top + 0.5) + ")");

	var x = d3.time.scale()
		.range([0, width]);

	var y = d3.scale.linear()
		.range([height, 0]);

	var xAxis = d3.svg.axis()
		.scale(x)
		.ticks(Math.floor(lastDays/7))
		.tickSize(6, 0)
		.tickPadding(6)
		.orient("bottom");

	var yAxis = d3.svg.axis()
		.scale(y)
		.ticks(5)
		.tickSize(width, 0)
		.tickPadding(30)
		.tickFormat(d3.format(".0f"))
		.orient("right");

	var line = d3.svg.line()
		.x(function(d) { return x(d.date); })
		.y(function(d) { return y(d.avr); });

	svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + (height + 10) + ")");

	svg.append("g")
		.attr("class", "y axis");

	var chartsOptions = [
		{
			from: moment().subtract(lastDays, 'days').valueOf(),
			to: moment().valueOf(),
			period: 7,
			interpolate: 'basis',
			focus: true
		},	
		{
			from: moment().subtract(lastDays, 'days').valueOf(),
			to: moment().valueOf(),
			period: 30,
			interpolate: 'basis',
			//focus: true
		},
		{
			from: moment().subtract(lastDays, 'days').valueOf(),
			to: moment().valueOf(),
			period: 1,
			interpolate: function(points){ return lineBar(points, 0.9)}
		}
	];

	var drawChart = function(options) {

		var data = getHistory(options);

		data.forEach(function(d) {
			d.date = parseDate(d.date);
		});

		line
			.interpolate(options.interpolate);

		var paths = svg.selectAll("path.line.last" + options.period + '.' + (options.category || 'total'))
			.data([data]);

		if (options.focus) {
			x.domain(d3.extent(data, function(d) { return d.date; }));
			y.domain(d3.extent(data, function(d) { return d.avr; }));
		};

		svg.select(".x.axis")
			.transition()
			.duration(1000)
			.call(xAxis);
			
		svg.select(".y.axis")
			.transition()
			.duration(1000)
			.call(yAxis);

		paths
			.enter()
			.append("path")
			.attr("class", "line last" + options.period + ' ' + (options.category || 'total'))
			.attr('d', line);

		paths
			.attr('d', line);
				
		paths
			.exit()
			.remove();
	};



	Deps.autorun(function() {
		chartsOptions.forEach(function(options) {drawChart(options)} 
		);
	});


};


var filterByPeriod = function(from, to) {

	if (to === undefined) {
		var to = moment(from).add(1, 'day').valueOf();
	};

	return {date: {$gt: from, $lt: to}};

}

var filterByDaysAgo = function (duration, daysAgo) {

	var to = moment().valueOf();

	if (daysAgo === undefined) {
		var from = moment().subtract(duration, 'days').valueOf();
		var to = moment().valueOf();
	} else {
		var from = moment().subtract(duration + daysAgo, 'days').valueOf();
		var to = moment().subtract(daysAgo, 'days').valueOf();
	}

	return {date: {$gt: from, $lt: to}};	
}

var getHistory = function (options) {

	var result = [];

	if (options.to === undefined) {
		options.to = moment();
	}

	if (options.from === undefined) {
		options.from = moment();
	}

	options.to = moment(options.to).hours(23).minutes(59).seconds(59).valueOf();
	var aggrTo = moment(options.from).hours(23).minutes(59).seconds(59);
	var aggrFrom = moment(options.from).subtract(options.period - 1, 'days').hours(0).minutes(0).seconds(0);

	while (aggrTo.valueOf() <= options.to) {

		var query = filterByPeriod(aggrFrom.valueOf(), aggrTo.valueOf());
		var data = Records.find(query).fetch();

		var dayStat = {
			date: moment(aggrTo).format('D MMM YYYY'),
			sum: getTotal(data, options.category),
			avrPeriod: options.period,
			category: options.category || 'total'
		};

		dayStat.avr = Math.round(dayStat.sum / dayStat.avrPeriod);

		if (dayStat.sum === 0) {
			dayStat.per = '0%';
		} else {
			if (options.category === undefined) {
				dayStat.per = '100%';
			} else {
				dayStat.per = Math.floor(dayStat.sum / getTotal(data) * 100) + '%';
			}
		};

		result.push(dayStat);

		aggrFrom.add(1, 'days');
		aggrTo.add(1, 'days');

	}
	return result;
}



var getTotal = function(data, category) {

	if (category === undefined) {
		return sum(data);
	} else {
		return sum(_.filter(data, function(item){
			return item.type === category
		}));
	}
};


var getAverage = function(data, query, category) {

	if (typeof(query) === 'object') {
		var from = moment(query.date.$gt);
		var to = moment(query.date.$lt);

		var duration = to.diff(from, 'days') + 1;
	} else {
		var duration = query;
	}

	return Math.round(getTotal(data, category) / duration);
}


var getPercentage = function(data, category) {
	return Math.round(getTotal(data, category) / getTotal(data) * 100);
}


var sum = function(data) {
	return _.reduce(_.pluck(data, 'sum'), function(result, current) {
		return result + +current;
	}, 0);
};

var commafy = function(num) {
	num = num.toString();
	if (num.length >= 5) {
		num = num.replace(/(\d)(?=(\d{3})+$)/g, '$1 ');
	}
	return num;
}

var lineBar = function(points, width) {

	var diff = (points[1][0] - points[0][0]) * width / 2;
	var newPoints = points.map(function(d, i) {
		return [d[0] - diff, Math.floor(d[1]), d[0] + diff, Math.floor(d[1])]
	});

	return newPoints; 
}

