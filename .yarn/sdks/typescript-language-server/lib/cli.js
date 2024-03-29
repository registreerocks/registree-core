#!/usr/bin/env node

const { existsSync } = require(`fs`);
const { createRequire, createRequireFromPath } = require(`module`);
const { resolve } = require(`path`);

const relPnpApiPath = '../../../../.pnp.cjs';

const absPnpApiPath = resolve(__dirname, relPnpApiPath);
const absRequire = (createRequire || createRequireFromPath)(absPnpApiPath);

if (existsSync(absPnpApiPath)) {
  if (!process.versions.pnp) {
    // Setup the environment to be able to require typescript-language-server/lib/cli.js
    require(absPnpApiPath).setup();
  }
}

// Defer to the real typescript-language-server/lib/cli.js your application uses
module.exports = absRequire(`typescript-language-server/lib/cli.js`);
