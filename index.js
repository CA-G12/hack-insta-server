const express = require('express');
const axios = require('axios');
const curl = require('curl');
const FormData = require('form-data');
const fs = require('fs');
const { join } = require('path');
var cors = require('cors')

const cloudinary = require('cloudinary').v2

 
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}))

app.get('/', (req, res) => {
   res.sendFile(join(__dirname, 'index.html'));
})

app.post('/remove-bg', (req, res) => {
  cloudinary.config({
    secure: true,
    cloud_name: 'diujf6140', 
    api_key: process.env.cloud_key, 
    api_secret: process.env.cloud_secret,
  });

    const { image_url } = req.body;
    const formData = new FormData();
    formData.append('size', 'auto');
    formData.append('image_url', image_url);
    
    axios({
      method: 'post',
      url: 'https://api.remove.bg/v1.0/removebg',
      data: formData,
      responseType: 'arraybuffer',
      headers: {
        ...formData.getHeaders(),
        'X-Api-Key': process.env.rb_key,
      },
      encoding: null
    })
    .then((response) => {
      if(response.status != 200) return console.error('Error:', response.status, response.statusText);
      fs.writeFileSync("no-bg.png", response.data);  
      cloudinary.uploader.upload(join(__dirname, 'no-bg.png'), {upload_preset: "ml_default"}, (error, result)=> {
        if (!error) res.send({url: result.url, secure_url: result.secure_url });
        else res.send(error)
      });    
    })
    .catch((error) => {
        return console.error('Request failed:', error);
    });   
});


app.post('/test-posting', (req, res) => {
  const { name } = req.body; 
  res.json({msg: `hi ${name}`});
})

app.post('/authorize_token', (req, res) => {
  const { code } = req.body;
  const url = 'https://api.instagram.com/oauth/access_token';

  const form = new FormData();
  form.append('client_id', process.env.client_id);
  form.append('client_secret', process.env.client_server);
  form.append('grant_type', 'authorization_code');
  form.append('redirect_uri', 'https://crushyyy.herokuapp.com/');
  form.append('code', code);

  curl.post(url, form, {headers: {
  ...form.getHeaders(),
  }}, (err, data) => {
      if (!err) res.json(JSON.parse(data.body))
      else res.json(err);
  });

});


app.listen(process.env.PORT || 4000, () => {
    console.log('Server is running on port 4000');    
});
