/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

const gulp = require('gulp');
const path = require('path');
const fs = require('fs');
const ts = require('gulp-typescript');
const typescript = require('typescript');
const sourcemaps = require('gulp-sourcemaps');
const del = require('del');
const runSequence = require('run-sequence');
const es = require('event-stream');
const vsce = require('vsce');
const nls = require('vscode-nls-dev');
const { rejects } = require('assert');

const tsProject = ts.createProject('./tsconfig.json', { typescript });

const inlineMap = true;
const inlineSource = false;
const outDest = 'out';

const exec = require('await-exec');
const { stderr } = require('process');

// If all VS Code languages are supported you can use nls.coreLanguages
const languages = [
	{ folderName: 'eng', id: 'en' },
	{ folderName: 'deu', id: 'de' },
	{ folderName: 'esp', id: 'es' },
	{ folderName: 'fra', id: 'fr' },
	{ folderName: 'zho', id: 'zh' },
	{ folderName: 'pseudo', id: 'qps-ploc' }
];

const cleanTask = function () {
	return del(['out/**', 'package.nls.*.json', 'i18n-sample*.vsix']);
}

const internalCompileTask = function () {
	return doCompile(false);
};

const internalNlsCompileTask = function () {
	return doCompile(true);
};

const addI18nTask = function () {
	return gulp.src(['package.nls.json'])
		.pipe(nls.createAdditionalLanguageFiles(languages, 'i18n'))
		.pipe(gulp.dest('.'));
};

const buildTask = gulp.series(cleanTask, internalNlsCompileTask, addI18nTask);

const doCompile = function (buildNls) {
	var r = tsProject.src()
		.pipe(sourcemaps.init())
		.pipe(tsProject()).js
		.pipe(buildNls ? nls.rewriteLocalizeCalls() : es.through())
		.pipe(buildNls ? nls.createAdditionalLanguageFiles(languages, 'i18n', 'out') : es.through());

	if (inlineMap && inlineSource) {
		r = r.pipe(sourcemaps.write());
	} else {
		r = r.pipe(sourcemaps.write("../out", {
			// no inlined source
			includeContent: inlineSource,
			// Return relative source map root directories per file.
			sourceRoot: "../src"
		}));
	}

	return r.pipe(gulp.dest(outDest));
}

const vscePublishTask = function () {
	return vsce.publish({
		packagePath: process.env.VSIX_PACKAGE_PATH
	});
};

const vscePackageTask = function () {
	return vsce.createVSIX({
		packagePath: process.env.VSIX_PACKAGE_PATH
	});
};

const vscodeInstallVsixTask = function (cb) {
	const vsixName = path.join(__dirname, fs.readdirSync(__dirname)
		.filter(p => path.extname(p) === ".vsix")
		.sort((a, b) => a < b ? 1 : a > b ? -1 : 0)[0]);
	(async () => {
		await exec(`code --uninstall-extension pdconsec.vscode-print`)
		await exec(`code --install-extension ${vsixName}`);
		cb();
	})();
};

gulp.task('default', buildTask);

gulp.task('clean', cleanTask);

gulp.task('compile', gulp.series(cleanTask, internalCompileTask));

gulp.task('build', buildTask);

gulp.task('publish', gulp.series(buildTask, vscePublishTask));

gulp.task('package', gulp.series(buildTask, vscePackageTask));

gulp.task('install', gulp.series(vscodeInstallVsixTask));

gulp.task('redo', gulp.series(buildTask, vscePackageTask, vscodeInstallVsixTask));
