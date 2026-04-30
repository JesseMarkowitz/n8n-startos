import { setupManifest } from '@start9labs/start-sdk'
import { short, long, alertInstall } from './i18n'

export const manifest = setupManifest({
  id: 'n8n',
  title: 'n8n',
  license: 'SustainableUseLicense',
  packageRepo: 'https://github.com/JesseMarkowitz/n8n-startos',
  upstreamRepo: 'https://github.com/n8n-io/n8n',
  marketingUrl: 'https://n8n.io',
  donationUrl: null,
  docsUrls: ['https://docs.n8n.io'],
  description: { short, long },
  volumes: ['main'],
  images: {
    n8n: {
      source: { dockerTag: 'docker.n8n.io/n8nio/n8n:2.17.8' },
      arch: ['x86_64', 'aarch64'],
    },
  },
  alerts: {
    install: alertInstall,
    update: null,
    uninstall: null,
    restore: null,
    start: null,
    stop: null,
  },
  dependencies: {},
})
