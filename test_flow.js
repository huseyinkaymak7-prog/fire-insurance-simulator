const fs = require('fs');
const vm = require('vm');

let gameCode = fs.readFileSync('game.js', 'utf8');

// Mock DOM
global.document = {
    getElementById: (id) => ({
        classList: { add: (c) => console.log(`DOM: Added class [${c}] to element [${id}]`), remove: () => { } },
        addEventListener: () => { },
        innerHTML: '',
        textContent: '',
        value: '', // Added to prevent undefined .value calls
        style: {}, // Added for MiniGame styling mocks
        insertBefore: () => { }
    }),
    createElement: () => ({ classList: { add: () => { } }, style: {}, appendChild: () => { }, insertBefore: () => { } }),
    querySelectorAll: () => [],
    addEventListener: () => { } // Added for document.addEventListener in MiniGame
};

global.window = {
    innerWidth: 1920,
    AudioContext: class { } // mock SoundManager
};

// Evaluate the code into global scope
try {
    vm.runInThisContext(gameCode);
} catch (e) {
    console.error("FATAL ERROR IN GAME CODE:");
    console.error(e.stack);
    process.exit(1);
}

// Overrides
Game.prototype.bindEvents = function () { console.log('Mocked bindEvents'); }
UIRenderer.prototype.updateAll = function () { console.log('Mocked updateAll'); }

// Let's hook into showQuarterReport to see if it throws or succeeds
const oldShow = UIRenderer.prototype.showQuarterReport;
UIRenderer.prototype.showQuarterReport = function () {
    console.log('>>> UI.showQuarterReport CALLED at month = ', this.game.state.month);
    try {
        oldShow.apply(this);
        console.log('>>> UI.showQuarterReport SUCCESS!');
    } catch (e) {
        console.error('>>> UI.showQuarterReport ERROR:', e);
    }
}
SoundManager.prototype.play = function () { }
SoundManager.prototype.init = function () { }


console.log('ADVANCE TO MONTH 4');
g.advanceMonth();
console.log('AFTER ADVANCE: month =', g.state.month);
