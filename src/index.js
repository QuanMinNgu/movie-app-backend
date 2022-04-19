const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const router = require('./routes/index');

app.use(express.json());
app.use(cors());
app.use(cookieParser());

const http = require('http').createServer(app);
const io = require('socket.io')(http);

let users = [];
io.on("connect",socket => {

    socket.on('disconnect',() => {
        users = users.filter(user => user.socketId !== socket.id);
    })
})
mongoose.connect(process.env.DATABASE,{useNewUrlParser:true})
    .then(() => console.log("Connected to database"))
    .catch(err => console.log(`Your eror:${err}`));

const PORT = process.env.PORT || 5000;

router(app);

http.listen(PORT, () => console.log(`Your website listen in port :${PORT}`));
