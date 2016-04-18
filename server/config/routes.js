module.exports = function(app) {
	app.get('/info', function(req, res) {
		res.json({name: 'Alex', age: 24});
	});
}