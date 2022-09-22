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
   res.send('API is running!');
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

// app.post('/access-token', async(req, res) => {
//     const codeBody = req.body.code;



//     // const data = {
//     //     client_id : '607294150860752',
//     //     client_secret: 'c9c7ad9a51af6debd25aba1c5b0cf128',
//     //     grant_type: 'authorization_code',
//     //     redirect_uri: 'https://localhost:3000/',
//     //     code: codeBody,
//     //  }
//     //  const newData = new FormData('client_id')
//     // axios.post('https://api.instagram.com/oauth/access_token', 
//     // }).then(console.log)
//     // const body = {
//     //     client_id : '607294150860752',
//     //     client_secret: 'c9c7ad9a51af6debd25aba1c5b0cf128',
//     //     grant_type: 'authorization_code',
//     //     redirect_uri: 'https://localhost:3000/',
//     //     code: codeBody,
//     //     }     
    
//     const form = new FormData();
//     form.append('client_id', '607294150860752')
//     form.append('client_secret', 'c9c7ad9a51af6debd25aba1c5b0cf128')
//     form.append('grant_type', 'authorization_code')
//     form.append('redirect_uri', 'https://localhost:3000/')
//     form.append('code', codeBody)



//     // curl.post('https://api.instagram.com/oauth/access_token', form, (err, found) => {
//     //     if (!err) {
//     //         res.send(found)
//     //     } else {
//     //         res.send(err);
//     //     }
//     // })
//     axios({
//         method: 'post',
//         url: 'https://api.instagram.com/oauth/access_token',
//         data: form,
//         responseType: 'arraybuffer',
//         headers: {
//           ...form.getHeaders(),
//         },
//         encoding: null
//       }).then(console.log)

//     // const getToken = oauth.client(axios.create(), {
//     //     url: 'https://api.instagram.com/oauth/access_token',
//     //     client_id : process.env.client_id,
//     //     client_secret: process.env.client_server,
//     //     grant_type: 'authorization_code',
//     //     redirect_uri: 'http://localhost:4000/',
//     //     code: codeBody,
//     // })  
    
//     // try {
//     //     const token = await getToken();
//     //     res.send(token);
//     // } catch(err) {
//     //    res.send(err);
//     // }
 
// });

app.listen(process.env.PORT || 4000, () => {
    console.log('Server is running on port 4000');    
});