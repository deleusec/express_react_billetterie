const express = require('express');
const cors = require('cors')
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser')

const app = express();
const port = 3001;
let nbrUser = 0;

// socket.io
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true
    }
});

const jsonParser = bodyParser.json()
const urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(cors())
const filepath = path.resolve(__dirname, 'bdd.json');

const getData = async () => {
    const raw =  await fs.promises.readFile(filepath, 'utf8');
    return JSON.parse(raw);
}

const saveData = async (data) => {
    await fs.promises.writeFile(filepath, JSON.stringify(data));
}
// respond with "hello world" when a GET request is made to the homepage
app.get('/', function(req, res) {

    res.send('hello world');
});

// établissement de la connexion
io.on('connection', (socket) =>{
    nbrUser++
    io.emit('users', nbrUser)
    console.log(`Connecté au client ${socket.id}`)

    socket.on('disconnect',()=>{
        if(nbrUser!==0){
            nbrUser--;
        }

    })

})

app.get('/places', async (req, res) => {
    const data = await getData();
    const page = data.places;
    res.send(page);
});

app.post('/buy',jsonParser, async (req, res) => {
    const data = await getData();

    if(req.body.selection && req.body.selection.length > 0){
        const selection = {
            id : Date.now(),
            ...req.body
        };
        data.places.push(selection);
        await saveData(data);
        res.send({...selection, error : false});
    }
});

server.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})