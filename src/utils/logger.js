const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, colorize, errors } = format;
const { NODE_ENV } = require('../config/env');

// Formato personalizado para los logs
const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});

// Logger para desarrollo (más detallado y con colores)
const devLogger = createLogger({
  level: 'debug',
  format: combine(
    colorize(),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
    logFormat
  ),
  transports: [new transports.Console()]
});

// Logger para producción (solo errores y formato JSON)
const prodLogger = createLogger({
  level: 'info',
  format: combine(
    timestamp(),
    errors({ stack: true }),
    format.json()
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/combined.log' })
  ]
});

// Seleccionar el logger según el entorno
const logger = NODE_ENV === 'production' ? prodLogger : devLogger;

// Stream para morgan (logging de HTTP)
logger.stream = {
  write: (message) => {
    logger.info(message.trim());
  }
};

module.exports = logger;