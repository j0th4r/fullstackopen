const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add 'cjs' to the list of file extensions that Metro resolves
config.resolver.sourceExts.push('cjs');

module.exports = config;
