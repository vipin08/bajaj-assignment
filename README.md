# BFHL — Full Stack Test

A REST API (`POST /bfhl`) built with **Node + Express** and **vanilla HTML/CSS/JS** only.

## Run locally

```bash
npm install        # or pnpm install
npm start          # starts http://localhost:3000
```

- Frontend: open `http://localhost:3000`
- API: `POST http://localhost:3000/bfhl`

## API

### `POST /bfhl`

Request body:

```json
{ "data": ["a", "1", "334", "4", "R", "$"] }
```

Response:

```json
{
  "is_success": true,
  "user_id": "vipin_sohal_11112004",
  "email": "vipin1589.be23@chitkarauniversity.edu.in",
  "roll_number": "2311981589",
  "odd_numbers": ["1"],
  "even_numbers": ["334", "4"],
  "alphabets": ["A", "R"],
  "special_characters": ["$"],
  "sum": "339",
  "concat_string": "Ra"
}
```

### `GET /bfhl`

Returns `{ "operation_code": 1 }`.

## Logic

- Numbers are returned as **strings**, split into odd/even.
- Alphabetic tokens are **uppercased**.
- Everything else is a **special character**.
- `sum` is a **string**.
- `concat_string` = all alphabetic characters from the input, **reversed**, in **alternating caps**.

## Structure

```
server.js        Express server (routes + static frontend + CORS)
bfhl.js          Core processing logic
public/          Frontend (index.html, styles.css, app.js)
```