const fs = require('fs');
const jwt = require('jsonwebtoken');
const path = require('path');

const privateKey = fs.readFileSync(path.join(__dirname, '..', 'Keys', 'private.key'), 'utf8');

const options = {
  issuer: "vprover",
}

// Validate authorization token and get user type from token
function validateToken(req, res, next) {
  const bearerHeader = req.headers['authorization'];
  // if (bearerHeader === undefined) res.status(403).send("Please add a 'Bearer <JWT>' authorization header");
  if (bearerHeader === undefined) {
    req.headers['user-type'] = "any";
    next();
  }
  else {
    try {
      const token = bearerHeader.split(' ')[1];
      const payload = jwt.verify(token, privateKey);
      req.headers['user-type'] = payload.userType;
      next();
    }
    catch (error) {
      req.headers['user-type'] = "any";
      next();
      // res.status(403).send("Please use a valid JWT");
    }
  }
}

function issueToken(tokenReq) {
  return {
    userName: tokenReq.userName,
    token: jwt.sign({ userType: tokenReq.userType || "any", userName: tokenReq.userName }, privateKey,
      tokenReq.expiresIn ? { ...options, expiresIn: tokenReq.expiresIn } : options),
  }
}

exports.validateToken = validateToken;
exports.issueToken = issueToken;