const path = require('path');
const fs = require('fs');
const mdToc = require('markdown-toc');

const tutorialDir = path.join(__dirname, '..', 'tutorial');

function getSectionNames() {
  return fs.readdirSync(tutorialDir, { withFileTypes: true })
    .filter(dirent => dirent.isFile() && dirent.name.endsWith(".md"))
    .map(dirent => dirent.name);
}

function getTutorials() {
  let data = [], toc = [];
  const sections = getSectionNames();
  sections.forEach(section => {
    const content = fs.readFileSync(path.join(tutorialDir, section), "utf8");
    const name = section.slice(0, -3).replace(/[0-9]+[-_]/g, "");
    toc.push({
      name: name,
      headings: mdToc(content).json,
    });
    data.push({
      name: name,
      content: content
    })
  })

  return {
    toc: toc,
    sections: data,
  }
}

exports.getTutorials = getTutorials;