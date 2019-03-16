const server = require('./server.js')

// endpoints here
// add new zoo record endpoint

const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
