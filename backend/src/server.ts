import express from "express";
import connectDB from "./config/db";
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import authRoutes from "./routes/authRoutes";
import distributorStockRoutes from "./routes/distributorStockRoutes";
import distributorNotificationRoutes from "./routes/distributorNotificationRoutes";
import distributorSaleRoutes from "./routes/distributorSaleRoutes";
import stockTransferRoutes from "./routes/stockTransferRoutes";
import distributorRoutes from "./routes/distributorRoutes";
import commissionLogRoutes from "./routes/commissionLogRoutes";
import returnRequestRoutes from "./routes/returnRequestRoutes";
import stockOrderRoutes from "./routes/stockOrderRoutes";
import sponsoredItemRoutes from "./routes/sponsoredItemRoutes";
import withdrawaRequestRoutes from "./routes/withdrawalRequestRoutes";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const origin = process.env.ORIGIN || 'http://localhost:5173';

app.use(cors({
  origin,
  methods: ['*'],
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded());

app.get('/', (_, res) => res.send('Welcome'));
app.use('/api/auth', authRoutes);
app.use('/api/distributors', distributorRoutes);
app.use('/api/stocks', distributorStockRoutes);
app.use('/api/distributor-notifications', distributorNotificationRoutes);
app.use('/api/distributor-sales', distributorSaleRoutes);
app.use('/api/stock-transfer-logs', stockTransferRoutes);
app.use('/api/commission-logs', commissionLogRoutes);
app.use('/api/return-requests', returnRequestRoutes);
app.use('/api/stock-orders', stockOrderRoutes);
app.use('/api/sponsored-items', sponsoredItemRoutes);
app.use('/api/withdrawal-requests', withdrawaRequestRoutes);

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});