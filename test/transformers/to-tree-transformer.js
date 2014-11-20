'use strict';

const Transformer = require('../../');

module.exports = Transformer.extend({
	treeToTree: function *() {
		this.tree.forEach(function(destPath, srcFiles) {
			srcFiles.forEach(function(srcFile) {
				srcFile.src(srcFile.src() + '/new');
			});
		}.bind(this));

		return this.tree;
	}
});