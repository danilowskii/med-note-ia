import serve from "serve";

const port = process.env.PORT || 8000;
serve("dist", { port });

console.log(`Front-end rodando na porta ${port}`);
