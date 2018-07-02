#!/usr/bin/env node

var fs = require('fs')
var nunjucks = require('nunjucks')

var type = process.argv[2]
var name = process.argv[3]

var types = ['page', 'component'];
if (-1 === types.indexOf(type)) {
	throw 'generate type is illegal, you could only generate page or component';
}
if (!name) {
	throw 'name is illegal';
}

var wxmlTpl = fs.readFileSync(`./tpl/${type}/index.wxml`).toString()
var jsTpl = fs.readFileSync(`./tpl/${type}/index.js`).toString()
var wxssTpl = fs.readFileSync(`./tpl/${type}/index.wxss`).toString()
var jsonTpl = fs.readFileSync(`./tpl/${type}/index.json`).toString()

var params = {};
params[`${type}Name`] = name;
var compiledWxml = nunjucks.renderString(wxmlTpl, params);
var compiledJs = nunjucks.renderString(jsTpl, params);
var compiledWxss = nunjucks.renderString(wxssTpl, params);
var compiledJson = nunjucks.renderString(jsonTpl);

if (!fs.existsSync(`./${type}s`)) {
	fs.mkdirSync(`./${type}s`)
}

if ('page' == type) {
	var appJson = JSON.parse(fs.readFileSync('./app.json').toString())
	let pages = appJson.pages;
	let pageUri = `pages/${name}/index`;
	if (-1 !== pages.indexOf(pageUri)) {
		appJson.pages.push(pageUri)
	}
	fs.writeFileSync('./app.json', JSON.stringify(appJson, null, 4));
}

return

var folder = `./${type}s/${name}`
fs.mkdir(folder, 0755, function (err) {
  	if (err) {
  		console.log(`generate fail, ${err}`)
  		return
  	}

	fs.writeFileSync(`${folder}/index.wxml`, compiledWxml)
	fs.writeFileSync(`${folder}/index.js`, compiledJs)
	fs.writeFileSync(`${folder}/index.wxss`, compiledWxss)
	fs.writeFileSync(`${folder}/index.json`, compiledJson)

	console.log(`${name} ${type} generate success`);

});