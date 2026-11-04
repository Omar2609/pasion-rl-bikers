const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data');
const dataFile = path.join(dataDir, 'members.json');

function ensureStore() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(dataFile)) fs.writeFileSync(dataFile, '[]', 'utf8');
}
function getMembers() {
  ensureStore();
  try {
    const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}
function saveMembers(members) {
  ensureStore();
  fs.writeFileSync(dataFile, JSON.stringify(members, null, 2), 'utf8');
}
module.exports = { getMembers, saveMembers };
