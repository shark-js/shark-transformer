'use strict';

const Transformer   = require('../../');
const fs            = require('fs');
const VError        = require('verror');

module.exports = Transformer.extend({
	treeToFiles: function *() {
		this.tree.forEach(function(destPath, srcFiles) {
			srcFiles.forEach(function(srcFile) {
				try {
					srcFile.content(fs.readFileSync(srcFile.src()).toString());
					fs.writeFileSync(destPath, srcFile.content() + ' new');
				}
				catch (error) {
					throw new VError(error);
				}
			});
		});
	}
});