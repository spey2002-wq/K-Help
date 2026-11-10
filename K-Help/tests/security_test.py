"""K-Help API security test suite (121 checks).

Usage:  python security_test.py            (tests the live deployment)
        KHELP_API=http://localhost:8080 KHELP_WEB=http://localhost:3000 python security_test.py

Creates ONE throw-away normal user (sectest_xxxxxx) and removes the posts it creates.
It never brute-forces the sample account: the rate-limit test uses a non-existent username.
"""
import base64, json, os, random, string, sys, urllib.request, urllib.error, urllib.parse

BE = os.environ.get("KHELP_API", "https://khelp-backend-7eqm.onrender.com").rstrip("/")
FE = os.environ.get("KHELP_WEB", "https://k-help.vercel.app").rstrip("/")
results = []


def call(method, url, body=None, token=None, headers=None, raw=False):
    h = {"Accept": "application/json"}
    data = None
    if body is not None:
        data = body if isinstance(body, bytes) else json.dumps(body).encode()
        h["Content-Type"] = "application/json"
    if token:
        h["Authorization"] = "Bearer " + token
    if headers:
        h.update(headers)
    req = urllib.request.Request(url, data=data, method=method, headers=h)
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            txt = r.read().decode("utf-8", "replace")
            return r.status, txt, dict(r.headers)
    except urllib.error.HTTPError as e:
        txt = e.read().decode("utf-8", "replace")
        return e.code, txt, dict(e.headers)


def js(t):
    try:
        return json.loads(t)
    except Exception:
        return {}


def check(group, name, ok, detail=""):
    ok = bool(ok)
    results.append((group, name, ok, detail))
    print(("PASS " if ok else "FAIL ") + f"[{group}] {name}" + (f"  ({detail})" if detail else ""), flush=True)


def info(group, name, detail):
    results.append((group, name, None, detail))
    print(f"INFO [{group}] {name}  ({detail})", flush=True)


def login(u, p):
    s, t, _ = call("POST", BE + "/api/auth/login", {"username": u, "password": p})
    return (js(t).get("data") or {}).get("accessToken") if s == 200 else None


def b64(d):
    return base64.urlsafe_b64encode(d).rstrip(b"=").decode()


def payload(tok):
    p = tok.split(".")[1]
    p += "=" * (-len(p) % 4)
    return json.loads(base64.urlsafe_b64decode(p))


# ---------------------------------------------------------------- setup
rnd = "".join(random.choices(string.ascii_lowercase + string.digits, k=6))
uname = "sectest_" + rnd
pw = "SecTest#" + rnd + "9"
A = login("ashish", "User@123")
check("setup", "sample member can log in", bool(A))
# register test user, trying to smuggle role=ADMIN
s, t, _ = call("POST", BE + "/api/auth/register", {"username": uname, "email": uname + "@example.com", "password": pw, "role": "ADMIN", "roles": ["ADMIN"]})
reg = js(t).get("data") or {}
role_txt = json.dumps(reg).upper()
check("privilege", "register with role=ADMIN in body creates a normal USER", s in (200, 201) and '"ADMIN"' not in role_txt.replace('"ROLE": "USER"', ''), f"status {s}")
B = login(uname, pw)
check("setup", "test user can log in", bool(B))
if not (A and B):
    print("cannot continue"); sys.exit(1)

# ---------------------------------------------------------------- unauthenticated writes
G = "unauthenticated"
for m, p in [("POST", "/api/posts"), ("POST", "/api/jobs"), ("POST", "/api/housing"), ("POST", "/api/guides"),
             ("POST", "/api/ai/translate"), ("POST", "/api/chat/conversations"), ("POST", "/api/posts/reports"),
             ("PUT", "/api/posts/999999999"), ("DELETE", "/api/posts/999999999"), ("DELETE", "/api/jobs/999999999"),
             ("DELETE", "/api/housing/999999999"), ("DELETE", "/api/guides/999999999"), ("POST", "/api/posts/999999999/like"),
             ("POST", "/api/jobs/999999999/applications"), ("PUT", "/api/auth/me")]:
    s, _, _ = call(m, BE + p, {})
    check(G, f"{m} {p} without token is rejected", s in (401, 403), f"status {s}")
for p in ["/api/auth/me", "/api/profile", "/api/chat/conversations", "/api/jobs/applications/me", "/api/housing/inquiries/me",
          "/api/jobs/1/applications", "/api/housing/1/inquiries", "/api/admin/stats", "/api/admin/users", "/api/admin/reports"]:
    s, _, _ = call("GET", BE + p)
    check(G, f"GET {p} without token is rejected", s in (401, 403), f"status {s}")

# ---------------------------------------------------------------- admin / privilege escalation
G = "admin"
for m, p in [("GET", "/api/admin/stats"), ("GET", "/api/admin/users"), ("GET", "/api/admin/jobs/pending"),
             ("GET", "/api/admin/housing/pending"), ("GET", "/api/admin/reports"),
             ("PUT", "/api/admin/users/999999999"), ("PUT", "/api/admin/jobs/999999999/approval"),
             ("PUT", "/api/admin/reports/999999999")]:
    for who, tok in (("normal user", B), ("sample member", A)):
        s, _, _ = call(m, BE + p, {} if m == "PUT" else None, tok)
        check(G, f"{who}: {m} {p} is forbidden", s == 403, f"status {s}")
s, t, _ = call("PUT", BE + "/api/auth/me", {"fullName": "Sec Test", "role": "ADMIN"}, B)
s2, t2, _ = call("GET", BE + "/api/auth/me", None, B)
me = json.dumps(js(t2).get("data") or {}).upper()
check("privilege", "profile update cannot change role", '"ADMIN"' not in me, f"status {s}")
s, _, _ = call("GET", BE + "/api/admin/stats", None, B)
check("privilege", "after profile update, user still cannot reach admin API", s == 403, f"status {s}")
check("privilege", "token claims do not contain ADMIN for normal user", "ADMIN" not in json.dumps(payload(B)).upper(), "")

# ---------------------------------------------------------------- ownership / IDOR
G = "ownership"
s, t, _ = call("POST", BE + "/api/posts", {"title": "sectest post " + rnd, "content": "owned by ashish", "category": "GENERAL"}, A)
pid = (js(t).get("data") or {}).get("id")
check(G, "member can create own post", s in (200, 201) and pid, f"status {s}")
if pid:
    s, _, _ = call("PUT", BE + f"/api/posts/{pid}", {"title": "hacked", "content": "hacked", "category": "GENERAL"}, B)
    check(G, "other user cannot edit someone else's post", s in (403, 404), f"status {s}")
    s, _, _ = call("DELETE", BE + f"/api/posts/{pid}", None, B)
    check(G, "other user cannot delete someone else's post", s in (403, 404), f"status {s}")
    s, t, _ = call("GET", BE + f"/api/posts/{pid}")
    check(G, "post is unchanged after attack attempts", "hacked" not in t, "")
    s, _, _ = call("DELETE", BE + f"/api/posts/{pid}", None, A)
    check(G, "owner can delete own post (cleanup)", s in (200, 204), f"status {s}")
# a job and a housing listing from the public lists
s, t, _ = call("GET", BE + "/api/jobs?size=5")
jobs = (js(t).get("data") or {}).get("content") or []
if jobs:
    jid = jobs[0]["id"]
    s, _, _ = call("GET", BE + f"/api/jobs/{jid}/applications", None, B)
    check(G, "non-owner cannot list applicants of a job", s in (403, 404), f"status {s}")
    s, _, _ = call("PUT", BE + f"/api/jobs/{jid}", {"title": "hacked"}, B)
    check(G, "non-owner cannot edit someone else's job", s in (400, 403, 404), f"status {s}")
    s, _, _ = call("DELETE", BE + f"/api/jobs/{jid}", None, B)
    check(G, "non-owner cannot delete someone else's job", s in (403, 404), f"status {s}")
s, t, _ = call("GET", BE + "/api/housing?size=5")
hs = (js(t).get("data") or {}).get("content") or []
if hs:
    hid = hs[0]["id"]
    s, _, _ = call("GET", BE + f"/api/housing/{hid}/inquiries", None, B)
    check(G, "non-owner cannot read inquiries of a listing", s in (403, 404), f"status {s}")
    s, _, _ = call("PUT", BE + f"/api/housing/{hid}", {"title": "hacked"}, B)
    check(G, "non-owner cannot edit someone else's listing", s in (400, 403, 404), f"status {s}")
    s, _, _ = call("DELETE", BE + f"/api/housing/{hid}", None, B)
    check(G, "non-owner cannot delete someone else's listing", s in (403, 404), f"status {s}")
leak = 0
for cid in range(1, 31):
    s, _, _ = call("GET", BE + f"/api/chat/conversations/{cid}/messages", None, B)
    if s == 200:
        leak += 1
check(G, "test user cannot read any conversation they are not part of (ids 1-30)", leak == 0, f"{leak} readable")
s, _, _ = call("POST", BE + "/api/chat/conversations/1/messages", {"content": "intrusion"}, B)
check(G, "test user cannot post into someone else's conversation", s in (400, 403, 404), f"status {s}")
s, t, _ = call("GET", BE + "/api/jobs/applications/me", None, B)
check(G, "'my applications' only returns the caller's data (new user = empty)", s == 200 and not ((js(t).get("data") or {}).get("content") if isinstance(js(t).get("data"), dict) else js(t).get("data")), f"status {s}")

# ---------------------------------------------------------------- token tampering
G = "tokens"
hdr, pay, sig = B.split(".")
forged = payload(B); forged["sub"] = "admin"
none_tok = b64(json.dumps({"alg": "none", "typ": "JWT"}).encode()) + "." + b64(json.dumps(forged).encode()) + "."
bad_sig = hdr + "." + b64(json.dumps(forged).encode()) + "." + sig
flipped = B[:-3] + ("AAA" if B[-3:] != "AAA" else "BBB")
for name, tok in [("random garbage", "abc.def.ghi"), ("alg=none forged admin token", none_tok), ("payload edited, old signature", bad_sig), ("signature altered", flipped)]:
    s, _, _ = call("GET", BE + "/api/auth/me", None, tok)
    check(G, f"{name} is rejected", s in (401, 403), f"status {s}")
    s, _, _ = call("GET", BE + "/api/admin/stats", None, tok)
    check(G, f"{name} cannot reach admin API", s in (401, 403), f"status {s}")
s, _, _ = call("POST", BE + "/api/auth/refresh", {"refreshToken": "garbage"})
check(G, "bogus refresh token is rejected", s in (400, 401, 403), f"status {s}")
s, _, _ = call("GET", BE + "/api/auth/me", None, headers={"Authorization": B})
check(G, "token without 'Bearer ' prefix is rejected", s in (401, 403), f"status {s}")

# ---------------------------------------------------------------- input handling
G = "input"
for name, path in [("SQL injection in guide search", "/api/guides?search=" + urllib.parse.quote("' OR '1'='1' --")),
                   ("SQL injection in job keyword", "/api/jobs?keyword=" + urllib.parse.quote("'; DROP TABLE users;--")),
                   ("SQL injection in housing search", "/api/housing?keyword=" + urllib.parse.quote("1 UNION SELECT password FROM users")),
                   ("oversized page size", "/api/jobs?size=1000000"), ("negative page", "/api/jobs?page=-5"),
                   ("non-numeric id", "/api/posts/abc"), ("very long query", "/api/guides?search=" + "A" * 5000)]:
    s, t, _ = call("GET", BE + path)
    check(G, f"{name}: no server error", s < 500, f"status {s}")
    check(G, f"{name}: no stack trace in response", not any(k in t for k in ("at com.", "java.lang", "org.springframework", "SQLException", "Hibernate")), "")
s, t, _ = call("POST", BE + "/api/auth/login", b"{not valid json")
check(G, "malformed JSON -> clean 400, no stack trace", s == 400 and "at com." not in t and "Exception" not in t, f"status {s}")
s, t, _ = call("POST", BE + "/api/auth/register", {"username": "x" + rnd, "email": "x" + rnd + "@example.com", "password": "short1"})
check(G, "weak password (<8 chars) is rejected", s == 400, f"status {s}")
s, t, _ = call("POST", BE + "/api/auth/register", {"username": "ashish", "email": "dup" + rnd + "@example.com", "password": "LongEnough#1"})
check(G, "duplicate username is rejected", s in (400, 409), f"status {s}")
s, t, _ = call("GET", BE + "/api/guides?size=100000")
d = js(t).get("data")
n = len(d.get("content", [])) if isinstance(d, dict) else (len(d) if isinstance(d, list) else -1)
info(G, "returned items for size=100000", f"{n} (shows whether the server caps page size)")
s, t, _ = call("POST", BE + "/api/posts", {"title": "<script>alert(1)</script>", "content": "<img src=x onerror=alert(1)>", "category": "GENERAL"}, B)
xid = (js(t).get("data") or {}).get("id")
info("xss", "API stores HTML text as plain data", f"status {s}; React escapes it on the page, so it renders as text. Verify visually if you want.")
if xid:
    call("DELETE", BE + f"/api/posts/{xid}", None, B)

# ---------------------------------------------------------------- information disclosure
G = "disclosure"
for p in ["/actuator/env", "/actuator/beans", "/actuator/heapdump", "/actuator/metrics", "/actuator/mappings", "/actuator/configprops",
          "/v3/api-docs", "/swagger-ui/index.html", "/swagger-ui.html", "/h2-console", "/.env", "/.git/config", "/api/admin"]:
    s, t, _ = call("GET", BE + p)
    check(G, f"{p} is not exposed", s in (401, 403, 404, 405), f"status {s}")
s, t, _ = call("GET", BE + "/actuator/health")
check(G, "health endpoint shows only the status (no DB details)", "jdbc" not in t.lower() and "postgres" not in t.lower() and "diskSpace" not in t, t[:80])
s, t, h = call("POST", BE + "/api/auth/login", {"username": "nobody_" + rnd, "password": "x" * 10})
s2, t2, _ = call("POST", BE + "/api/auth/login", {"username": "ashish", "password": "wrong-password-1"})
check(G, "wrong user and wrong password give the same message (no user enumeration)", js(t).get("message") == js(t2).get("message"), f"{js(t).get('message')!r} vs {js(t2).get('message')!r}")
for p in ["/api/guides?size=1"]:
    s, t, h = call("GET", BE + p)
    check(G, "responses do not reveal server software", "server" not in {k.lower() for k in h} or "spring" not in h.get("Server", "").lower(), h.get("Server", ""))

# ---------------------------------------------------------------- CORS
G = "cors"
s, t, h = call("OPTIONS", BE + "/api/auth/login", headers={"Origin": "https://evil.example", "Access-Control-Request-Method": "POST", "Access-Control-Request-Headers": "content-type"})
acao = {k.lower(): v for k, v in h.items()}.get("access-control-allow-origin", "")
check(G, "foreign origin is not allowed", acao not in ("*", "https://evil.example"), f"status {s}, allow-origin={acao!r}")
s, t, h = call("OPTIONS", BE + "/api/auth/login", headers={"Origin": FE, "Access-Control-Request-Method": "POST", "Access-Control-Request-Headers": "content-type"})
acao = {k.lower(): v for k, v in h.items()}.get("access-control-allow-origin", "")
check(G, "the real frontend origin is allowed", acao == FE, f"allow-origin={acao!r}")

# ---------------------------------------------------------------- headers
for label, url in (("frontend", FE + "/"), ("backend", BE + "/api/guides?size=1")):
    s, t, h = call("GET", url)
    hl = {k.lower(): v for k, v in h.items()}
    for key, want in [("strict-transport-security", "HTTPS only (HSTS)"), ("x-content-type-options", "nosniff"), ("x-frame-options", "clickjacking protection"),
                      ("content-security-policy", "CSP"), ("referrer-policy", "referrer policy")]:
        present = key in hl
        if key == "x-frame-options" and "content-security-policy" in hl and "frame-ancestors" in hl["content-security-policy"]:
            present = True
        if present:
            check("headers", f"{label}: {key} present", True)
        else:
            info("headers", f"{label}: {key} missing", want + " (hardening suggestion, not a break-in)")

# ---------------------------------------------------------------- brute-force protection (non-existent user only)
G = "rate-limit"
codes = []
for i in range(8):
    s, _, _ = call("POST", BE + "/api/auth/login", {"username": "ratelimit_" + rnd, "password": "wrong-password-" + str(i)})
    codes.append(s)
check(G, "repeated failed logins get throttled (HTTP 429)", 429 in codes, f"codes {codes}")
s, _, _ = call("POST", BE + "/api/auth/login", {"username": "ashish", "password": "User@123"})
check(G, "sample member is NOT locked out by someone else's failures", s == 200, f"status {s}")

# ---------------------------------------------------------------- default credentials
G = "credentials"
for u, p in [("admin", "Admin@123"), ("admin", "admin"), ("admin", "password"), ("admin", "admin123")]:
    s, _, _ = call("POST", BE + "/api/auth/login", {"username": u, "password": p})
    check(G, f"default admin login {u}/{p} is rejected", s in (400, 401, 403, 429), f"status {s}")

# ---------------------------------------------------------------- summary
fails = [r for r in results if r[2] is False]
passes = [r for r in results if r[2] is True]
infos = [r for r in results if r[2] is None]
print("\n==== SUMMARY ====")
print(f"PASS {len(passes)}   FAIL {len(fails)}   INFO {len(infos)}")
for g, n, ok, d in fails:
    print(f"FAIL [{g}] {n} ({d})")
print(f"test account created: {uname} (normal USER)")
json.dump({"test_user": uname, "pass": len(passes), "fail": len(fails), "info": len(infos),
           "failures": [[g, n, d] for g, n, ok, d in fails], "infos": [[g, n, d] for g, n, ok, d in infos]},
          open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "security_result.json"), "w"), indent=1)

