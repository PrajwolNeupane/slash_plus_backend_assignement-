import express from 'express';
import cors from 'cors';
import dbConfig from './config/dbConfig.js';
import auth from './routes/auth.js'

const port = 3000;
const app = express();
app.use(
    cors({
        origin: [
            process.env.CLIENT_URL, ,
            process.env.LIVE_CLIENT_URL,
        ],
        credentials: true,
    })
);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "Working Fine"
    })
});

app.use("/auth", auth);

app.listen(port, async () => {
    console.log("---------------------------");
    console.log(`Server is listening at ${port}`);
    await dbConfig;
});