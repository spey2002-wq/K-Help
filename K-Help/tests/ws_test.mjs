// Usage: node ws_test.mjs <username> <password>   (set KHELP_API to test another server)
const BE = (process.env.KHELP_API ?? "https://khelp-backend-7eqm.onrender.com").replace(/\/$/, "");
const user = process.argv[2], pw = process.argv[3];
const NUL = "\u0000";
const frame = (cmd, headers = {}, body = "") => cmd + "\n" + Object.entries(headers).map(([k, v]) => `${k}:${v}`).join("\n") + "\n\n" + body + NUL;

async function login(u, p) {
  const r = await fetch(BE + "/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username: u, password: p }) });
  return (await r.json()).data?.accessToken;
}

function session(headers, label) {
  return new Promise((resolve) => {
    const out = { frames: [], closed: false };
    const ws = new WebSocket(BE.replace("https", "wss") + "/ws");
    const t = setTimeout(() => { try { ws.close(); } catch {} resolve(out); }, 9000);
    ws.onopen = () => ws.send(frame("CONNECT", { "accept-version": "1.2", host: "x", ...headers }));
    ws.onmessage = (m) => {
      const f = String(m.data); out.frames.push(f.split("\n")[0]);
      if (f.startsWith("CONNECTED") && out.onConnected) out.onConnected(ws);
      if (f.startsWith("ERROR")) { clearTimeout(t); resolve(out); }
    };
    ws.onerror = () => { out.error = true; };
    ws.onclose = () => { out.closed = true; clearTimeout(t); resolve(out); };
    out.ws = ws;
    out.setHandler = (fn) => (out.onConnected = fn);
  });
}

const res = [];
const rec = (name, ok, detail) => { res.push(ok); console.log((ok ? "PASS " : "FAIL ") + name + (detail ? "  (" + detail + ")" : "")); };

// 1. no token
let s = await session({}, "no token");
rec("WebSocket CONNECT without a token is rejected", !s.frames.includes("CONNECTED"), "frames: " + (s.frames.join(",") || "closed/none"));

// 2. garbage token
s = await session({ Authorization: "Bearer abc.def.ghi" }, "bad token");
rec("WebSocket CONNECT with a fake token is rejected", !s.frames.includes("CONNECTED"), "frames: " + (s.frames.join(",") || "closed/none"));

// 3. valid token, subscribe to conversation we are not part of
const tok = await login(user, pw);
await new Promise((resolve) => {
  const ws = new WebSocket(BE.replace("https", "wss") + "/ws");
  const seen = [];
  const t = setTimeout(() => { try { ws.close(); } catch {} finish(); }, 12000);
  let done = false;
  function finish() {
    if (done) return; done = true; clearTimeout(t);
    rec("WebSocket CONNECT with a valid token works", seen.includes("CONNECTED"), "frames: " + seen.join(","));
    const afterSub = seen.slice(seen.indexOf("CONNECTED") + 1);
    rec("SUBSCRIBE to someone else's conversation topic is rejected", seen.includes("CONNECTED") && afterSub.includes("ERROR") && !afterSub.includes("MESSAGE"), "after subscribe: " + (afterSub.join(",") || "closed/none"));
    resolve();
  }
  ws.onopen = () => ws.send(frame("CONNECT", { "accept-version": "1.2", host: "x", Authorization: "Bearer " + tok }));
  ws.onmessage = (m) => {
    const f = String(m.data); seen.push(f.split("\n")[0]);
    if (f.startsWith("CONNECTED")) ws.send(frame("SUBSCRIBE", { id: "sub-0", destination: "/topic/conversations/1" }));
    if (f.startsWith("ERROR")) { try { ws.close(); } catch {} finish(); }
  };
  ws.onclose = () => finish();
  ws.onerror = () => {};
});
const bad = res.filter((x) => !x).length;
console.log(`WS summary: PASS ${res.length - bad} FAIL ${bad}`);
process.exit(0);

