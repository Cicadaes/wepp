var Todo = function () {
    // List all items
  	this.index = function (req, resp, params) {
    	var self = this;
		wepp.model.Todo.all(function (err, todos) {
			if (err) {
				throw err;
			}
			self.respondWith(todos, {type: 'todos'});
		});
  };
};

exports.Todo =Todo;