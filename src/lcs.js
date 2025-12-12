// longest common substring implementation
import { sameText } from './stringUtils.js';

export function lcsTokens(baseTokens, rowTokens) {
    const m = baseTokens.length;
    const n = rowTokens.length;

    const dp = Array(m + 1)
        .fill(null)
        .map(() => Array(n + 1).fill(0));

    for (let i = m - 1; i >= 0; i--) {
        for (let j = n - 1; j >= 0; j--) {
            if (sameText(baseTokens[i], rowTokens[j])) {
                dp[i][j] = dp[i + 1][j + 1] + 1;
                continue;
            }
            dp[i][j] = Math.max(dp[i + 1][j], dp[i][j + 1]);
        }
    }

    let i = 0;
    let j = 0;
    const backbone = [];

    while (i < m && j < n) {
        if (sameText(baseTokens[i], rowTokens[j])) {
            backbone.push(baseTokens[i]);
            i++;
            j++;
            continue;
        }
        if (dp[i + 1][j] >= dp[i][j + 1]) {
            i++;
            continue;
        }
        j++;
    }

    return backbone;
}
