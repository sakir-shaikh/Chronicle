const fs = require('fs');
const file = 'src/components/attendee/AttendeePortal.tsx';
const lines = fs.readFileSync(file, 'utf8').split('\n');
const newContent = fs.readFileSync('replace.txt', 'utf8');

lines.splice(368, 426, newContent);
fs.writeFileSync(file, lines.join('\n'));
