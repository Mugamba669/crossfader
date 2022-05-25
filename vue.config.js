// const { defineConfig } = require('@vue/cli-service')
// module.exports = defineConfig({
//   transpileDependencies: true,
  
//     pluginOptions: {
//         electronBuilder: {
//             nodeIntegration: true,
//             builderOptions: {
//                 publish: ['github'],
//                 // asar: true,
//                 appId: 'com.lwzikizmp.blabsmusic',
//                 productName:'labs Music',
//                 linux: {
//                     target:['AppImage','deb']
//                 }

//             },
//         },
//     },

// })
module.exports = {
  pluginOptions: {
      electronBuilder: {
          nodeIntegration: true,
          builderOptions: {
              publish: ['github'],
              // asar: true,
              appId: 'com.lwzikizmp.blabsmusic',
              productName: 'B-labs Music',
              linux: {
                  target:['AppImage','deb']
              }

          },
      },
  },
};