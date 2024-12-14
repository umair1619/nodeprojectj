const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT =  5000;

app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://callmeab26:Abdullah.456@ivstask.cdbhk.mongodb.net/InteractivePhoneMenu', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Failed to connect to MongoDB', err);
});

// Define a schema and model for the menu options
const optionSchema = new mongoose.Schema({
    id: String,
    menu: String,
    parentId: String, 
    subMenu: String,
    dial: String,
    dialExtension: String
});

const Option = mongoose.model('Option', optionSchema);

//  get all options
app.get('/api/options', async (req, res) => {
    const parentId = req.query.parentId;
    if (parentId) {
        const options = await Option.find({ parentId });
        res.json(options);
    } else {
        const options = await Option.find();
        res.json(options);
    }
});


//  add a new option
app.post('/api/options', async (req, res) => {
    const newOption = new Option(req.body);
    await newOption.save();
    res.status(201).json(newOption);
});

//  update an option
app.put('/api/options/:id', async (req, res) => {
    const updatedOption = await Option.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    res.json(updatedOption);
});

//  delete options
app.delete('/api/options/:id', async (req, res) => {
    await Option.findOneAndDelete({ id: req.params.id });
    res.status(204).send();
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
