'use strict';

const Transformer   = require('../../');
const fs            = require('fs');
const VError        = require('verror');

module.exports = Transformer.extend({
	treeToFiles: function *() {
		var suffix = this.options.suffix;
		this.tree.forEach(function(destPath, srcFiles) {
			srcFiles.forEach(function(srcFile) {
				try {
					srcFile.setContent(fs.readFileSync(srcFile.getSrc()).toString());
					fs.writeFileSync(destPath, srcFile.getContent() + ' ' + suffix);
				}
				catch (error) {
					throw new VError(error);
				}
			});
		});
	}
});