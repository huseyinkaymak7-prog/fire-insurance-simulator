const fs = require('fs');
const { PNG } = require('pngjs');

function floodFillTransparent(data, width, height, startX, startY) {
    const startIdx = (startY * width + startX) * 4;
    const targetR = data[startIdx];
    const targetG = data[startIdx + 1];
    const targetB = data[startIdx + 2];

    // We add a tolerance to handle slight variations in background color (e.g. compression artifacts)
    const tolerance = 40;

    const stack = [[startX, startY]];
    const visited = new Uint8Array(width * height);

    // If already transparent, do nothing
    if (data[startIdx + 3] === 0) return;

    while (stack.length > 0) {
        const [x, y] = stack.pop();
        if (x < 0 || x >= width || y < 0 || y >= height) continue;

        const vIdx = y * width + x;
        if (visited[vIdx]) continue;
        visited[vIdx] = 1;

        const idx = vIdx * 4;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        const a = data[idx + 3];

        if (a === 0) continue;

        if (Math.abs(r - targetR) <= tolerance &&
            Math.abs(g - targetG) <= tolerance &&
            Math.abs(b - targetB) <= tolerance) {

            data[idx + 3] = 0; // Set to transparent
            stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
        }
    }
}

["ceo_aylin.png"].forEach(file => {
    const path = `assets/${file}`;
    if (!fs.existsSync(path)) return;
    fs.createReadStream(path)
        .pipe(new PNG({ filterType: 4 }))
        .on('parsed', function () {
            floodFillTransparent(this.data, this.width, this.height, 0, 0);
            floodFillTransparent(this.data, this.width, this.height, this.width - 1, 0);
            floodFillTransparent(this.data, this.width, this.height, 0, this.height - 1);
            floodFillTransparent(this.data, this.width, this.height, this.width - 1, this.height - 1);

            this.pack().pipe(fs.createWriteStream(path));
            console.log(`Processed ${file}`);
        });
});
