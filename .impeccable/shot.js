// Screenshot a route at an exact CSS viewport via the Chrome DevTools protocol.
// Usage: node shot.js <url> <width> <height> <out.png>
const { spawn } = require('child_process')
const fs = require('fs')

const chrome = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const [url, w, h, out, pre] = process.argv.slice(2)
const port = 9333 + Math.floor(Math.random() * 100)
const profile = `C:/Users/LENOVO/AppData/Local/Temp/opencode/chrome-${port}`
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const proc = spawn(
  chrome,
  [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${profile}`,
    'about:blank',
  ],
  { stdio: 'ignore' },
)

;(async () => {
  try {
    await sleep(2500)
    const list = await (await fetch(`http://127.0.0.1:${port}/json`)).json()
    const page = list.find((t) => t.type === 'page')
    const ws = new WebSocket(page.webSocketDebuggerUrl)
    await new Promise((r) => ws.addEventListener('open', r))

    let id = 1
    const send = (method, params) =>
      new Promise((res) => {
        const mid = id++
        const onMsg = (e) => {
          const m = JSON.parse(e.data)
          if (m.id === mid) {
            ws.removeEventListener('message', onMsg)
            res(m.result)
          }
        }
        ws.addEventListener('message', onMsg)
        ws.send(JSON.stringify({ id: mid, method, params }))
      })

    await send('Emulation.setDeviceMetricsOverride', {
      width: Number(w),
      height: Number(h),
      deviceScaleFactor: 1,
      mobile: Number(w) < 700,
    })
    await send('Page.enable')
    await send('Page.navigate', { url })
    await sleep(5000)

    if (pre) {
      const preResult = await send('Runtime.evaluate', {
        expression: pre,
        returnByValue: true,
      })
      console.log('pre:', JSON.stringify(preResult.result?.value))
      await sleep(1200)
    }

    const size = await send('Runtime.evaluate', {
      expression: `JSON.stringify({scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth})`,
      returnByValue: true,
    })
    const shot = await send('Page.captureScreenshot', { format: 'png' })
    fs.writeFileSync(out, Buffer.from(shot.data, 'base64'))
    console.log(out, size.result.value)
    ws.close()
  } finally {
    proc.kill()
  }
})()
