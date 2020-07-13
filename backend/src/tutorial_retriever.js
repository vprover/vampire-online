const path = require('path');
const fs = require('fs');

const tutorialDir = path.join(__dirname, '..', 'tutorial');

function getSectionNames() {
  return fs.readdirSync(tutorialDir, { withFileTypes: true })
    .filter(dirent => dirent.isFile() && dirent.name.endsWith(".md"))
    .map(dirent => dirent.name);
}

function getTutorials() {
  let data = [];
  const sections = getSectionNames();
  sections.forEach(section => {
    data.push({
      name: section.slice(0,-3),
      content: fs.readFileSync(path.join(tutorialDir, section), "utf8")
    })
  })
  return data;
}

exports.getTutorials = getTutorials;