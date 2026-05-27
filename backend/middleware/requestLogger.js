const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, '..', 'logs', 'activity.json');

/**
 * Request logging middleware.
 * Logs method, URL, status, response time, and timestamp.
 */
const requestLogger = (req, res, next) => {
  const start = Date.now();

  // Override res.end to capture response info
  const originalEnd = res.end;
  res.end = function (...args) {
    const duration = Date.now() - start;
    const logEntry = {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      responseTime: `${duration}ms`,
      timestamp: new Date().toISOString(),
      ip: req.ip,
      userAgent: req.get('user-agent') || 'unknown',
    };

    console.log(
      `[${logEntry.timestamp}] ${logEntry.method} ${logEntry.url} ${logEntry.status} - ${logEntry.responseTime}`
    );

    // Append to log file (non-blocking)
    try {
      let logs = [];
      if (fs.existsSync(logFilePath)) {
        const data = fs.readFileSync(logFilePath, 'utf8');
        logs = JSON.parse(data || '[]');
      }
      logs.push(logEntry);
      // Keep only last 1000 entries
      if (logs.length > 1000) logs = logs.slice(-1000);
      fs.writeFileSync(logFilePath, JSON.stringify(logs, null, 2));
    } catch (e) {
      // Silent fail for logging
    }

    originalEnd.apply(res, args);
  };

  next();
};

module.exports = requestLogger;
