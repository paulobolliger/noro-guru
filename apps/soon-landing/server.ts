import express from "express";
import path from "path";
import dotenv from "dotenv";
import chatHandler from "./api/chat.js";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3009;

  app.use(express.json());

  app.get("/api/health", (_req, res) => {
    res.status(200).json({ status: "ok" });
  });

  // Gemini API Endpoint - uses the Vercel Serverless handler
  app.post("/api/chat", chatHandler as any);


  // Setup Vite & static assets rendering using middleware patterns
  if (process.env.NODE_ENV !== "production") {
    // Import dinamico: vite e devDependency, removida em producao por
    // `npm prune --omit=dev`. Um import estatico no topo do arquivo seria
    // sempre executado pelo esbuild (--packages=external vira require()
    // incondicional), mesmo so sendo usado aqui dentro do bloco de dev.
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
