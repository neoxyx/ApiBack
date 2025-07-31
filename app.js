const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { NODE_ENV } = require('./src/config/env');
const connectDB = require('./src/config/db');
const catsRoutes = require('./src/routes/cats.routes');
const imagesRoutes = require('./src/routes/images.routes');
const usersRoutes = require('./src/routes/users.routes');
const ApiError = require('./src/utils/apiError');
const errorHandler = require('./src/middleware/errorHandler');

class App {
  constructor() {
    this.app = express();
    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  setupMiddleware() {
    connectDB();
    this.app.use(helmet());
    this.app.use(cors());

    if (NODE_ENV !== 'test') {
      this.app.use(morgan('dev'));
    }

    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  setupRoutes() {
    this.app.use('/api/cats', catsRoutes);
    this.app.use('/api/images', imagesRoutes);
    this.app.use('/api/users', usersRoutes);

    this.app.get('/api/health', (req, res) => {
      res.json({ status: 'healthy' });
    });

    this.app.use('*', (req, res, next) => {
      next(new ApiError(404, 'Endpoint not found'));
    });
  }

  setupErrorHandling() {
    this.app.use(errorHandler);
  }
}

module.exports = new App().app;