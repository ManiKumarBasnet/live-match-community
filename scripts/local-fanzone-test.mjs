import { spawn } from "node:child_process";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const port = 9333;
const mobile = process.argv.includes("--mobile");
const userData = mkdtempSync(join(tmpdir(), "office-world-cup-chrome-"));

const chrome = spawn(chromePath, [
  "--headless=new",
  "--disable-gpu",
  "--no-sandbox",
  mobile ? "--window-size=390,844" : "--window-size=1365,900",
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${userData}`,
  "http://localhost:5173",
], { stdio: "ignore" });

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function json(url, options) {
  const response = await fetch(url, options);
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  return response.json();
}

function connect(wsUrl) {
  const ws = new WebSocket(wsUrl);
  let id = 0;
  const pending = new Map();
  ws.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    if (message.id && pending.has(message.id)) {
      const { resolve, reject } = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) reject(new Error(message.error.message));
      else resolve(message.result);
    }
  });
  return new Promise((resolve, reject) => {
    ws.addEventListener("open", () => {
      resolve({
        send(method, params = {}) {
          id += 1;
          ws.send(JSON.stringify({ id, method, params }));
          return new Promise((res, rej) => pending.set(id, { resolve: res, reject: rej }));
        },
        close: () => ws.close(),
      });
    });
    ws.addEventListener("error", reject);
  });
}

try {
  await sleep(1200);
  const pages = await json(`http://127.0.0.1:${port}/json/list`);
  const page = pages.find((item) => item.url.includes("localhost:5173")) || pages[0];
  const cdp = await connect(page.webSocketDebuggerUrl);
  await cdp.send("Runtime.enable");
  if (mobile) {
    await cdp.send("Emulation.setDeviceMetricsOverride", {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true,
    });
  }
  await sleep(1200);

  const expression = `
    (async () => {
      const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
      const setValue = (el, value) => {
        const setter = Object.getOwnPropertyDescriptor(el.constructor.prototype, "value").set;
        setter.call(el, value);
        el.dispatchEvent(new Event("input", { bubbles: true }));
      };
      const clickByText = (selector, text) => {
        const el = [...document.querySelectorAll(selector)].find((node) => node.textContent.includes(text));
        if (!el) throw new Error("Missing " + text);
        el.click();
        return el;
      };

      clickByText("button", "Fan Zone");
      await wait(400);

      const name = document.querySelector('input[placeholder="Your display name"]');
      const text = document.querySelector('textarea[placeholder^="Send a match comment"]');
      if (!name) throw new Error("Missing display name input");
      if (!text) throw new Error("Missing message textarea");

      setValue(name, "Local Tester");
      setValue(text, "Local fan zone test message");
      await wait(100);
      clickByText("button", "Send");
      await wait(500);

      return {
        title: document.querySelector(".top-title")?.textContent,
        hasMessage: document.body.innerText.includes("Local fan zone test message"),
        hasAuthor: document.body.innerText.includes("Local Tester"),
        note: document.querySelector(".fan-note")?.textContent,
        fanRoomTop: Math.round(document.querySelector(".fan-room")?.getBoundingClientRect().top ?? -1),
        matchListTop: Math.round(document.querySelector(".fan-match-list")?.getBoundingClientRect().top ?? -1),
        viewportWidth: window.innerWidth,
        body: document.body.innerText.slice(0, 1200),
      };
    })()
  `;

  const result = await cdp.send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
  console.log(JSON.stringify(result.result.value, null, 2));
  cdp.close();
} finally {
  chrome.kill();
}
