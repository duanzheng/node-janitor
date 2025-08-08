const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');

// Helper flags for conditional mac signing/notarization
const isMac = process.platform === 'darwin';
const shouldNotarize =
    Boolean(process.env.APPLE_ID) &&
    Boolean(process.env.APPLE_APP_SPECIFIC_PASSWORD) &&
    Boolean(process.env.APPLE_TEAM_ID);
const hasSigningIdentity = Boolean(
    process.env.CSC_NAME || process.env.CSC_IDENTITY
);

module.exports = {
    // 在 make 之后对生成的 .app 与 .dmg 执行 staple，避免用户侧出现“已损坏”
    hooks: {
        postMake: async (_forgeConfig, makeResults) => {
            if (!isMac || !shouldNotarize) return;
            const execa = require('execa');
            const path = require('path');
            const artifacts = makeResults
                .flatMap((target) => target.artifacts)
                .filter(
                    (artifactPath) =>
                        artifactPath.endsWith('.dmg') ||
                        artifactPath.endsWith('.zip') ||
                        artifactPath.endsWith('.app')
                );
            for (const artifact of artifacts) {
                try {
                    // 对 .app 及 .dmg 进行 staple
                    await execa(
                        'xcrun',
                        ['stapler', 'staple', path.resolve(artifact)],
                        { stdio: 'inherit' }
                    );
                } catch (e) {
                    // 忽略无法 staple 的制品（例如 zip），不中断流程
                }
            }
        },
    },
    packagerConfig: {
        asar: {
            unpack: '**/{.**,**}/**/*.node',
        },
        name: 'Node Janitor',
        productName: 'Node Janitor',
        appBundleId: 'com.tonyduan.node-janitor',
        appCategoryType: 'public.app-category.developer-tools',
        executableName: 'node-janitor',
        // icon: './assets/icon', // 如果你有图标文件的话
        // Let webpack plugin handle ignores automatically
        ...(isMac && hasSigningIdentity
            ? {
                  osxSign: {
                      identity:
                          process.env.CSC_NAME || process.env.CSC_IDENTITY,
                      'hardened-runtime': true,
                      entitlements: './assets/entitlements.mac.plist',
                      'entitlements-inherit': './assets/entitlements.mac.plist',
                      'gatekeeper-assess': false,
                      // Timestamps are required for notarization
                      timestamp: true,
                  },
              }
            : {}),
        ...(isMac && shouldNotarize
            ? {
                  osxNotarize: {
                      appleId: process.env.APPLE_ID,
                      appleIdPassword: process.env.APPLE_APP_SPECIFIC_PASSWORD,
                      teamId: process.env.APPLE_TEAM_ID,
                  },
              }
            : {}),
    },
    rebuildConfig: {},
    makers: [
        {
            name: '@electron-forge/maker-squirrel',
            config: {
                name: 'node-janitor',
                setupExe: 'NodeJanitorSetup.exe',
                // setupIcon: './assets/icon.ico', // Remove icon config until we have actual icon files
            },
        },
        // macOS: 推荐 DMG 作为分发载体，支持粘贴公证（staple）
        {
            name: '@electron-forge/maker-dmg',
            platforms: ['darwin'],
            config: {
                format: 'ULFO',
            },
        },
        {
            name: '@electron-forge/maker-zip',
            platforms: ['darwin'],
        },
        {
            name: '@electron-forge/maker-deb',
            config: {},
        },
        {
            name: '@electron-forge/maker-rpm',
            config: {},
        },
    ],
    plugins: [
        {
            name: '@electron-forge/plugin-auto-unpack-natives',
            config: {},
        },
        {
            name: '@electron-forge/plugin-webpack',
            config: {
                mainConfig: './webpack.main.config.js',
                renderer: {
                    config: './webpack.renderer.config.js',
                    nodeIntegration: false,
                    entryPoints: [
                        {
                            html: './src/index.html',
                            js: './src/renderer.tsx',
                            name: 'main_window',
                            preload: {
                                js: './src/preload.ts',
                                config: './webpack.preload.config.js',
                            },
                        },
                    ],
                },
                port: 9001,
            },
        },
        // Fuses are used to enable/disable various Electron functionality
        // at package time, before code signing the application
        new FusesPlugin({
            version: FuseVersion.V1,
            [FuseV1Options.RunAsNode]: false,
            [FuseV1Options.EnableCookieEncryption]: true,
            [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
            [FuseV1Options.EnableNodeCliInspectArguments]: false,
            [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
            [FuseV1Options.OnlyLoadAppFromAsar]: true,
        }),
    ],
};
