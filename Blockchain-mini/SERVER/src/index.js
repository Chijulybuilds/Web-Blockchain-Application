import app from "./app.js";
import { PORT } from "./config.js";
import { loadSeedBalancesFromEnv } from "./state/store.js";

loadSeedBalancesFromEnv();

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
