// Converts an rspack configuration that optionally contains an extra `define`
// property into a regular rspack configuration with an added `DefinePlugin`.

import { DefinePlugin } from "@rspack/core";
import fs from "node:fs";
import path from "node:path";

export function normalizeConfigurationWithDefine(config) {
  let { define, plugins, https, devServer = {}, ...rest } = config;

  //
  // 1. Handle the custom `define:` field (existing behavior)
  //
  if (define !== undefined && Object.keys(define).length > 0) {
    plugins ??= [];
    plugins.push(new DefinePlugin(define));
  }

  //
  // 2. Handle custom HTTPS configuration
  //
  if (https && (https.keyFile || https.certFile)) {
    devServer = {
      ...devServer,
      https: {
        key: fs.readFileSync(path.resolve(https.keyFile)),
        cert: fs.readFileSync(path.resolve(https.certFile)),
      },
    };
  }

  //
  // 3. Return final merged config
  //
  return {
    plugins,
    devServer,
    ...rest,
  };
}

