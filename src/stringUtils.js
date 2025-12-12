export function sameText(a, b) {
    if (a === b) return true;
    if (!a || !b) return false;
    return a.toLowerCase() === b.toLowerCase();
}
