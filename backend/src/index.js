const express = require("express");
const util = require('util');
const { execSync, exec, spawn } = require('child_process');
const execPromise = util.promisify(exec);
const cors = require('cors');
const op = require('./options_utils/options_parser');
const pbLib = require('./problem_library_retriever');
const tutorial = require('./tutorial_retriever');
const jwt = require('./jwt_handler');
const pbUpl = require('./problem_uploader');

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, { path: "/solver" });

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
    catch (e) { }
    finally {
      req.body.args = args;
      next();
    }
  }
  else {
    next();
  }
})

app.use(jwt.validateTokenHTTP);

// Check args restrictions
app.use((req, res, next) => {
  if (req.body.args) {
    try {
      op.checkArgsRestrictions(req.body.args, req.user.userType);
      next();
    }
    catch (error) {
      res.status(422).send(`Arg Restriction Error: ${error.message}`);
    }
  }
  else next();
});

app.post("/solve", async (req, res) => {
  // console.log(`Solve: ${req.body.clauses}`);
  res.status(200).json(await vampireSolve(req.body.clauses, req.body.args));
  // console.log(`Finished solving`);
})

app.post("/parse", async (req, res) => {
  // console.log(`Parse: ${req.body.clauses}`);
  res.status(200).json(await vampireParse(req.body.clauses, req.body.inputSyntax || "tptp"));
  // console.log(`Finished parsing`);
})

app.get("/options", (req, res) => {
  if (vampireOptionSections) {
    if (req.query.sections && req.query.sections === "true") {
      res.status(200).json(vampireOptionSections.map(sec => {
        return {
          name: sec.name,
          options: op.appendRestrictions(req.user.userType, sec.options)
        }
      }));
    }
    else {
      res.status(200).json(op.appendRestrictions(req.user.userType, vampireOptions));
    }
  }
  else {
    res.status(404).send("Could not retrieve options.");
  }
})

app.post("/string-strategy/decode", (req, res) => {
  // console.log(`Decoding ${req.body.stringStrategy}`);
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
  // console.log(`Encoding ${JSON.stringify(req.body.args)}`);
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
    // console.log(`Could not retrieve problem library contents ${error}`);
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

app.post("/access-tokens", (req, res) => {
  if (req.user.userType === 'admin') {
    try {
      res.status(200).json(
        req.body.map(tokenReq => jwt.issueToken(tokenReq))
      )
    }
    catch (error) {
      res.status(500).json(error);
    }
  }
  else res.status(422).send("You must be an admin to generate tokens");
})

app.post("/upload-problem", pbUpl.upload);

app.get("/status", (req, res) => res.sendStatus(200));

io.use(jwt.validateTokenWS)

io.on('connection', socket => {

  socket.on('solve', data => {

    let { clauses, args } = data;
    try { args = JSON.parse(args); }
    catch (e) { }

    if (clauses === undefined || clauses === null) socket.emit('solve_error', 'A `clauses` field must be provided');
    if (args === undefined || clauses === null) socket.emit('solve_error', 'An `args` field must be provided');

    try {
      op.checkArgsRestrictions(args, socket.user.userType);
    }
    catch (error) {
      socket.emit('solve_error', `Arg Restriction Error: ${error.message}`);
      return;
    }

    socket.emit('started_solving');

    const stringArgs = argsToString(args);

    const solveProcess = spawn(`./vampire-executables/vampire${vampireVersion}`, stringArgs.split(' '));
    solveProcess.output = "";

    solveProcess.on('close', (code, signal) => {
      if (code !== 0) {
        if (code === 3) solveProcess.output = solveProcess.output.split("\n").slice(1).join("\n")
        const parsedError = parseErrorMessage(solveProcess.output);
        const portfolioHint = Object.keys(parsedError).length === 0 && (!args["mode"] || args["mode"] !== "portfolio") ? "You can use mode: portfolio to check if vampire can find a solution." : undefined;
        socket.emit('output', {
          rawOutput: `${solveProcess.output}`,
          error: parsedError,
          info: portfolioHint
        });
      }
      else {
        socket.emit('output', { rawOutput: solveProcess.output });
      }
      socket.emit('stopped_solving', { code, signal });
      socket.solveProcess = undefined;
    });

    solveProcess.stdout.on('data', data => {
      solveProcess.output += data.toString();
      socket.emit('output', { rawOutput: solveProcess.output });
    });

    solveProcess.stdin.write(clauses);
    solveProcess.stdin.end();

    socket.solveProcess = solveProcess;
  });

  socket.on('stop', () => {
    if (socket.solveProcess) {
      socket.solveProcess.kill('SIGINT');
      socket.solveProcess = undefined;
    }
  });
})

http.listen(8080, () => {
  console.log("Server running on port 8080");
  console.log(`Access JWTs: 
    ${JSON.stringify(
    [
      { userName: "admin", userType: "admin" },
      { userName: "frontend", userType: "any" }
    ].map(tokenReq => jwt.issueToken(tokenReq)), null, 2)}`);
})

function parseErrorMessage(str) {
  const parsingErrorRegex = /on line ([0-9]*)\n(.*)\n/ig;
  const userErrorRegex = /User error:\s+(.*)\n/ig;
  let result = parsingErrorRegex.exec(str);
  if (result) {
    return {
      type: "parse_error",
      line: result[1],
      text: result[2]
    };
  }
  else {
    result = userErrorRegex.exec(str);
    if (result) return {
      type: "user_error",
      text: result[1]
    }
    else return {};
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
    await execPromise(`echo '${clauses}' | ./vampire-executables/vampire${vampireVersion} --input_syntax ${inputSyntax} --mode output`);
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
    const solution = await execPromise(`echo '${clauses}' | ./vampire-executables/vampire${vampireVersion} ${stringArgs}`);
    return {
      rawOutput: `${solution.stdout}`
    };
  }
  catch (error) {
    // console.log(`An \x1b[31merror\x1b[0m occurred while solving\n: ${error.message}\n--stderr: ${error.stderr}\n--stdout: ${error.stdout}`);
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
    // console.log(`An \x1b[31merror\x1b[0m occurred while getting the options:\n ${error.message}`);
    return null;
  }
}

function vampireEncode(args) {
  try {
    const argsStr = argsToString(args);
    const encoding = execSync(`./vampire-executables/vampire${vampireVersion} ${argsStr} --mode output --encode on`).toString();
    return {
      stringStrategy: encoding.replace(/encode=on:?/, "")
    }
  }
  catch (error) {
    // console.log(`An \x1b[31merror\x1b[0m occurred while encoding options:\n ${error.stdout}`);
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