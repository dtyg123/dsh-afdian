import { getConfig, saveConfig } from '../lib/config.js';
import { queryOrder, querySponsor, request } from '../lib/api.js';
import Schema from '@deepseek-ai/schemastery';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SETTINGS_FILE = path.join(__dirname, '..', 'settings.html');

export const name = 'dsh-afdian';
export const inject = ['webServer', 'settings'];
export const CONFIG_ENDPOINT = '/plugins/dsh-afdian/config';

const AfdianConfig = Schema.object({
  token: Schema.string().default('').description('爱发电 API Token'),
  userId: Schema.string().default('').description('爱发电 User ID'),
}).description('爱发电(Afdian) API 配置');

const ok = (res, status, body) => {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    'content-length': Buffer.byteLength(payload),
  });
  res.end(payload);
};

export function apply(ctx) {
  console.log('[dsh-afdian] 插件初始化');

  if (ctx.settings?.register) {
    const fileConfig = getConfig();
    ctx.settings.register('dsh-afdian', AfdianConfig, {
      base: { token: fileConfig.token || '', userId: fileConfig.userId || '' },
      applies: 'live',
    });
    console.log('[dsh-afdian] settings namespace 已注册');
  }

  if (ctx.webServer) {
    ctx.webServer.register({
      kind: 'exact',
      path: CONFIG_ENDPOINT,
      handler: async (req, res) => {
        if (req.method === 'GET') {
          ok(res, 200, getConfig());
          return;
        }
        if (req.method === 'PATCH') {
          let body = '';
          for await (const chunk of req) body += chunk;
          try {
            const patch = JSON.parse(body);
            if (typeof patch !== 'object' || patch === null || Array.isArray(patch)) {
              throw new Error('patch must be an object');
            }
            const current = getConfig();
            saveConfig({ ...current, ...patch });
            ok(res, 200, getConfig());
          } catch (e) {
            ok(res, 400, { error: e.message });
          }
          return;
        }
        res.writeHead(405);
        res.end();
      },
    });

    ctx.webServer.register({
      kind: 'exact',
      path: '/plugins/dsh-afdian/test',
      handler: async (req, res) => {
        if (req.method !== 'POST') {
          res.writeHead(405);
          res.end();
          return;
        }
        const result = await request(getConfig(), '/ping', { test: 'test' });
        ok(res, 200, result);
      },
    });

    ctx.webServer.register({
      kind: 'exact',
      path: '/plugins/dsh-afdian/query',
      handler: async (req, res) => {
        if (req.method !== 'GET') {
          res.writeHead(405);
          res.end();
          return;
        }
        const url = new URL(req.url, 'http://localhost');
        const type = url.searchParams.get('type') === 'sponsor' ? 'sponsor' : 'order';
        const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10) || 1);
        const perPage = Math.min(50, Math.max(1, parseInt(url.searchParams.get('perPage') || '10', 10) || 10));
        const config = getConfig();
        const fn = type === 'sponsor' ? querySponsor : queryOrder;
        const result = await fn(config, page, perPage);
        ok(res, 200, result);
      },
    });

    ctx.webServer.register({
      kind: 'exact',
      path: '/afdian-settings',
      handler: async (req, res) => {
        try {
          const html = fs.readFileSync(SETTINGS_FILE, 'utf8');
          res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
          res.end(html);
        } catch (e) {
          res.writeHead(500, { 'content-type': 'text/plain' });
          res.end('Error: ' + e.message);
        }
      },
    });

    console.log('[dsh-afdian] HTTP 端点已注册');
  }

  console.log('[dsh-afdian] 插件初始化完成');
}