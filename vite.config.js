import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/stacked_graph_opencode_gemma4_26b/',
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'CSV Stacked Graph PWA',
        short_name: 'CSVGraph',
        description: 'Dynamic CSV Stacked Bar Chart PWA',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
});
