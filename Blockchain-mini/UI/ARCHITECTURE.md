# UI Architecture

## Overview

The UI is a small React single-page application organized around two feature components:

1. `Wallet` for identity + balance view.
2. `Transfer` for sending transactions.

`App` coordinates shared state between them.

## High-level flow

1. User generates or pastes a private key in `Wallet`.
2. `Wallet` derives:
   - Public key
   - Ethereum-style address
3. `Wallet` fetches balance from backend.
4. `Transfer` reads the same private key from parent (`App`) and builds payload.
5. `Transfer` sends request to backend and reports status.

## Component tree

```text
App
├─ Wallet
└─ Transfer
```

## File structure

```text
UI/
  src/
    App.jsx               # top-level state + composition
    Wallet.jsx            # key generation/entry + derived identity + balance fetch
    Transfer.jsx          # transfer form + mode-based payload creation
    utils/
      crypto.js           # signing, hashing, key derivation helpers
    styles.css            # shared styling
    main.jsx              # React bootstrap
```

## State ownership

### App-level state

- `privateKey`
- `address`

Why:

- `Wallet` sets these values.
- `Transfer` consumes `privateKey`.

### Wallet local state

- `publicKeyHex`
- `balance`

### Transfer local state

- `recipient`
- `amount`
- `status`
- `loading`
- `useSimpleMode`

## API integration

Both `Wallet` and `Transfer` use:

- `API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3042"`

### Wallet requests

- `GET /balance/:privateKey` 
# (Although using privateKey not secure, but just used for the sake of this project)

### Transfer requests

- `POST /send`

Payload depends on mode:

1. Simple mode (`useSimpleMode = true`)
   - `{ sender, recipient, amount }`
2. Secure mode (`useSimpleMode = false`)
   - `{ message, hash, signature, recoveryBit }`

## Validation behavior

### Wallet

- Normalizes private key input:
  - trims spaces
  - removes `0x`
  - lowercases
- Derives identity only when key matches 64-hex pattern.

### Transfer

- Ensures required fields and positive numeric amount.
- In simple mode:
  - validates sender/recipient as 64-hex private keys.
- In secure mode:
  - signs hashed message with current private key.

## Error handling

- Transfer catches network/runtime errors and displays readable status.
- Non-JSON backend responses are also handled safely.

## Styling

- Single stylesheet (`styles.css`) with shared variables and utility classes.
- Form controls and mode toggle styles are centralized.

## Suggested Improvements

1. Replace full-page reload after transfer with local state refresh.
2. Add dedicated mode badge showing expected backend (`simple` vs `secure`).
3. Move API logic into a shared `api/` module.
4. Add unit tests for `normalizePrivateKey` and payload builders.
