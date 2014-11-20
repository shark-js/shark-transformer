'use strict';

const chai      = require("chai");
const coMocha   = require('co-mocha');
const expect    = chai.expect;
const Tree      = require('../../shark-tree');
const Logger    = require('../../shark-logger');
const path      = require('path');
const fs        = require('fs');
const VError    = require('verror');

const ToTreeTransformer     = require('./transformers/to-tree-transformer');
const ToFilesTransformer    = require('./transformers/to-files-transformer');

describe('Initialization', function() {
	before(function() {
		this.filesTree = new Tree({
			'dest/path': 'src/path'
		});

		this.logger = Logger({
			name: 'TransformerTestLogger'
		});
	});

	it('should throw exception if tree is invalid type', function *(done) {
		try {
			yield ToTreeTransformer.treeToTree(null, this.logger);
			done(new Error());
		}
		catch (error) {
			done();
		}
	});

	it('should throw exception if logger is invalid type', function *(done) {
		try {
			yield ToTreeTransformer.treeToTree(this.filesTree, null);
			done(new Error());
		}
		catch (error) {
			done();
		}
	});

	it('should not throw any exceptions if tree and logger is valid type', function *(done) {
		try {
			yield ToTreeTransformer.treeToTree(this.filesTree, this.logger);
			done();
		}
		catch (error) {
			done(error);
		}
	});
});

describe('ToTreeTranformer',function(){
	before(function() {
		this.filesTree = new Tree({
			'dest/path': 'src/path'
		});

		this.logger = Logger({
			name: 'TransformerTestLogger'
		});
	});

	it('should transform "src/path" to "src/path/new"',function *(){
		var tree = yield ToTreeTransformer.treeToTree(this.filesTree, this.logger);
		expect(tree.getSrcFilesByDest('dest/path').firstSrcFile().src()).equal('src/path/new');
	});
});

describe('ToFilesTranformer',function(){
	before(function() {
		var files = {};
		var dest = path.join(__dirname, './fixtures/dest.txt');
		files[dest] = path.join(__dirname, './fixtures/src.txt');
		this.dest = dest;
		this.filesTree = new Tree(files);

		this.logger = Logger({
			name: 'TransformerTestLogger'
		});

		fs.writeFileSync(dest, '');
	});

	it('should save content from src to dest',function *(){
		yield ToFilesTransformer.treeToFiles(this.filesTree, this.logger);
		expect(fs.readFileSync(this.dest).toString()).equal('hello world new');
	});
});
