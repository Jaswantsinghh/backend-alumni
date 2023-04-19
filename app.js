const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:5173'
}));  

app.use('/public/uploads', express.static(__dirname + '/public/uploads/'));
app.use('/', routes);

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});

mongoose.connect('mongodb://localhost:27017/Alumni', {
    useNewUrlParser: true,
    useUnifiedTopology: true
    })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log('Error connecting to MongoDB', err));
