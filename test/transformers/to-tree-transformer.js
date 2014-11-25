'use strict';

const Transformer = require('../../');

module.exports = Transformer.extend({
	treeToTree: function *() {
		var suffix = this.options.suffix;
		this.tree.forEach(function(destPath, srcFiles) {
			srcFiles.forEach(function(srcFile) {
				srcFile.setSrc(srcFile.getSrc().replace('.txt', '.' + suffix + '.txt'));
			});
		}.bind(this));

		return this.tree;
	}
});