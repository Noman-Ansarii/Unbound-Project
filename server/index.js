const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json()); // Middleware to parse JSON request body

let data = [
  {
    key: 1,
    name: "John Brown",
    age: 32,
    address: "New York No. 1 Lake Park",
    description:
      "My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.",
  },
  {
    key: 2,
    name: "Jim Green",
    age: 42,
    address: "London No. 1 Lake Park",
    description:
      "My name is Jim Green, I am 42 years old, living in London No. 1 Lake Park.",
  },
  {
    key: 3,
    name: "John Cena",
    age: 29,
    address: "Jiangsu No. 1 Lake Park",
    description: "This not expandable",
  },
  {
    key: 4,
    name: "Joe Black",
    age: 32,
    address: "Sydney No. 1 Lake Park",
    description:
      "My name is Joe Black, I am 32 years old, living in Sydney No. 1 Lake Park.",
  },
];

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/postData', (req, res) => {
    console.log(req.body); // Log the received data to console
    const newData = { key: data.length + 1, ...req.body };
    newData.description = `My name is ${newData.name}, I am ${newData.age} years old, living in ${newData.address}.`;
    data.push(newData);
    res.json(newData); // Send the new data as JSON response
});

app.get('/getData', (req, res) => {
    res.json(data); // Send the data as JSON response
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
