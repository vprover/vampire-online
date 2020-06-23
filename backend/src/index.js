const express = require("express");
const { execSync } = require("child_process");
const cors = require('cors');
const op = require('./options_parser');

const app = express();
app.use(express.json());
app.use(cors());

// Load the options on startup to avoid future calls to vampire
const vampireOptions = op.toJSON(getStrVampireOptions());
const shortNameToNameMap = op.extractShortNameToNameMap(vampireOptions);

app.post("/solve", (req, res) => {
  console.log(`Solve: ${req.body.clauses}`);
  res.status(200).json(vampireSolve(req.body.clauses, req.body.args));
  console.log(`Finished solving`);
})

app.post("/parse", (req, res) => {
  console.log(`Parse: ${req.body.clauses}`);
  res.status(200).json(vampireParse(req.body.clauses));
  console.log(`Finished parsing`);
})

app.get("/options", (req, res) => {
  if (vampireOptions) {
    res.status(200).json(vampireOptions);
  }
  else {
    res.status(404).send("Could not retrieve options.");
  }
})

app.post("/string-strategy/decode", (req, res) => {
  console.log(`Decoding ${req.body.optionString}`);
  const result = vampireDecode(req.body.optionString);
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
  try {
    args = JSON.parse(args);
  }
  catch (error) { }
  for (let [key, value] of Object.entries(args)) {
    if (typeof value === 'boolean') str += `${key} `;
    else str += `${key} ${value} `;
  }
  return str;
}

function vampireParse(clauses) {
  try {
    execSync(`echo ${clauses} | ./vampire-executables/vampire4.2.2 --mode output`)
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
    const solution = execSync(`echo ${clauses} | ./vampire-executables/vampire4.2.2 ${stringArgs}`).toString()
    return {
      rawOutput: `${solution}`
    };
  }
  catch (error) {
    console.log(`An \x1b[31merror\x1b[0m occured while solving\n: ${error.message}\n--stderr: ${error.stderr}\n--stdout: ${error.stdout}`);
    return {
      rawOutput: `${error.stdout}`,
      error: parseErrorMessage(error.stdout)
    };
  }
}

function getStrVampireOptions() {
  try {
    const str = execSync(`./vampire-executables/vampire4.2.2 --show_options on`).toString();
    return str;
  }
  catch (error) {
    console.log(`An \x1b[31merror\x1b[0m occured while getting the options:\n ${error.message}`);
    return null;
  }
}

function vampireEncode(args) {
  try {
    const argsStr = argsToString(args);
    const encodingOutput = execSync(`./vampire-executables/vampire4.2.2 --encode on ${argsStr}`).toString();
    const encodingClean = /(.*)Satisfiable!/g.exec(encodingOutput)[1];
    return encodingClean.replace(/encode=on:?/, "");
  }
  catch (error) {
    console.log(`An \x1b[31merror\x1b[0m occured while encoding options:\n ${error.output}`);
    return null;
  }
}


const saValues = vampireOptions.find(section => section.name.toLowerCase() === 'saturation')
  .options.find(option => option.shortName && option.shortName.toLowerCase() === 'sa').values;

function vampireDecode(optionString) {
  const strStucture = /(?<sa>[a-z]+)(?<s>[+-][0-9]+)_(?<awr>[0-9:]+)_(?<args>[\w:=.]*)_(?<t>[0-9]+)/g;
  const optionParts = strStucture.exec(optionString).groups;
  let args = {
    "--saturation_algorithm": saValues.find(v => v.startsWith(optionParts.sa)),
    "--selection": optionParts.s,
    "--age_weight_ratio": optionParts.awr,
    "--time_limit": optionParts.t
  };
  optionParts.args.split(":").forEach(arg => {
    [name, val] = arg.split("=");
    args[`--${shortNameToNameMap[name] ? shortNameToNameMap[name] : name}`] = val;
  })
  // Validate the decoded args
  // return vampireEncode(args) === optionString ? args : null;
  return args;
}