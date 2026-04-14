# Server Architecture

## Option A: Layered Monolith (implemented now)

This is best for your current stage: fast to build, easy to debug.

```text
server/
  generating/
    generate.js             # for printing keys and ETH adress on CLI
  src/
    index.js                # bootstraps server and seeds state
    app.js                  # express app + middleware + global error handling
    routes/
      index.js              # HTTP endpoints (/balance, /send)
    validation/
      transfer.js           # request shape + type validation
    services/
      transactions.js       # business rules (nonce + balance updates)
    crypto/
      index.js              # hash, recover pubkey, verify signature, derive address
    state/
      store.js              # in-memory balances and nonce tracking
    utils/
      errors.js             # HTTP-aware error helper
```

Why this works:

- `routes` handle transport details.
- `validation` protects the service boundary.
- `services` own all critical state transitions.
- `crypto` is isolated and testable.

## Option B: Scalable Domain Modules (next evolution)

When you add persistence and multiple transaction types:

```text
server/
  generating/
    address.generate.js
  src/
    modules/
      accounts/
        account.controller.js
        account.service.js
        account.repository.js
      transactions/
        tx.controller.js
        tx.service.js
        tx.repository.js
        tx.crypto.js
    infrastructure/
      db/
      cache/
    shared/
      middleware/
      errors/
```

