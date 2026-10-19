import { setupManifest } from '@start9labs/start-sdk'
import { long, short } from './i18n'

export const manifest = setupManifest({
  id: 'n8n',
  title: 'n8n',
  license: 'Sustainable Use License',
  packageRepo: 'https://github.com/Start9-Community/n8n-startos',
  upstreamRepo: 'https://github.com/n8n-io/n8n',
  marketingUrl: 'https://n8n.io',
  donationUrl: null,
  description: { short, long },
  volumes: ['main'],
  images: {
    n8n: {
      source: {
        dockerTag: 'n8nio/n8n:2.43.7',
      },
      arch: ['x86_64', 'aarch64'],
    },
  },
})
