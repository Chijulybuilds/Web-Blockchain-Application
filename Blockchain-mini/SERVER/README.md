# Verifund Server

## Project overview

The server powers wallet balance lookup and transfers for Verifund.

This repository includes **two backend modes**:

1. **Simple mode** (`SERVER/index.js`)
   - Uses an in-memory `balances` object.
   - Uses private keys as account identifiers.
   - Accepts `{ sender, recipient, amount }`.
   - Best for quick demos and manual tests.

2. **Secure mode** (`SERVER/src/index.js`)
   - Verifies signed transactions.
   - Recovers public key and derives sender address.
   - Validates nonce replay protection.
   - Better representation of blockchain-style validation.

Default port is `3042` for both modes.

## Prerequisites

- Node.js 18+ (Node 20+ recommended)
- npm

## Folder highlights

```text
SERVER/
  index.js                # simple mode server
  src/
    index.js              # secure mode bootstrap
    app.js                # middleware + route wiring
    routes/index.js       # /balance, /send endpoints
    services/transactions.js
    validation/transfer.js
    crypto/index.js
    state/store.js
```

## Setup (step by step)

1. Open terminal in project root.
2. Navigate to server:
   - `cd SERVER`
3. Install dependencies:
   - `npm install`

## Run the server

### Option A: Simple mode (private-key keyed balances)

1. Start:
   - `npm run dev:simple`
2. Server runs from `SERVER/index.js` on `http://localhost:3042`.
3. Expected payload for transfer:
   - `POST /send`
   - body: `{ "sender": "<64-hex-private-key>", "recipient": "<64-hex-private-key>", "amount": 10 }`

### Option B: Secure mode (signed transactions)

1. Start:
   - `npm run dev`
2. Server runs from `SERVER/src/index.js` on `http://localhost:3042`.
3. Expected payload for transfer:
   - `POST /send`
   - body includes `message`, `hash`, `signature`, `recoveryBit`

## API endpoints

### Common

- `GET /balance/:accountKeyOrAddress`
  - Simple mode: expects a 64-hex private key
  - Secure mode: expects a wallet address

### Secure mode only

- `GET /health`

## Quick test flow (simple mode)

1. Run `npm run dev:simple`.
2. Query seeded balance:
   - `GET http://localhost:3042/balance/0aabc05bfca6734422d1936fef5370a1cca3a745b906106083c570d5f9d0a9fe`
3. Send funds:
   - `POST http://localhost:3042/send`
   - Body:
     ```json
     {
       "sender": "0aabc05bfca6734422d1936fef5370a1cca3a745b906106083c570d5f9d0a9fe",
       "recipient": "a41a2e52805ae0df8b996431a3f779826bd38af630d5401f9b68630f14281ba6",
       "amount": 5
     }
     ```

## Common troubleshooting

1. **Port already in use (`EADDRINUSE`)**
   - Another process is using `3042`.
   - Stop old process and restart selected mode.

2. **UI shows balance `0` unexpectedly**
   - Wrong mode may be running (`dev` vs `dev:simple`).
   - Ensure UI mode matches server mode.

3. **Transfer fails with generic network error**
   - Confirm UI is pointing to the same port as server (`3042` by default).
   - Confirm server is actually running.

## Related docs

- Architecture: [ARCHITECTURE.md](./ARCHITECTURE.md)
