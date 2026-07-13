import { serve } from "@hono/node-server";
import server from "./dist/server/server.js";

const port = Number(process.env.PORT) || 3000;

serve(
  {
    fetch: server.fetch,
    port,
  },
  (info) => {
    console.log(`Serveur CuisineEnsemble démarré sur le port ${info.port}`);
  },
);
