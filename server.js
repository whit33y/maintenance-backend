import express from "express";
import dotenv from "dotenv";
import maintenance from "./routes/maintenance.js";
import categories from "./routes/categories.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }))

const PORT = process.env.PORT || 3000;

//Routes
app.use('/api/maintenance', maintenance);
app.use('/api/categories', categories);

app.listen(PORT, () => {
    console.log(`Serwer działa na http://localhost:${PORT}`);
});