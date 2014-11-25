'use strict';

const chai      = require("chai");
const coMocha   = require('co-mocha');
const expect    = chai.expect;
const Tree      = require('shark-tree');
const Logger    = require('shark-logger');
const path      = require('path');
const fs        = require('fs');
const VError    = require('verror');
const sprintf   = require('extsprintf').sprintf;

const ToTreeTransformer     = require('./transformers/to-tree-transformer');
const ToFilesTransformer    = require('./transformers/to-files-transformer');

describe('Initialization', function() {
	before(function *() {
		this.logger = Logger({
			name: 'TransformerTestLogger'
		});

		this.filesTree = yield Tree({
			'dest/path': 'src/path'
		}, this.logger);
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
	before(function *() {
		this.logger = Logger({
			name: 'TransformerTestLogger'
		});

		var files = {};
		var dest = path.join(__dirname, './fixtures/dest.txt');
		var src = path.join(__dirname, './fixtures/src.txt');
		files[dest] = src;
		this.dest = dest;
		this.src = src;
		this.filesTree = yield Tree(files, this.logger);
	});

	it('should transform "src/path" to "src/path/new"',function *(){
		try {
			var tree = yield ToTreeTransformer.treeToTree(this.filesTree, this.logger, {
				suffix: 'new'
			});
		}
		catch (error) {
			console.error(sprintf('%r', error));
		}

		expect(tree.getSrcCollectionByDest(this.dest).getFirstFile().getSrc()).equal(this.src.replace('.txt', '.new.txt'));
	});
});

describe('ToFilesTranformer',function (){
	before(function *() {
		this.logger = Logger({
			name: 'TransformerTestLogger'
		});

		var files = {};
		var dest = path.join(__dirname, './fixtures/dest.txt');
		var src = path.join(__dirname, './fixtures/src.txt');
		files[dest] = src;
		this.dest = dest;
		this.src = src;
		this.filesTree = yield Tree(files, this.logger);

		fs.writeFileSync(dest, '');
	});

	it('should save content from src to dest',function *(){
		try {
			var tree = yield ToFilesTransformer.treeToFiles(this.filesTree, this.logger, {
				suffix: 'new'
			});
		}
		catch (error) {
			console.error(sprintf('%r', error));
		}
		expect(fs.readFileSync(this.dest).toString()).equal('hello world new');
	});
});
