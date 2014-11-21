'use strict';

const util      = require('util');
const VError    = require('verror');
const Tree      = require('shark-tree');
const Logger    = require('shark-logger');
const extend    = require('node.extend');

function SharkTransformer(tree, logger, options) {
	if (typeof tree === 'undefined') {
		throw new VError('tree argument is empty');
	}

	if (typeof logger === 'undefined') {
		throw new VError('logger argument is empty');
	}

	if (tree.constructor && tree.constructor.name !== Tree.name) {
		throw new VError('tree is not instanceof SharkTree');
	}

	if (logger.constructor && logger.constructor.name !== Logger.INTERNAL_LOGGER.name) {
		throw new VError('logger is not instanceof SharkLogger');
	}

	this.tree       = tree;
	this.options    = extend({}, this.optionsDefault || {}, options || {});
	this.logger     = logger;

	if (typeof this.init === 'function') {
		this.init();
	}
}

SharkTransformer.prototype = {
	constructor: SharkTransformer,

	treeToTree: function *() {
		throw new VError('treeToTree method is not implemented');
	},

	treeToFiles: function *() {
		throw new VError('treeToFiles method is not implemented');
	}
};

SharkTransformer.extend = function(concreteTransformerPrototype) {
	function ConcreteTransformer() {
		SharkTransformer.apply(this, arguments);
	}

	util.inherits(ConcreteTransformer, SharkTransformer);
	Object.keys(concreteTransformerPrototype).forEach(function(key) {
		ConcreteTransformer.prototype[key] = concreteTransformerPrototype[key];
	});

	return {
		treeToTree: function *(tree, logger, options) {
			try {
				var t = new ConcreteTransformer(tree, logger, options);
				return yield t.treeToTree();
			}
			catch (error) {
				throw new VError(error, 'Transformer#treeToTree error');
			}
		},

		treeToFiles: function *(tree, logger, options) {
			try {
				var t = new ConcreteTransformer(tree, logger, options);
				return yield t.treeToFiles();
			}
			catch (error) {
				throw new VError(error, 'Transformer#treeToFiles error');
			}
		}
	}
};

module.exports = SharkTransformer;