// src/calculator.js
// ─────────────────────────────────────────────────────────────────────────────
// Pure DSA logic — no framework dependencies.
// Exports: Stack, tokenise, shuntingYard, evalPostfix, calculate
// ─────────────────────────────────────────────────────────────────────────────

'use strict';

// ── Stack data structure ──────────────────────────────────────────────────────
class Stack {
  constructor() {
    this.data = [];
  }

  push(val) {
    this.data.push(val);
    return val;
  }

  pop() {
    if (this.isEmpty()) throw new Error('Stack underflow');
    return this.data.pop();
  }

  peek() {
    return this.data[this.data.length - 1];
  }

  isEmpty() {
    return this.data.length === 0;
  }

  size() {
    return this.data.length;
  }

  // Returns a copy so callers cannot mutate internal state
  snapshot() {
    return [...this.data];
  }
}

// ── Operator definitions ──────────────────────────────────────────────────────
const OPERATORS = {
  '+':  { prec: 1, assoc: 'L', fn: (a, b) => a + b },
  '-':  { prec: 1, assoc: 'L', fn: (a, b) => a - b },
  '*':  { prec: 2, assoc: 'L', fn: (a, b) => a * b },
  '/':  { prec: 2, assoc: 'L', fn: (a, b) => {
    if (b === 0) throw new Error('Division by zero');
    return a / b;
  }},
  '%':  { prec: 2, assoc: 'L', fn: (a, b) => a % b },
  '**': { prec: 3, assoc: 'R', fn: (a, b) => Math.pow(a, b) },
};

// ── Tokenizer ─────────────────────────────────────────────────────────────────
// Breaks an infix string into typed token objects.
// Handles: numbers, operators, parentheses, sqrt(), unary +/-, implicit multiply
function tokenise(expr) {
  const tokens = [];
  let i = 0;
  expr = expr.trim();

  while (i < expr.length) {
    const ch = expr[i];

    // Whitespace
    if (/\s/.test(ch)) { i++; continue; }

    // sqrt( — implicit multiply if preceded by number or ')'
    if (expr.slice(i, i + 5) === 'sqrt(') {
      if (tokens.length > 0) {
        const prev = tokens[tokens.length - 1];
        if (prev.type === 'num' || prev.val === ')') {
          tokens.push({ type: 'op', val: '*', raw: '*' });
        }
      }
      tokens.push({ type: 'func',  val: 'sqrt', raw: 'sqrt' });
      tokens.push({ type: 'paren', val: '(',    raw: '('    });
      i += 5;
      continue;
    }

    // ** power (must check before single *)
    if (expr.slice(i, i + 2) === '**') {
      tokens.push({ type: 'op', val: '**', raw: '**' });
      i += 2;
      continue;
    }

    // Unary +/- : at start or after operator / open-paren
    if (
      (ch === '-' || ch === '+') &&
      (tokens.length === 0 ||
       tokens[tokens.length - 1].type === 'op' ||
       tokens[tokens.length - 1].val  === '(')
    ) {
      const sign = ch === '-' ? -1 : 1;
      i++;
      if (i < expr.length && /[0-9.]/.test(expr[i])) {
        let n = '';
        while (i < expr.length && /[0-9.]/.test(expr[i])) n += expr[i++];
        const val = sign * parseFloat(n);
        tokens.push({ type: 'num', val, raw: String(val) });
      } else {
        // Unary applied to sub-expression e.g. -(3+4): push 0 then operator
        tokens.push({ type: 'num', val: 0, raw: '0' });
        tokens.push({ type: 'op',  val: ch, raw: ch });
      }
      continue;
    }

    // Number (integer or decimal)
    if (/[0-9.]/.test(ch)) {
      let n = '';
      while (i < expr.length && /[0-9.]/.test(expr[i])) n += expr[i++];
      tokens.push({ type: 'num', val: parseFloat(n), raw: n });
      continue;
    }

    // Binary operators
    if ('+-*/%'.includes(ch)) {
      tokens.push({ type: 'op', val: ch, raw: ch });
      i++;
      continue;
    }

    // Parentheses — implicit multiply before '('
    if (ch === '(' || ch === ')') {
      if (ch === '(' && tokens.length > 0) {
        const prev = tokens[tokens.length - 1];
        if (prev.type === 'num' || prev.val === ')') {
          tokens.push({ type: 'op', val: '*', raw: '*' });
        }
      }
      tokens.push({ type: 'paren', val: ch, raw: ch });
      i++;
      continue;
    }

    throw new Error(`Unknown character: "${ch}"`);
  }

  return tokens;
}

// ── Shunting-Yard algorithm ───────────────────────────────────────────────────
// Converts infix token array → Reverse Polish Notation (postfix).
// Returns postfix array + detailed step trace for DSA learning.
function shuntingYard(tokens) {
  const output  = [];
  const opStack = new Stack();
  const steps   = [];

  const snap = () => ({
    opStack: opStack.snapshot().map(t => ({ ...t })),
    output:  output.map(t => ({ ...t })),
  });

  for (const tok of tokens) {

    if (tok.type === 'num') {
      output.push(tok);
      steps.push({ token: tok.raw, action: `push ${tok.raw} → output`, ...snap() });

    } else if (tok.type === 'func') {
      opStack.push(tok);
      steps.push({ token: tok.raw, action: `push func '${tok.raw}' → op stack`, ...snap() });

    } else if (tok.type === 'op') {
      const meta = OPERATORS[tok.val];
      while (
        !opStack.isEmpty() &&
        opStack.peek().type === 'op' &&
        OPERATORS[opStack.peek().val] &&
        (
          (meta.assoc === 'L' && OPERATORS[opStack.peek().val].prec >= meta.prec) ||
          (meta.assoc === 'R' && OPERATORS[opStack.peek().val].prec >  meta.prec)
        )
      ) {
        const p = opStack.pop();
        output.push(p);
        steps.push({ token: tok.raw, action: `pop '${p.raw}' (higher prec) → output`, ...snap() });
      }
      opStack.push(tok);
      steps.push({ token: tok.raw, action: `push '${tok.raw}' → op stack`, ...snap() });

    } else if (tok.val === '(') {
      opStack.push(tok);
      steps.push({ token: tok.raw, action: `push '(' → op stack`, ...snap() });

    } else if (tok.val === ')') {
      while (!opStack.isEmpty() && opStack.peek().val !== '(') {
        const p = opStack.pop();
        output.push(p);
        steps.push({ token: tok.raw, action: `pop '${p.raw}' until '(' → output`, ...snap() });
      }
      if (!opStack.isEmpty()) opStack.pop(); // discard '('
      if (!opStack.isEmpty() && opStack.peek().type === 'func') {
        const fn = opStack.pop();
        output.push(fn);
        steps.push({ token: tok.raw, action: `pop func '${fn.raw}' → output`, ...snap() });
      }
      steps.push({ token: tok.raw, action: `discard ')'`, ...snap() });
    }
  }

  // Drain remaining operators
  while (!opStack.isEmpty()) {
    const p = opStack.pop();
    output.push(p);
    steps.push({ token: '(end)', action: `drain '${p.raw}' → output`, ...snap() });
  }

  return { postfix: output, steps };
}

// ── Postfix evaluator ─────────────────────────────────────────────────────────
// Evaluates an RPN token array using an operand stack.
function evalPostfix(postfix) {
  const valStack = new Stack();
  const steps    = [];

  for (const tok of postfix) {

    if (tok.type === 'num') {
      valStack.push(tok.val);
      steps.push({
        token:  tok.raw,
        action: `push ${fmt(tok.val)}`,
        stack:  valStack.snapshot().map(fmt),
      });

    } else if (tok.type === 'func' && tok.val === 'sqrt') {
      if (valStack.isEmpty()) throw new Error('Not enough operands for sqrt');
      const a = valStack.pop();
      if (a < 0) throw new Error('Cannot take sqrt of a negative number');
      const r = Math.sqrt(a);
      valStack.push(r);
      steps.push({
        token:  tok.raw,
        action: `sqrt(${fmt(a)}) = ${fmt(r)}`,
        stack:  valStack.snapshot().map(fmt),
      });

    } else if (tok.type === 'op') {
      if (valStack.size() < 2) throw new Error('Not enough operands');
      const b = valStack.pop();
      const a = valStack.pop();
      const r = OPERATORS[tok.val].fn(a, b);
      valStack.push(r);
      steps.push({
        token:  tok.raw,
        action: `${fmt(a)} ${tok.raw} ${fmt(b)} = ${fmt(r)}`,
        stack:  valStack.snapshot().map(fmt),
      });
    }
  }

  if (valStack.size() === 0) throw new Error('Empty expression');
  if (valStack.size() !== 1) throw new Error('Invalid expression — mismatched operands');

  return { result: valStack.pop(), steps };
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function fmt(n) {
  if (typeof n !== 'number' || isNaN(n)) return 'NaN';
  if (!isFinite(n)) return n > 0 ? 'Infinity' : '-Infinity';
  if (Number.isInteger(n)) return n;
  return parseFloat(n.toFixed(8));
}

// ── Main exported function ────────────────────────────────────────────────────
// Called by the route handler. Returns a structured response object.
function calculate(expression) {
  const tokens = tokenise(expression);
  const { postfix, steps: sySteps }   = shuntingYard(tokens);
  const { result,  steps: evalSteps } = evalPostfix(postfix);

  return {
    expression,
    tokens:    tokens.map(t => ({ type: t.type, value: t.raw })),
    postfix:   postfix.map(t => t.raw).join(' '),
    sySteps,
    evalSteps,
    result:    fmt(result),
  };
}

module.exports = { Stack, tokenise, shuntingYard, evalPostfix, calculate };
