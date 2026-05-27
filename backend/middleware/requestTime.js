/**
 * Request timing middleware.
 * Attaches start time to request and adds X-Response-Time header.
 */
const requestTime = (req, res, next) => {
  req.requestTime = new Date().toISOString();
  const start = process.hrtime();

  const originalWriteHead = res.writeHead;
  res.writeHead = function (...args) {
    const diff = process.hrtime(start);
    const time = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(2);
    res.setHeader('X-Response-Time', `${time}ms`);
    return originalWriteHead.apply(this, args);
  };

  next();
};

module.exports = requestTime;

