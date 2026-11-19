const path = require('path')

// The React Native Gradle bundle task passes entry paths relative to this app
// (e.g. ../../node_modules/expo-router/entry.js). Expo otherwise makes the
// monorepo root Metro's server root, so those paths resolve one level too high
// and the release build fails with "Unable to resolve module". Opting out keeps
// the app and Metro in agreement; hoisted dependencies are still resolved via
// nodeModulesPaths below.
if (!process.env.EXPO_NO_METRO_WORKSPACE_ROOT) {
  process.env.EXPO_NO_METRO_WORKSPACE_ROOT = '1'
}

const { getDefaultConfig } = require('expo/metro-config')
const { withNativeWind } = require('nativewind/metro')

const projectRoot = __dirname
const workspaceRoot = path.resolve(projectRoot, '../..')

const config = getDefaultConfig(projectRoot)

config.watchFolders = [workspaceRoot]
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
]
config.resolver.disableHierarchicalLookup = true

module.exports = withNativeWind(config, {
  input: './global.css',
  configPath: '../../tailwind.config.js',
})
