const url = require('url');
const http = require('http');
const app = require('express')();
const config = require('config');
const fs = require('fs');
const cors = require('cors');
const compression = require('compression');
const bodyParser = require('body-parser');

const jwtconf = config.get('jwt');
let jwtoptions = {
  'decodedObjectKey': '$user',
  'duration': '20m'
}
require('./lib/jwt').init(jwtconf.publicKey, jwtconf.privateKey, jwtoptions);

app.use(cors());
app.use(compression());
app.use(bodyParser.json());

require('./routes/list.js')(app);
require('./routes/place.js')(app);
require('./routes/user.js')(app);

const serverConfig = config.get("server");

let server = http.createServer(app)
server.listen(serverConfig.port, () => {
  console.log(`Listening on ${url.format(serverConfig)}`);
});
