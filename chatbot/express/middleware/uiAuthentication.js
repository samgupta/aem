const basicAuth = require("basic-auth");
const hash = require("hash.js");

module.exports = (username, password, rand) => (req, res, next) => {
  if ((req.method === 'GET' || req.method === 'HEAD') && req.accepts('html')) {
    const auth = basicAuth.parse(req.headers.Authorization || req.headers.authorization);
    const hashed = auth && hash.sha256().update(auth.pass).digest('hex');
    console.log("Hashed: ", hashed); 
    if (auth && auth.name === username && hashed === password) {
      next();
    } else {
      res.set("WWW-Authenticate", "Basic realm=\"UI Access\"")
      res.status(401);
      res.send("Unauthorized");
    }
  } else next()
}