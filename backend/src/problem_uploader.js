const fs = require('fs');
const path = require('path');

const uploadDir = path.join(__dirname, '..', 'uploaded_problems');
const maxSize = 1024 * 1024;

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

function upload(req, res) {
  if (req.body.description.length + req.body.clauses.length > maxSize) res.status(413).send(`The maximum problem size is ${maxSize / 1024} KB`);
  else {
    const data = `${req.body.description.replace(/^/gm, '% ')} \n\n${req.body.clauses}`;
    const ext = req.body.inputSyntax === 'smtlib2' ? 'smt2' : 'p';
    fs.writeFile(path.join(uploadDir, `${req.user.userName}_${new Date().toISOString().replace(/[:.]/g,'-')}.${ext}`), data,
      err => {
        if (err) res.status(500).send(err.message);
        else res.sendStatus(200);
      });
  }
}

exports.upload = upload;