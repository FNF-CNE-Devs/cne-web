var fs = require('fs');
var hljs = require('highlight.js');
var haxeformat = require('./haxeformat.js');
var wiki = require('./pages/wiki.build.js');
var tools = require('./pages/tools/tools.build.js');
var apiDocs = require('./pages/apiDocs.build.js');
var indexPage = require('./pages/index.build.js');

var { copyDir, fixHtmlRefs, parseTemplate, compileSass, compileJs, setGlobals, getGlobals } = require('./utils.js');

var isFullBuild = process.argv.includes('--full');
process.argv = process.argv.filter(arg => arg != '--full');

var isWatch = process.argv.includes('--watch');
process.argv = process.argv.filter(arg => arg != '--watch');

var isFirstRun = process.argv.includes('--first-run');
process.argv = process.argv.filter(arg => arg != '--first-run');

var isRelease = process.argv.includes('--release') || isFullBuild;
process.argv = process.argv.filter(arg => arg != '--release');

setGlobals({isFullBuild, isWatch, isFirstRun, isRelease});

hljs.registerLanguage('haxe', haxeformat);

var pageDir = process.argv[2] || "./";
var exportPath = "./export/" + (process.argv[3] || '');

if(!pageDir.endsWith('/')) pageDir += '/';
if(!exportPath.endsWith('/')) exportPath += '/';

if (!fs.existsSync(exportPath)) {
	fs.mkdirSync(exportPath, {recursive: true});
}

console.log("Building pages...");

copyDir("./src/img/", exportPath + "/img/");

compileSass("./src/style.scss", exportPath + "/style.css");
compileSass("./src/pages/wiki.scss", exportPath + "/wiki.css");
compileSass("./src/pages/index.scss", exportPath + "/index.css");
compileSass("./src/pages/api-docs.scss", exportPath + "/api-docs.css");
compileSass("./src/giscus-theme.scss", exportPath + "/giscus-theme.css");

compileJs("./src/pages/featuredMods.js", exportPath + "/featuredMods.js");

indexPage.buildHtml(pageDir, exportPath); // builds into /
wiki.buildHtml(pageDir, exportPath); // builds into /wiki
tools.buildHtml(pageDir, exportPath); // builds into /tools
if(isFirstRun) {
	if(isFullBuild) {
		apiDocs.buildHtml(pageDir, exportPath, isWatch); // builds into /api-docs
	} else {
		console.log("Skipping API Docs build (not full build)...");
		apiDocs.buildNotBuilt(pageDir, exportPath); // builds into /api-docs
	}
}

console.log("Build completed.");