let url = require('url');
let app = require('express')();
let config = require('config');
let cors = require('cors');
let compression = require('compression');
let bodyParser = require('body-parser');

let jwtconf = config.get('jwt');
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
app.listen(serverConfig.port, () => {
  console.log(`Listening on ${url.format(serverConfig)}`);
});
