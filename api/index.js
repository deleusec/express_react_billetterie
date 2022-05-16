const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3001;

let tickets = [];

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/buy', (req, res) => {

});

app.listen(port, () => console.log(`CHAMBERY BILLETTERIE ${port}!`));