import { defineConfig } from 'cypress';
import http from 'http';
import handler from 'serve-handler';

const options = {
  rewrites: [
    {
      source: '/quill-image-actions',
      destination: 'cypress/fixtures/quill-image-actions.html',
    },
    {
      source: '/quill-image-formats',
      destination: 'cypress/fixtures/quill-image-formats.html',
    },
  ],
};
const server = http.createServer((request, response) =>
  handler(request, response, options)
);

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:8080',
    setupNodeEvents(on) {
      on('before:browser:launch', () => {
        server.listen(8080);
      });
    },
  },
});
