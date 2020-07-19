const { restriction_policies } = require('./restricted_options');

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
  return options;
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

function appendRestrictions(userType, options) {
  userType = userType || "any";
  let restricted = restriction_policies.find(rp => rp.userType === userType);
  if (!restricted) restricted = restriction_policies.find(rp => rp.userType === "any");

  return options.map(option => {
    if (restricted.options[option.name]) {
      return {
        ...option,
        restriction: restricted.options[option.name]
      }
    }
    else {
      return { ...option }
    }
  });
}

function checkArgsRestrictions(args, userType) {
  userType = userType || "any";
  let restricted = restriction_policies.find(rp => rp.userType === userType);
  if (!restricted) restricted = restriction_policies.find(rp => rp.userType === "any");

  Object.keys(args)
    .filter(key => restricted.options[key] !== undefined)
    .forEach(key => {
      const res = restricted.options[key];
      if (res == true) throw Error(`${key} is not available as an arg in the online API`);
      if (res.maxValue && args[key] > res.maxValue) throw Error(`${key} should be <= ${res.maxValue}`);
      if (res.minValue && args[key] < res.minValue) throw Error(`${key} should be >= ${res.minValue}`);
    });
}

exports.toJSON = (str) => { return str ? getSections(str) : null };
exports.extractShortNameToNameMap = extractShortNameToNameMap;
exports.toOptionArray = (sections => sections.reduce((arr, section) => arr.concat(section.options), []));
exports.appendRestrictions = appendRestrictions;
exports.checkArgsRestrictions = checkArgsRestrictions;