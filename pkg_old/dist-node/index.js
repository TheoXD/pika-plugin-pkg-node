'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var fs = _interopDefault(require('fs-extra'));
var path = require('path');
var pkg = require('pkg');
var types = require('@pika/types');

/**
 * Copyright © 2019 kevinpollet <pollet.kevin@gmail.com>`
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE.md file.
 */
const beforeJob = async ({
  manifest,
  options,
  out
}) => {
  const packageJSONPath = path.join(out, "package.json");
  const distNodeFolderPath = path.join(out, "dist-node");
  const simpleBinEntrypointPath = path.join(distNodeFolderPath, "index.bin.js");
  const mainEntrypointPath = path.join(distNodeFolderPath, manifest.main || "index.js");
  const distNodeFolderPathExists = await fs.pathExists(distNodeFolderPath);

  if (!distNodeFolderPathExists) {
    throw new types.MessageError(`"${distNodeFolderPath}" does not exist, or was not yet created in the pipeline.`);
  }

  const mainEntrypointPathExists = await fs.pathExists(mainEntrypointPath);

  if (!mainEntrypointPathExists) {
    throw new types.MessageError(`"${mainEntrypointPath}" is the expected node entrypoint, but it does not exist.`);
  }

  const simpleBinEntrypointPathExists = await fs.pathExists(simpleBinEntrypointPath);
  const binEntrypointPath = simpleBinEntrypointPathExists ? simpleBinEntrypointPath : manifest.bin;
  return fs.writeJSON(packageJSONPath, {
    name: (options.name || manifest.name) + "-dist",
    bin: binEntrypointPath,
    main: mainEntrypointPath,
    pkg: {
      assets: options.assets || [],
      scripts: options.scripts || []
    }
  });
};
const build = ({
  options,
  out,
  reporter
}) => {
  const {
    debug,
    targets
  } = options;
  const outPath = path.join(out, options.outPath || "bin");
  const args = [out, "--out-path", outPath];

  if (debug) {
    args.push("--debug");
  }

  if (targets) {
    args.push("--targets", targets.join(","));
  }

  return pkg.exec(args).then(() => fs.readdir(outPath)).then(generatedFiles => generatedFiles.forEach(generatedFile => reporter.created(path.join(outPath, generatedFile))));
};
const afterJob = ({
  out
}) => {
  const packageJSONPath = path.join(out, "package.json");
  return fs.remove(packageJSONPath);
};

exports.afterJob = afterJob;
exports.beforeJob = beforeJob;
exports.build = build;
//# sourceMappingURL=index.js.map
