import crypto from 'crypto';

const API_BASE = 'https://afdian.com/api/open';

export function signRequest(token, userId, params) {
  const ts = Math.floor(Date.now() / 1000);
  const paramsStr = JSON.stringify(params || {});
  const raw = token + 'params' + paramsStr + 'ts' + ts + 'user_id' + userId;
  return {
    user_id: userId,
    params: paramsStr,
    ts,
    sign: crypto.createHash('md5').update(raw).digest('hex')
  };
}

export async function request(config, endpoint, params) {
  if (!config.token || !config.userId) return { ec: -1, em: '请先配置 token 和 userId' };
  try {
    const body = signRequest(config.token, config.userId, params);
    const response = await fetch(API_BASE + endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    return await response.json();
  } catch (error) { return { ec: -1, em: error.message }; }
}

export async function queryOrder(config, page = 1, perPage = 10) {
  return request(config, '/query-order', { page, per_page: perPage });
}

export async function querySponsor(config, page = 1, perPage = 10) {
  return request(config, '/query-sponsor', { page, per_page: perPage });
}