const express = require('express');
const axios = require('axios');
const curl = require('curl');
const FormData = require('form-data');
const { urlencoded } = require('express');
const fs = require('fs');
const { join } = require('path');

require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: false}))

app.get('/', (req, res) => {
   res.sendFile(join(__dirname, 'index.html'));
})

app.post('/remove-bg', (req, res) => {

    const {image } = req.body;
    const formData = new FormData();
    formData.append('size', 'auto');
    formData.append('image_url', image);
    
    axios({
      method: 'post',
      url: 'https://api.remove.bg/v1.0/removebg',
      data: formData,
      responseType: 'arraybuffer',
      headers: {
        ...formData.getHeaders(),
        'X-Api-Key': 'fcSUHGvw72Vc8M3k2QZzphJw',
      },
      encoding: null
    })
    .then((response) => {
      if(response.status != 200) return console.error('Error:', response.status, response.statusText);
      fs.writeFileSync("no-bg.png", response.data);
      res.sendFile(join(__dirname, "no-bg.png"))
    })
    .catch((error) => {
        return console.error('Request failed:', error);
    });   
});


app.post('/test-posting', (req, res) => {
  const { name } = req.body; 
  res.json({msg: `hi ${name}`});
})

app.listen(process.env.PORT || 4000, () => {
    console.log('Server is running on port 4000');    
});