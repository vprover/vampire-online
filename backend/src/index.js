const express = require("express");
const util = require('util');
const { execSync } = require('child_process');
const exec = util.promisify(require('child_process').exec);
const cors = require('cors');
const op = require('./options_utils/options_parser');
const pbLib = require('./problem_library_retriever');
const tutorial = require('./tutorial_retriever');

const app = express();
const vampireVersion = "_latest";
// Load the options on startup to avoid future calls to vampire
const vampireOptionSections = op.toJSON(getStrVampireOptions());
const vampireOptions = op.toOptionArray(vampireOptionSections);
const shortNameToNameMap = op.extractShortNameToNameMap(vampireOptionSections);

app.use(express.json());
app.use(cors());

// Parse args object
app.use((req, res, next) => {
  if (req.body.args) {
    let args = req.body.args;
    try { args = JSON.parse(args); }
    finally {
      req.body.args = args;
      next();
    }
  }
  else {
    next();
  }
})

app.post("/solve", async (req, res) => {
  console.log(`Solve: ${req.body.clauses}`);
  res.status(200).json(await vampireSolve(req.body.clauses, req.body.args));
  console.log(`Finished solving`);
})

app.post("/parse", async (req, res) => {
  console.log(`Parse: ${req.body.clauses}`);
  res.status(200).json(await vampireParse(req.body.clauses, req.body.inputSyntax || "tptp"));
  console.log(`Finished parsing`);
})

app.get("/options", (req, res) => {
  if (vampireOptionSections) {
    if (req.query.sections && req.query.sections === "true") {
      res.status(200).json(vampireOptionSections.map(sec => {
        return {
          name: sec.name,
          options: op.appendRestrictions(req.headers["user-type"], sec.options)
        }
      }));
    }
    else {
      res.status(200).json(op.appendRestrictions(req.headers["user-type"], vampireOptions));
    }
  }
  else {
    res.status(404).send("Could not retrieve options.");
  }
})

app.post("/string-strategy/decode", (req, res) => {
  console.log(`Decoding ${req.body.stringStrategy}`);
  try {
    const result = vampireDecode(req.body.stringStrategy);
    if (result) {
      res.status(200).json(result)
    }
    else {
      res.status(422).send("Invalid option string");
    }
  }
  catch (error) {
    res.status(422).send(error.message);
  }
})

app.post("/string-strategy/encode", (req, res) => {
  console.log(`Encoding ${JSON.stringify(req.body.args)}`);
  try {
    const result = vampireEncode(req.body.args);
    if (result) {
      res.status(200).json(result);
    }
    else {
      res.status(422).send("Invalid options");
    }
  }
  catch (error) {
    res.status(422).send(error.message);
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

app.get("/tutorial", (req, res) => {
  res.status(200).json(tutorial.getTutorials());
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

async function vampireParse(clauses, inputSyntax) {
  try {
    await exec(`echo '${clauses}' | ./vampire-executables/vampire${vampireVersion} --input_syntax ${inputSyntax} --mode output`);
    return {
      error: {}
    }
  }
  catch (error) {
    return { error: parseErrorMessage(error.stdout) };
  }
}

async function vampireSolve(clauses, args) {
  try {
    const stringArgs = argsToString(args);
    const solution = await exec(`echo '${clauses}' | ./vampire-executables/vampire${vampireVersion} ${stringArgs}`);
    return {
      rawOutput: `${solution.stdout}`
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
    const str = execSync(`./vampire-executables/vampire${vampireVersion} --show_options_line_wrap off --show_options on`).toString();
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
    const encoding = execSync(`./vampire-executables/vampire${vampireVersion} ${argsStr} --mode output --encode on`).toString();
    return encoding.replace(/encode=on:?/, "");
  }
  catch (error) {
    console.log(`An \x1b[31merror\x1b[0m occurred while encoding options:\n ${error.stdout}`);
    throw Error(error.stdout);
  }
}


const saValues = vampireOptionSections.find(section => section.name.toLowerCase() === 'saturation')
  .options.find(option => option.shortName && option.shortName.toLowerCase() === 'sa').values;

function vampireDecode(stringStrategy) {
  const strStructure = /(?<sa>[a-z]+)(?<s>[+-][0-9]+)_(?<awr>[0-9:]+)_(?<args>[\w:=.]*)_(?<t>[0-9]+)/g;
  const regexRes = strStructure.exec(stringStrategy);
  if (regexRes == undefined || regexRes == null) throw Error("Input does not follow strategy pattern <sa><s>_<awr>_<arg1=val1:arg2=val2...>_<t>");
  const strategyParts = regexRes.groups;
  const sa = saValues.find(v => v.startsWith(strategyParts.sa));
  if (sa == undefined || sa == null) throw Error(`${strategyParts.sa} is not a valid saturation algorithm`);
  let args = {
    "saturation_algorithm": sa,
    "selection": strategyParts.s,
    "age_weight_ratio": strategyParts.awr,
    "time_limit": strategyParts.t / 10.0
  };
  strategyParts.args.split(":").forEach(arg => {
    [name, val] = arg.split("=");
    args[`${shortNameToNameMap[name] ? shortNameToNameMap[name] : name}`] = val;
  })
  // Validate the decoded args
  return vampireEncode(args).length === stringStrategy.length ? args : null;
}