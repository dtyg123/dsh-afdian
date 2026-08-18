window.__ModuleLoader__.load({ id: 'dsh-afdian', factory: (require) => {
  const module = { exports: {} }
  const exports = module.exports
  const React = require('react')
  const { useEffect, useState } = React
  const CONFIG_ENDPOINT = '/plugins/dsh-afdian/config'
  const QUERY_ENDPOINT = '/plugins/dsh-afdian/query'
  const TEST_ENDPOINT = '/plugins/dsh-afdian/test'

  const cardStyle = {
    listStyle: 'none', border: '1px solid var(--border-color, #d8d8d8)', borderRadius: 12,
    padding: 16, background: 'var(--surface-color, transparent)', display: 'grid', gap: 14,
  }
  const rowStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 20 }
  const btnStyle = { padding: '8px 16px', background: '#6c757d', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer' }
  const itemStyle = {
    display: 'grid', gap: 2, padding: '10px 12px', borderRadius: 8,
    background: 'var(--bg-color, rgba(0,0,0,0.04))',
  }

  function Field({ label, hint, children }) {
    return React.createElement('label', { style: rowStyle },
      React.createElement('span', null,
        React.createElement('span', { style: { display: 'block', fontWeight: 600 } }, label),
        React.createElement('small', { style: { display: 'block', opacity: 0.65, marginTop: 3 } }, hint),
      ),
      children,
    )
  }

  function fmtTime(seconds) {
    if (!seconds) return '-'
    try { return new Date(seconds * 1000).toLocaleString('zh-CN') } catch { return String(seconds) }
  }

  function fmtAmount(value) {
    if (value === null || value === undefined || value === '') return '-'
    return '¥' + String(value)
  }

  const ORDER_STATUS = { 0: '待付款', 1: '已付款', 2: '已完成' }

  function fmtStatus(status) {
    return ORDER_STATUS[status] || String(status)
  }

  function OrderItem({ order }) {
    const user = order.user_name || order.user_id || '未知用户'
    return React.createElement('div', { style: itemStyle },
      React.createElement('span', { style: { fontWeight: 600 } }, order.plan_title || '（无标题）'),
      React.createElement('span', { style: { opacity: 0.75 } }, fmtAmount(order.show_amount) + ' · ' + user + ' · ' + fmtStatus(order.status)),
      React.createElement('span', { style: { opacity: 0.55, fontSize: 12 } }, fmtTime(order.create_time) + ' · ' + (order.out_trade_no || '')),
    )
  }

  function SponsorItem({ sponsor }) {
    const user = sponsor.user ? (sponsor.user.name || sponsor.user_id) : '未知用户'
    const plan = sponsor.current_plan || {}
    return React.createElement('div', { style: itemStyle },
      React.createElement('span', { style: { fontWeight: 600 } }, user),
      React.createElement('span', { style: { opacity: 0.75 } }, (plan.name || '（无方案）') + ' · 累计 ' + fmtAmount(sponsor.all_sum_amount)),
      React.createElement('span', { style: { opacity: 0.55, fontSize: 12 } }, '本月 ' + (plan.pay_month || 0) + ' 个月 · ' + fmtTime(sponsor.last_pay_time)),
    )
  }

  function AfdianCard() {
    const [status, setStatus] = useState('loading')
    const [value, setValue] = useState({})
    const [busy, setBusy] = useState(false)
    const [testResult, setTestResult] = useState(null)
    const [query, setQuery] = useState(null)

    useEffect(() => {
      let active = true
      fetch(CONFIG_ENDPOINT, { cache: 'no-store' })
        .then(async (response) => {
          if (!response.ok) throw new Error('settings request failed: ' + response.status)
          return response.json()
        })
        .then((next) => { if (active) { setValue(next); setStatus('ready') } })
        .catch(() => { if (active) setStatus('unavailable') })
      return () => { active = false }
    }, [])

    const write = async (field, next) => {
      setBusy(true)
      try {
        const response = await fetch(CONFIG_ENDPOINT, {
          method: 'PATCH',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ [field]: next }),
        })
        if (!response.ok) throw new Error('settings write failed: ' + response.status)
        const updated = await response.json()
        setValue(updated)
      } catch {
        setStatus('unavailable')
      } finally {
        setBusy(false)
      }
    }

    const handleTest = async () => {
      if (!value.token || !value.userId) {
        setTestResult({ success: false, message: '请先填写 Token 和 User ID' });
        return;
      }
      setStatus('testing');
      setTestResult(null);
      try {
        const response = await fetch(TEST_ENDPOINT, { method: 'POST', cache: 'no-store' })
        if (!response.ok) throw new Error('test request failed: ' + response.status)
        const data = await response.json()
        const good = data.ec === 200 || data.ec === 0
        setTestResult({ success: good, message: good ? '✅ 连接成功！' : '❌ ' + (data.em || '连接失败') })
      } catch (e) {
        setTestResult({ success: false, message: '❌ ' + e.message })
      }
      setStatus('ready')
    }

    const fetchQuery = async (type) => {
      setQuery({ type, state: 'loading', data: null, error: null })
      try {
        const response = await fetch(QUERY_ENDPOINT + '?type=' + type + '&page=1&perPage=10', { cache: 'no-store' })
        if (!response.ok) throw new Error('query failed: ' + response.status)
        const result = await response.json()
        if (result.ec === -1) {
          setQuery({ type, state: 'error', data: null, error: result.em })
        } else if (result.ec !== 200 && result.ec !== 0) {
          setQuery({ type, state: 'error', data: null, error: result.em || '查询失败' })
        } else {
          setQuery({ type, state: 'done', data: result.data || { list: [] }, error: null })
        }
      } catch (e) {
        setQuery({ type, state: 'error', data: null, error: e.message })
      }
    }

    const renderQuery = () => {
      if (!query) return null
      if (query.state === 'loading') {
        return React.createElement('div', { role: 'status', style: { opacity: 0.7 } }, '正在查询…')
      }
      if (query.state === 'error') {
        return React.createElement('div', {
          style: { marginTop: '12px', padding: '10px', borderRadius: 8, background: '#f8d7da', color: '#721c24', fontSize: '13px' }
        }, '❌ ' + query.error)
      }
      const list = query.data.list || []
      const isSponsor = query.type === 'sponsor'
      const title = isSponsor ? '🤝 最近赞助' : '🛒 最近订单'
      const items = list.length
        ? list.map((entry, index) => isSponsor
            ? React.createElement(SponsorItem, { key: index, sponsor: entry })
            : React.createElement(OrderItem, { key: index, order: entry }))
        : React.createElement('div', { style: { opacity: 0.65 } }, '暂无数据')
      return React.createElement('div', { style: { marginTop: '14px', display: 'grid', gap: 8 } },
        React.createElement('strong', null, title + '（共 ' + (query.data.total_count || list.length) + ' 条）'),
        items,
      )
    }

    return React.createElement('li', { style: cardStyle, 'data-testid': 'dsh-afdian-settings' },
      React.createElement('div', null,
        React.createElement('strong', { style: { fontSize: 16 } }, '🍉 爱发电 API 配置'),
        React.createElement('p', { style: { margin: '5px 0 0', opacity: 0.72 } }, '配置爱发电 API Token 和 User ID'),
      ),
      status === 'unavailable'
        ? React.createElement('span', { role: 'status' }, '爱发电设置尚未连接到 DSH Host。')
        : status === 'loading'
        ? React.createElement('span', null, '正在读取设置…')
        : React.createElement(React.Fragment, null,
          React.createElement(Field, { label: 'API Token', hint: '在 https://afdian.net/dashboard/dev 获取' },
            React.createElement('input', {
              type: 'password',
              value: value.token || '',
              disabled: false,
              onChange: (event) => void write('token', event.target.value),
              style: { minWidth: 200, padding: '6px 10px', borderRadius: 8 }
            }),
          ),
          React.createElement(Field, { label: 'User ID', hint: '格式通常为 32 位十六进制字符串' },
            React.createElement('input', {
              type: 'text',
              value: value.userId || '',
              disabled: false,
              onChange: (event) => void write('userId', event.target.value),
              style: { minWidth: 200, padding: '6px 10px', borderRadius: 8 }
            }),
          ),
          busy ? React.createElement('small', { role: 'status' }, '正在保存…') : null,
          React.createElement('div', { style: { display: 'flex', gap: '12px', marginTop: '16px' } },
            React.createElement('button', {
              onClick: handleTest,
              disabled: status === 'testing',
              style: { padding: '8px 16px', background: '#6c757d', color: 'white', border: 'none', borderRadius: 8, cursor: status === 'testing' ? 'not-allowed' : 'pointer' }
            }, status === 'testing' ? '测试中...' : '🔍 测试连接'),
          ),
          testResult && React.createElement('div', {
            style: {
              marginTop: '12px',
              padding: '10px',
              borderRadius: 8,
              background: testResult.success ? '#d4edda' : '#f8d7da',
              color: testResult.success ? '#155724' : '#721c24',
              fontSize: '13px'
            }
          }, testResult.message),
          React.createElement('div', { style: { display: 'flex', gap: '12px', marginTop: '12px' } },
            React.createElement('button', { onClick: () => fetchQuery('order'), disabled: query && query.state === 'loading', style: btnStyle }, '🛒 查询订单'),
            React.createElement('button', { onClick: () => fetchQuery('sponsor'), disabled: query && query.state === 'loading', style: btnStyle }, '🤝 查询赞助'),
          ),
          renderQuery(),
        ),
    )
  }

  function apply(ctx) {
    ctx.slots.inject('settings.plugin.item', () => ctx.slots.register({
      name: 'settings.plugin.item', key: 'dsh-afdian',
      order: 30,
      inject: () => ({}),
    }, AfdianCard))
  }

  module.exports = {
    name: 'dsh-afdian-client',
    inject: ['slots'],
    apply,
  }
  return module.exports
} })