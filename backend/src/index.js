const express = require("express");
const { execSync } = require("child_process");
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

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
  console.log(args);
  let str = "";
  for (let [key, value] of Object.entries(JSON.parse(args))) {
    if (typeof value === 'boolean') str += `${key} `;
    else str += `${key} ${value} `;
  }
  console.log(str);
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
    console.log(`Error: ${error.stdout}\nstderr: ${error.stderr}\nstdout: ${error.stdout}`);
    return {
      rawOutput: `${error.stdout}`,
      error: parseErrorMessage(error.stdout)
    };
  }
}