const config = require('./config')
const http = require('http')
const express = require('express')
const compression = require('compression')
const bodyParser = require('body-parser')
const expressWinston = require('express-winston')
const routes = require('./routes')
const winston = require('winston')
const path = require('path')
const app = express()
var cors = require('cors')

app.disable('x-powered-by')
app.use(cors())
app.use(compression())
app.use(bodyParser.json(config.bodyParser))
app.use(expressWinston.logger({
      transports: [
        new winston.transports.Console()
      ],
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json()
      ),
      meta: true, // optional: control whether you want to log the meta data about the request (default to true)
      msg: "HTTP {{req.method}} {{req.url}}", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
      expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
      colorize: false, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
      ignoreRoute: function (req, res) { return false; } // optional: allows to skip some log messages based on request and/or response
    }))

app.use('/static', express.static(path.resolve(__dirname, '../public')))
app.use(routes)


module.exports = http.createServer(app)
