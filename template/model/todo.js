var Todo = function () {
    // Properties
  	this.property('id', 'string', {required: true});
  	this.property('title', 'string', {required: true});
  	this.property('status', 'string', {required: true});
};

exports.Todo =Todo;