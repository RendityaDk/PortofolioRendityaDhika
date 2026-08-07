import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const apiMiddleware = () => ({
  name: 'api-middleware',
  configureServer(server: any) {
    server.middlewares.use('/api', async (req: any, res: any, next: any) => {
      // Body parser for JSON
      if (req.method === 'POST' || req.method === 'PUT') {
        let body = '';
        req.on('data', (chunk: any) => { body += chunk.toString(); });
        await new Promise(resolve => req.on('end', resolve));
        if (body) {
          try { req.body = JSON.parse(body); } catch(e) {}
        }
      }

      // Polyfill res.status and res.json
      res.status = (code: number) => {
        res.statusCode = code;
        return res;
      };
      res.json = (data: any) => {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(data));
      };

      // Polyfill req.query
      const urlObj = new URL(req.url || '', `http://${req.headers.host}`);
      req.query = Object.fromEntries(urlObj.searchParams.entries());

      const url = req.url?.split('?')[0];
      try {
        if (url?.includes('/data')) {
          const handler = await server.ssrLoadModule('/api/data.ts');
          await handler.default(req, res);
          return;
        } else if (url?.includes('/projects')) {
          const handler = await server.ssrLoadModule('/api/projects.ts');
          await handler.default(req, res);
          return;
        } else if (url?.includes('/educations')) {
          const handler = await server.ssrLoadModule('/api/educations.ts');
          await handler.default(req, res);
          return;
        } else if (url?.includes('/experiences')) {
          const handler = await server.ssrLoadModule('/api/experiences.ts');
          await handler.default(req, res);
          return;
        } else if (url?.includes('/profile')) {
          const handler = await server.ssrLoadModule('/api/profile.ts');
          await handler.default(req, res);
          return;
        } else if (url?.includes('/creatives')) {
          const handler = await server.ssrLoadModule('/api/creatives.ts');
          await handler.default(req, res);
          return;
        } else if (url?.includes('/upload')) {
          const handler = await server.ssrLoadModule('/api/upload.ts');
          await handler.default(req, res);
          return;
        }
      } catch (e: any) {
        console.error('API Error:', e);
        res.status(500).json({ error: e.message });
        return;
      }
      next();
    });
  }
});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), apiMiddleware()],
})
