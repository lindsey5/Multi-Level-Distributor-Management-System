import express from "express";
import connectDB from "./config/db";
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import authRoutes from "./routes/authRoutes";
import distributorRoutes from "./routes/distributorRoutes";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: ['http://localhost:5173'],
  methods: ['*'],
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded());

app.use('/api/auth', authRoutes);
app.use('/api/distributors', distributorRoutes);

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});