export function swap(n1, n2) {
    const _n1 = n1;
    n1 = n2;
    n2 = _n1;
}

export function getMinMax(n1, n2) {
    let min = parseInt(n1, 10);
    let max = parseInt(n2, 10);
    if (min && max) {
        if (min > max) {
            swap(min, max);
        }
        return {
            min,
            max
        }
    }
}