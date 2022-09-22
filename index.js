const express = require('express');
const axios = require('axios');
const oauth = require('axios-oauth-client');
const { join } = require('path');

require('dotenv').config();

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
   res.send('API is running!');
})

app.post('/access-token', async(req, res) => {
    const codeBody = req.body.code;
    const getToken = oauth.client(axios.create(), {
        url: 'https://api.instagram.com/oauth/access_token',
        client_id : process.env.client_id,
        client_secret: process.env.client_server,
        grant_type: 'authorization_code',
        redirect_uri: 'https://crushyyy.herokuapp.com/',
        code: codeBody,
    })  
    
    try {
        const token = await getToken();
        res.send(token);
    } catch(err) {
       res.send(err);
    }
 
});

app.listen(process.env.PORT || 4000, () => {
    console.log('Server is running on port 4000');    
});