import express from "express";
import { normalizeAddress, getBalance, getLastNonce } from "../state/store.js";
import { validateTransferPayload } from "../validation/transfer.js";
import { applySignedTransfer } from "../services/transactions.js";

const router = express.Router();

router.get("/balance/:address", (req, res, next) => {
  try {
    const address = normalizeAddress(req.params.address);
    res.send({
      address,
      balance: getBalance(address),
      lastNonce: getLastNonce(address),
    });
  } catch (error) {
    next(error);
  }
});

router.post("/send", (req, res, next) => {
  try {
    const payload = validateTransferPayload(req.body);
    const result = applySignedTransfer(payload);
    res.send(result);
  } catch (error) {
    next(error);
  }
});

export default router;
