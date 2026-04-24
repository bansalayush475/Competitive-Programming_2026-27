// routes/calculate.js
// ─────────────────────────────────────────────────────────────────────────────
// All /api/* route handlers
// ─────────────────────────────────────────────────────────────────────────────

'use strict';

const express        = require('express');
const router         = express.Router();
const { calculate }  = require('../src/calculator');

// ── In-memory history (last 20) ───────────────────────────────────────────────
const history    = [];
const MAX_HISTORY = 20;

// ── POST /api/calculate ───────────────────────────────────────────────────────
router.post('/calculate', (req, res) => {
  const { expression } = req.body;

  if (!expression || typeof expression !== 'string') {
    return res.status(400).json({ success: false, error: 'Missing or invalid "expression" field.' });
  }
  if (expression.trim().length === 0) {
    return res.status(400).json({ success: false, error: 'Expression cannot be empty.' });
  }
  if (expression.length > 500) {
    return res.status(400).json({ success: false, error: 'Expression too long (max 500 chars).' });
  }

  try {
    const data = calculate(expression.trim());

    // Save to history
    history.unshift({ id: Date.now(), expression: data.expression, result: data.result, timestamp: new Date().toISOString() });
    if (history.length > MAX_HISTORY) history.pop();

    return res.json({ success: true, ...data });

  } catch (err) {
    return res.status(422).json({ success: false, error: err.message });
  }
});

// ── GET /api/history ──────────────────────────────────────────────────────────
router.get('/history', (_req, res) => {
  res.json({ success: true, count: history.length, history });
});

// ── DELETE /api/history ───────────────────────────────────────────────────────
router.delete('/history', (_req, res) => {
  history.length = 0;
  res.json({ success: true, message: 'History cleared.' });
});

module.exports = router;
