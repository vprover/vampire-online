const express = require("express");
const { execSync } = require("child_process");
const cors = require('cors');
const op = require('./options_utils/options_parser');
const pbLib = require('./problem_library_retriever');

const app = express();
app.use(express.json());
app.use(cors());

// Load the options on startup to avoid future calls to vampire
const vampireOptionSections = op.toJSON(getStrVampireOptions());
const vampireOptions = op.toOptionArray(vampireOptionSections);
const shortNameToNameMap = op.extractShortNameToNameMap(vampireOptionSections);

app.post("/solve", (req, res) => {
  console.log(`Solve: ${req.body.clauses}`);
  let args = req.body.args;
  try { args = JSON.parse(args);}
  catch (error) { }
  res.status(200).json(vampireSolve(req.body.clauses, args));
  console.log(`Finished solving`);
})

app.post("/parse", (req, res) => {
  console.log(`Parse: ${req.body.clauses}`);
  res.status(200).json(vampireParse(req.body.clauses, req.body.inputSyntax || "tptp"));
  console.log(`Finished parsing`);
})

app.get("/options", (req, res) => {
  if (vampireOptionSections) {
    if (req.query.sections && req.query.sections === "true") {
      res.status(200).json(vampireOptionSections);
    }
    else {
      res.status(200).json(vampireOptions);
    }
  }
  else {
    res.status(404).send("Could not retrieve options.");
  }
})

app.post("/string-strategy/decode", (req, res) => {
  console.log(`Decoding ${req.body.stringStrategy}`);
  const result = vampireDecode(req.body.stringStrategy);
  if (result) {
    res.status(200).json(result)
  }
  else {
    res.status(422).send("Invalid option string");
  }
})

app.post("/string-strategy/encode", (req, res) => {
  console.log(`Encoding ${req.body.args}`);
  const result = vampireEncode(req.body.args);
  if (result) {
    res.status(200).json(result);
  }
  else {
    res.status(422).send("Invalid options");
  }
})

app.get("/problem-library", (req, res) => {
  try {
    res.status(200).json(pbLib.getLibraryData());
  }
  catch (error) {
    res.status(500).send("Something went wrong!");
    console.log(`Could not retrieve problem library contents ${error}`);
  }
})

app.get("/problem-library/:section", (req, res) => {
  const { section } = req.params;
  try {
    res.status(200).json(pbLib.getSectionProblems(section));
  }
  catch (error) {
    res.status(404).send(`Section ${section} not found`);
  }
})

app.get("/problem-library/:section/:problem", (req, res) => {
  const { section, problem } = req.params;
  if (section && problem) {
    try {
      const pbPath = pbLib.getValidProblemPath(section, problem);
      res.status(200).sendFile(pbPath);
    }
    catch{
      res.status(404).send(`Could not find ${problem} from section ${section}`);
    }
  }
  else {
    res.status(400).send("Please specify a <problem> and its <section>.\n GET /problem-library/contents for a table of contents");
  }
})

app.listen(8080, () => {
  console.log("Server running on port 8080");
})

function parseErrorMessage(str) {
  const regex = /on line ([0-9]*)\n(.*)\n/ig;
  let result = regex.exec(str);
  if (result) {
    return {
      line: result[1],
      text: result[2]
    };
  }
  else {
    return {};
  }
}

function argsToString(args) {
  let str = "";
  for (let [key, value] of Object.entries(args)) {
    if (typeof value === 'boolean') str += `--${key} `;
    else str += `--${key} ${value} `;
  }
  return str;
}

function vampireParse(clauses, inputSyntax) {
  try {
    execSync(`echo '${clauses}' | ./vampire-executables/vampire4.2.2 --input_syntax ${inputSyntax} --mode output`)
    return {
      error: {}
    }
  }
  catch (error) {
    return { error: parseErrorMessage(error.stdout) };
  }
}

function vampireSolve(clauses, args) {
  try {
    const stringArgs = argsToString(args);
    const solution = execSync(`echo '${clauses}' | ./vampire-executables/vampire4.2.2 ${stringArgs}`).toString()
    return {
      rawOutput: `${solution}`
    };
  }
  catch (error) {
    console.log(`An \x1b[31merror\x1b[0m occurred while solving\n: ${error.message}\n--stderr: ${error.stderr}\n--stdout: ${error.stdout}`);
    const parsedError = parseErrorMessage(error.stdout);
    const portfolioHint = Object.keys(parsedError).length === 0 && (!args["mode"] || args["mode"] !== "portfolio") ? "You can use mode: portfolio to check if vampire can find a solution." : undefined;
    return {
      rawOutput: `${error.stdout}`,
      error: parsedError,
      info: portfolioHint
    };
  }
}

function getStrVampireOptions() {
  try {
    const str = execSync(`./vampire-executables/vampire_latest --show_options_line_wrap off --show_options on`).toString();
    return str;
  }
  catch (error) {
    console.log(`An \x1b[31merror\x1b[0m occurred while getting the options:\n ${error.message}`);
    return null;
  }
}

function vampireEncode(args) {
  try {
    const argsStr = argsToString(args);
    const encoding = execSync(`./vampire-executables/vampire4.2.2 --mode output --encode on ${argsStr}`).toString();
    return encoding.replace(/encode=on:?/, "");
  }
  catch (error) {
    console.log(`An \x1b[31merror\x1b[0m occurred while encoding options:\n ${error.output}`);
    return null;
  }
}


const saValues = vampireOptionSections.find(section => section.name.toLowerCase() === 'saturation')
  .options.find(option => option.shortName && option.shortName.toLowerCase() === 'sa').values;

function vampireDecode(stringStrategy) {
  const strStructure = /(?<sa>[a-z]+)(?<s>[+-][0-9]+)_(?<awr>[0-9:]+)_(?<args>[\w:=.]*)_(?<t>[0-9]+)/g;
  const strategyParts = strStructure.exec(stringStrategy).groups;
  let args = {
    "saturation_algorithm": saValues.find(v => v.startsWith(strategyParts.sa)),
    "selection": strategyParts.s,
    "age_weight_ratio": strategyParts.awr,
    "time_limit": strategyParts.t / 10.0
  };
  strategyParts.args.split(":").forEach(arg => {
    [name, val] = arg.split("=");
    args[`${shortNameToNameMap[name] ? shortNameToNameMap[name] : name}`] = val;
  })
  // Validate the decoded args
  // return vampireEncode(args) === optionString ? args : null;
  return args;
}