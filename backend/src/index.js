const express = require("express");
const { execSync } = require("child_process");
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

app.post("/solve", (req, res) => {
  console.log(req.body);
  res.status(200).json(vampireSolve(req.body.clauses, req.body.args));
})

app.listen(8080, () => {
  console.log("Server running on port 8080");
})

function getErrorLines(str){
  const regex = /on line ([0-9]*)/ig;
  let result;
  let lines = []
  while (result = regex.exec(str))
    lines.push(result[1]);
  return lines;
}

function vampireSolve(clauses, args) {
  try {
    const solution = execSync(`echo ${clauses} | ./vampire-executables/vampire4.2.2 ${args}`).toString()
    return {
      rawOutput: `${solution}`
    };
  }
  catch (error) {
    console.log(`Error: ${error.stdout}\nstderr: ${error.stderr}\nstdout: ${error.stdout}`);
    const regex = /on line ([0-9]*)/ig;
    return {
      rawOutput: `${error.stdout}`,
      errors: {
        lines: getErrorLines(error.stdout)
      }
    };
  }
}