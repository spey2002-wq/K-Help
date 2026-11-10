# K-Help automated tests

| File | What it checks | Run |
| --- | --- | --- |
| `security_test.py` | 121 API security checks: no-login writes, admin / role escalation, ownership (IDOR), forged tokens, input handling, information leaks, CORS, security headers, login rate limiting, default credentials | `python security_test.py` |
| `ws_test.mjs` | Chat WebSocket security: no token / fake token rejected, valid token connects, foreign conversation subscription rejected | `node ws_test.mjs <username> <password>` |
| `backend/src/test` | 9 JUnit unit tests (job filters, working days, image type check) | `cd backend && mvn test` |

By default the scripts test the live deployment. Point them at a local run with
`KHELP_API=http://localhost:8080 KHELP_WEB=http://localhost:3000`.
The security test creates one normal throw-away user (`sectest_xxxxxx`).

