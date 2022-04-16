const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000
const service = require('./service')

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.get('/', service.test)

app.listen(port, () => {
  console.log(`Sribu app listening on port ${port}`);
});
