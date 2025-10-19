require('dotenv').config();
require('express-async-errors');
const express = require('express');
const cors = require('cors');
const path = require('path');
const logger = require('./utils/logger');

const db = require('./models');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Routes
const adminAuthRoutes = require('./routes/adminAuthRoutes');
const adminRoutes = require('./routes/adminRoutes');
const publicRoutes = require('./routes/publicRoutes');

app.use('/api/admin/auth', adminAuthRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', publicRoutes);

// Health
app.get('/health', (req, res) => res.json({ ok: true }));

// Error handler
const errorHandler = require('./middlewares/errorHandler');
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
db.sequelize.authenticate().then(() => {
  logger.info('DB connected');
  app.listen(PORT, () => logger.info(`Server started on port ${PORT}`));
}).catch(err => {
  logger.error('DB connection error', err);
  process.exit(1);
});
