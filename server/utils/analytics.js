const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const logsDir = path.join(__dirname, "..", "logs");
const visitsLogPath = path.join(logsDir, "visits.log");

function ensureLogsDir() {
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }
}

function parseCookies(cookieHeader = "") {
  return cookieHeader.split(";").reduce((acc, part) => {
    const [rawKey, ...rest] = part.trim().split("=");
    if (!rawKey) return acc;
    acc[rawKey] = decodeURIComponent(rest.join("="));
    return acc;
  }, {});
}

function trackVisit(req, res, next) {
  if (req.path.startsWith("/api")) {
    return next();
  }

  ensureLogsDir();

  const cookies = parseCookies(req.headers.cookie || "");
  let visitorId = cookies.visitor_id;

  if (!visitorId) {
    visitorId = crypto.randomUUID();
    res.setHeader("Set-Cookie", `visitor_id=${visitorId}; Path=/; Max-Age=31536000; SameSite=Lax`);
  }

  const logEntry = {
    timestamp: new Date().toISOString(),
    visitorId,
    method: req.method,
    path: req.path,
    userAgent: req.headers["user-agent"] || ""
  };

  fs.appendFile(visitsLogPath, `${JSON.stringify(logEntry)}\n`, () => {});
  return next();
}

function getVisitStats() {
  ensureLogsDir();

  if (!fs.existsSync(visitsLogPath)) {
    return {
      totalVisits: 0,
      uniqueVisitors: 0,
      pageStats: []
    };
  }

  const lines = fs.readFileSync(visitsLogPath, "utf8")
    .split(/\r?\n/)
    .filter(Boolean);

  const visits = [];
  for (const line of lines) {
    try {
      visits.push(JSON.parse(line));
    } catch (_error) {
      // Skip malformed lines.
    }
  }

  const visitors = new Set();
  const pageMap = new Map();

  visits.forEach((visit) => {
    visitors.add(visit.visitorId);
    pageMap.set(visit.path, (pageMap.get(visit.path) || 0) + 1);
  });

  const pageStats = [...pageMap.entries()]
    .map(([pathName, count]) => ({ path: pathName, count }))
    .sort((a, b) => b.count - a.count);

  return {
    totalVisits: visits.length,
    uniqueVisitors: visitors.size,
    pageStats
  };
}

function getVisitLogEntries(limit = 50) {
  ensureLogsDir();

  if (!fs.existsSync(visitsLogPath)) {
    return [];
  }

  return fs.readFileSync(visitsLogPath, "utf8")
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => {
      try {
        return JSON.parse(line);
      } catch (_error) {
        return null;
      }
    })
    .filter(Boolean)
    .slice(-limit)
    .reverse();
}

module.exports = {
  trackVisit,
  getVisitStats,
  getVisitLogEntries
};
