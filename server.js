import "dotenv/config";
import express from "express";
import path from "path";
import routes from "./routes/index.js";
import rateLimit from "express-rate-limit";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger.json" assert { type: 'json' };

const app = express();
const PORT = process.env.PORT || 3000;

// Set up rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use(limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(routes);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Serve index.html file
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => console.log(`Server is Running on ${PORT}`));
