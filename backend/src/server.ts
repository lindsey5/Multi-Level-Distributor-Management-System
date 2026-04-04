import express from "express";
import connectDB from "./config/db";
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import authRoutes from "./routes/authRoutes";
import distributorStockRoutes from "./routes/distributorStockRoutes";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  methods: ['*'],
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded());

app.use('/api/auth', authRoutes);
app.use('/api/stocks', distributorStockRoutes);

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});