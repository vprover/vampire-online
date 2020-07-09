const { appendRestrictions } = require('./restricted_options');
// const { stringOptions } = require('./options');
// console.log(stringOptions);
// console.log(appendRestrictions('any', getSections(stringOptions)[0].options));
// console.log(getSections(stringOptions));

function getSections(str) {
  const regex = /[*]+\n[*]+\s+(?<name>[a-zA-Z\s]+)\s+[*]+\n[*]+\n{2}(?<content>[^]*?(?=[*]{10,}|$))/g;
  let sections = []
  while (result = regex.exec(str)) {
    const sec = result.groups;
    sections.push({
      name: sec.name.trim(),
      options: getOptions(sec.content)
    });
  }
  return sections;
}

function getOptions(section) {
  const regex = /--(?<name>\w+)\s+(?:\(-(?<shortName>\w+)\))?\s+(?<description>[^]+?(?=default:))(?:default:\s(?<default>.+))?(?:\s+values:\s(?<values>[^]+?(?=\n--)))?/g;
  let options = []
  while (result = regex.exec(section)) {
    const opt = result.groups;
    options.push({
      name: opt.name,
      shortName: opt.shortName,
      // description: opt.description ? opt.description.replace(/\s+/g, " ") : null,
      description: opt.description ? opt.description.trim() : null,
      default: opt.default,
      values: opt.values ? opt.values.replace(/\s+/g, " ").split(",") : null
    })
  }
  return appendRestrictions('any', options);
}

function extractShortNameToNameMap(optionsJSON) {
  let mapping = {};
  optionsJSON.forEach(section => {
    section.options.forEach(option => {
      if (option.shortName) {
        mapping[option.shortName] = option.name;
      }
    });
  });
  return mapping;
}

exports.toJSON = (str) => { return str ? getSections(str) : null };
exports.extractShortNameToNameMap = extractShortNameToNameMap;
exports.toOptionArray = (sections => sections.reduce((arr, section) => arr.concat(section.options), []));