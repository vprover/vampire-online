// const { stringOptions } = require('./options');
// console.log(stringOptions);
// console.log(getSections(stringOptions));

function getSections(str) {
  const regex = /[*]+\n[*]+\s+(?<name>[a-zA-Z]+)\s+[*]+\n[*]+\n{2}(?<content>[^*]*)/g;
  let sections = []
  while (result = regex.exec(str)) {
    const sec = result.groups;
    sections.push({
      name: sec.name,
      options: getOptions(sec.content)
    })
  }
  return sections;
}

function getOptions(section) {
  const regex = /--(?<name>\w+)\s+(?:\(-(?<shortName>\w+)\))?\s+(?<description>[^]+?(?=default))(?:default:\s(?<default>.+))?(?:\s+values:\s(?<values>[^]+?(?=\n--)))?/g;
  let options = []
  while (result = regex.exec(section)) {
    const opt = result.groups;
    options.push({
      name: opt.name,
      shortName: opt.shortName,
      description: opt.description ? opt.description.replace(/\s+/g, " ") : null,
      default: opt.default,
      values: opt.values ? opt.values.replace(/\s+/g, " ").split(",") : null
    })
  }
  return options;
}

exports.toJSON = (str) => { return str ? getSections(str) : null };