import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { v2 as cloudinary } from "cloudinary";

const app = express();
app.use(cors());
app.use(bodyParser.json());

cloudinary.config({
  cloud_name: "dfkvrl2y9",
  api_key: "912984363912667",
  api_secret: "-2MvCaZCwmoqMz4ngfKMaoxc1xg",
});


app.post("/delete-image", async (req, res) => {
  try {
    const { public_id } = req.body;
    if (!public_id)
      return res.status(400).json({ error: "public_id é obrigatório" });

    const result = await cloudinary.uploader.destroy(public_id);
    return res.json(result);
  } catch (error) {
    console.error("Erro ao deletar imagem:", error);
    res.status(500).json({ error: "Erro interno ao deletar" });
  }
});

const PORT = 4000;
app.listen(PORT, () =>
  console.log(`Servidor rodando em http://localhost:${PORT}`)
);
