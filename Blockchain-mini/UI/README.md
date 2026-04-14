# Verifund UI

## Project overview

The UI is a React + Vite frontend for:

1. Creating or entering a private key.
2. Deriving and showing public key + Ethereum-style address.
3. Fetching account balance from the backend.
4. Sending transactions in either:
   - **Simple mode** (private-key based transfer payload), or
   - **Secure mode** (signed payload with hash/signature/recovery bit).

## Tech stack

- React
- Vite
- `ethereum-cryptography`
- Plain CSS (`src/styles.css`)

## Prerequisites

- Node.js 18+ (Node 20+ recommended)
- npm

## Setup (step by step)

1. Open terminal in project root.
2. Go to UI folder:
   - `cd UI`
3. Install dependencies:
   - `npm install`

## Configure API URL (optional)

By default, UI calls:

- `http://localhost:3042`

You can override using:

- `VITE_API_URL`

Example:

```bash
set VITE_API_URL=http://localhost:3042
```

## Run the UI

1. cd UI on terminal
2. Start dev server:
   - `npm run dev`
3. Open the printed local URL in browser.

## Step-by-step usage

1. Start backend first.
   - Simple backend: `cd SERVER && npm run dev:simple`
   - Secure backend: `cd SERVER && npm run dev`
2. Open UI.
3. In Wallet panel:
   - Click **Generate New Wallet** or paste a private key.
   - Balance auto-fetches after key is valid.
4. In Transfer panel:
   - Turn **Simple Server Mode** ON if using `SERVER/index.js`.
   - Leave it OFF if using secure `SERVER/src/index.js`.
   - Enter recipient + amount.
   - Submit.

## Mode compatibility

### Simple mode ON

- UI sends:
  - `{ sender, recipient, amount }`
- Expects backend:
  - `SERVER/index.js` (`npm run dev:simple`)
- Recipient must be a valid 64-char private key.

### Simple mode OFF (secure mode)

- UI sends:
  - `{ message, hash, signature, recoveryBit }`
- Expects backend:
  - `SERVER/src/index.js` (`npm run dev`)

## Important files

- App root: `src/App.jsx`
- Wallet logic: `src/Wallet.jsx`
- Transfer logic: `src/Transfer.jsx`
- Crypto helpers: `src/utils/crypto.js`
- Styling: `src/styles.css`

## Build

```bash
npm run build
npm run preview
```

## Troubleshooting

1. **Balance remains zero**
   - Ensure backend mode matches UI mode.
   - Confirm backend is running on same URL/port as UI expects.

2. **Transaction shows network error**
   - Check backend process is running.
   - Check `VITE_API_URL` or default `3042`.

3. **Transaction rejected**
   - Simple mode: verify sender/recipient private keys are valid.
   - Secure mode: ensure private key is valid and backend secure mode is running.

## Related docs

- UI architecture: [ARCHITECTURE.md](./ARCHITECTURE.md)
