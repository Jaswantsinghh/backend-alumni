const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

const app = express();
app.use(bodyParser.json());
dotenv.config();

app.use(cors({
    origin: process.env.CORS_ORIGIN
}));  

app.use('/public/uploads', express.static(__dirname + '/public/uploads/'));
app.use('/', routes);

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
    })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log('Error connecting to MongoDB', err));
