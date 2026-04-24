// Sets ios.useFrameworks=static so Firebase Swift pods compile as static framework bundles
// and expose their generated Swift headers (FirebaseAuth-Swift.h) on the framework search path.
// Sets ios.buildReactNativeFromSource=true so React-Core builds from source with proper module
// maps, making <React/RCTBridgeModule.h> a modular import inside RNFB framework modules.
// This mirrors the pattern used in kapten-mobile-app which works with RNFB v23 + Expo 54.
const { withPodfileProperties } = require('@expo/config-plugins');

module.exports = function withFirebaseSwiftFix(config) {
  return withPodfileProperties(config, (config) => {
    config.modResults['ios.useFrameworks'] = 'static';
    config.modResults['ios.buildReactNativeFromSource'] = 'true';
    return config;
  });
};

