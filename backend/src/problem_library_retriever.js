const path = require('path');
const fs = require('fs');

const libraryDir = path.join(__dirname, '..', 'problem_library');

function getLibrarySections() {
  return fs.readdirSync(libraryDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
}

function getSectionProblems(section) {
  const sectionPath = path.join(libraryDir, section);
  return fs.readdirSync(sectionPath, { withFileTypes: true })
    .filter(dirent => dirent.isFile())
    .map(dirent => dirent.name);
}

function getLibraryData() {
  let data = [];
  const sections = getLibrarySections();
  sections.forEach(section => {
    data.push({
      name: section,
      problems: getSectionProblems(section)
    })
  })
  return data;
}

function getValidProblemPath(section, problem) {
  const problemPath = path.join(libraryDir, section, problem);
  if (fs.existsSync(problemPath)) return problemPath;
  else return null;
}

exports.getValidProblemPath = getValidProblemPath;
exports.getSectionProblems = getSectionProblems;
exports.getLibraryData = getLibraryData;