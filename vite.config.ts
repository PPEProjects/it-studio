import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import AutoImport from 'unplugin-auto-import/vite'
import path from 'path'
import tsconfigPaths from 'vite-tsconfig-paths'
import Inspect from 'vite-plugin-inspect'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'

// @ts-ignore
import EnvGenerator from './src/plugins/vite/env'
// @ts-ignore
import GrapHQLGenerator from './src/plugins/vite/graphql'

// @ts-ignore
export default ({ mode }) => {
  // Load app-level env vars to node-level env vars.
  const env = loadEnv(mode, process.cwd(), '')
  /**
   * @link https://vitejs.dev/config/
   */
  return defineConfig({
    build: {
      // sourcemap: true,
    },
    plugins: [
      vue(),
      AutoImport({
        imports: [
          '@vueuse/core',
          'vue',
          'vue-router',
          {
            '@vue/apollo-composable': [
              'useSubscription',
              'useQuery',
              'useMutation',
              'useLazyQuery'
            ],
            '@nguyenshort/vue3-mitt': ['useEmitter']
          },
          {
            '@vueuse/firebase': ['useAuth']
          },
          {
            'firebase/auth': ['getAuth'],
            'firebase/database': [
              'getDatabase',
              ['ref', 'dbRef'],
              ['set', 'dbSet'],
              ['onValue', 'dbOnValue']
            ],
            uuid: [['v4', 'uuidv4']]
          }
        ],
        include: [/\.[tj]sx?$/, /\.vue$/, /\.vue\?vue/, /\.md$/],
        dirs: [
          'src/**/composable/*', // blob pattern
          'src/**/store',
          'src/**/dto',
          'src/apollo/it/*'
        ],
        dts: path.resolve(__dirname, 'types/auto-imports.d.ts'),
        eslintrc: {
          enabled: true,
          globalsPropValue: true
        }
      }),
      Components({
        resolvers: [
          IconsResolver({
            prefix: 'i'
          }),
          AntDesignVueResolver({
            importStyle: 'less'
          }),
          (componentName) => {
            // where `componentName` is always CapitalCase
            if (componentName.toLowerCase() === 'gridlayout') {
              return { name: 'GridLayout', from: 'vue3-grid-layout' }
            } else if (componentName.toLowerCase() === 'griditem') {
              return { name: 'GridItem', from: 'vue3-grid-layout' }
            }
          },
          (componentName) => {
            // where `componentName` is always CapitalCase
            if (componentName.toLowerCase() === 'draggable')
              return { name: 'default', from: 'vuedraggable' }
          },
          (componentName) => {
            // where `componentName` is always CapitalCase
            if (componentName === 'VueCropper')
              return { name: 'default', from: 'vue-cropperjs' }
          }
        ],
        dts: path.resolve(__dirname, 'types/components.d.ts')
      }),
      Icons({
        autoInstall: true
      }),
      tsconfigPaths({
        loose: true
      }),
      Inspect({}),
      EnvGenerator(),
      GrapHQLGenerator()
    ],
    css: {
      preprocessorOptions: {
        less: {
          modifyVars: {
            'primary-color': '#3b66f5',
            'border-radius-base': '6px',
            'input-padding-horizontal': '15px',
            'form-vertical-label-padding': '0 0 4px',
            'text-color': '#4B5563',
            'label-color': '#4B5563',
            'surface-lighter': '#f6f7fc',
            'table-header-bg': '#fff',
            'table-header-color': 'rgba(18,18,23,.6)',
            'table-selected-row-bg': '#fff',
            'font-family':
              'Nunito Sans, SF Pro Text, SF Pro Icons, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif'
          },
          javascriptEnabled: true
        }
      }
    },
    preview: {
      port: Number(env.VITE_PORT) || 3000
    },
    server: {
      port: Number(env.VITE_PORT) || 3000,
      proxy: {
        '/backend': {
          // @ts-ignore
          target: env.VITE_IT_SERVER,
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/backend/, '')
        }
      }
    }
  })
}
