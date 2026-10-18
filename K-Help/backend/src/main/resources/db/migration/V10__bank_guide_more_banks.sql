-- V10: list more banks in the "Opening a Korean Bank Account" guide.
-- The app turns each bank name in guide text into a link to its official site.

UPDATE guides
SET content = REPLACE(
        content,
        E'- Hana Bank\n',
        E'- Hana Bank\n'
        '- NH NongHyup Bank\n'
        '- IBK Industrial Bank of Korea\n'
        '- SC First Bank\n'
        '- Post Office Bank (Korea Post bank)\n'
        '- KakaoBank, Toss Bank and K bank (internet-only, app-based)\n')
WHERE title = 'Opening a Korean Bank Account'
  AND content LIKE E'%- Hana Bank\n%'
  AND content NOT LIKE '%NH NongHyup Bank%';
