import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import prisma from "./lib/prisma";
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "Mini ERP CRM API is running"
    });
});

const PORT = Number(process.env.PORT) || 8001;

const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
server.keepAliveTimeout = 120000;
server.headersTimeout = 125000;



app.get("/api/test-db", async (req, res) => {
    try {
        await prisma.$connect();

        res.json({
            success: true,
            message: "Database connected successfully"
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Database connection failed"
        });
    }
});