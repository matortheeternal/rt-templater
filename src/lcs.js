export function tokenize(str) {
  return str.trim().split(/\s+/);
}

function extractOptions(span) {
  const match = span.match(/^\((.*)\)$/);
  if (match) {
    return match[1].split('|');
  }
  return [span];
}

function mergeVariantSpans(aStr, bStr) {
  const opts = new Set();

  if (aStr) extractOptions(aStr).forEach(o => opts.add(o));
  if (bStr) extractOptions(bStr).forEach(o => opts.add(o));

  return '(' + [...opts].join('|') + ')';
}

function lcs(a, b) {
  const dp = Array(a.length + 1)
    .fill(null)
    .map(() => Array(b.length + 1).fill(0));

  for (let i = a.length - 1; i >= 0; i--) {
    for (let j = b.length - 1; j >= 0; j--) {
      dp[i][j] =
        a[i] === b[j]
          ? dp[i + 1][j + 1] + 1
          : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }

  let i = 0, j = 0;
  const seq = [];

  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      seq.push(a[i]);
      i++; j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      i++;
    } else {
      j++;
    }
  }
  return seq;
}

function mergeTwoTokens(aTokens, bTokens) {
  const backbone = lcs(aTokens, bTokens);
  const out = [];

  let ai = 0;
  let bi = 0;

  for (const anchor of backbone) {
    const aSpan = [];
    const bSpan = [];

    while (aTokens[ai] !== anchor && ai < aTokens.length) {
      aSpan.push(aTokens[ai++]);
    }
    while (bTokens[bi] !== anchor && bi < bTokens.length) {
      bSpan.push(bTokens[bi++]);
    }

    if (aSpan.length || bSpan.length) {
      const aStr = aSpan.join(' ').trim();
      const bStr = bSpan.join(' ').trim();
      out.push(mergeVariantSpans(aStr, bStr));
    }

    out.push(anchor);

    ai++;
    bi++;
  }

  const aTail = aTokens.slice(ai).join(' ').trim();
  const bTail = bTokens.slice(bi).join(' ').trim();

  if (aTail || bTail) {
    out.push(mergeVariantSpans(aTail, bTail));
  }

  return out;
}

const SUFFIX_PUNCT = ['.', ',', ';', ':', '!', '?'];

function cleanupVariantSuffixes(template) {
  return template.replace(/\(([^()]+)\)/g, (match, inner) => {
    const opts = inner.split('|');

    if (opts.length < 2) return match;

    const suffixes = opts.map(o => {
      const last = o[o.length - 1];
      return SUFFIX_PUNCT.includes(last) ? last : '';
    });

    const first = suffixes[0];
    if (!suffixes.every(s => s === first)) return match;

    const stripped = opts.map(o =>
      first ? o.slice(0, -1) : o
    );

    return '(' + stripped.join('|') + ')' + first;
  });
}

export function mergeNStrings(strings) {
  if (strings.length === 0) return '';
  if (strings.length === 1) return strings[0];

  let merged = tokenize(strings[0]);

  for (let i = 1; i < strings.length; i++) {
    const next = tokenize(strings[i]);
    merged = mergeTwoTokens(merged, next);
  }

  return cleanupVariantSuffixes(merged.join(' '));
}
