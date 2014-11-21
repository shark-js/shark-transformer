'use strict';

const Transformer = require('../../');

module.exports = Transformer.extend({
	treeToTree: function *() {
		this.tree.forEach(function(destPath, srcFiles) {
			srcFiles.forEach(function(srcFile) {
				srcFile.setSrc(srcFile.getSrc().replace('.txt', '.new.txt'));
			});
		}.bind(this));

		return this.tree;
	}
});