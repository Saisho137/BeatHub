'use strict'

const axios = require('axios')

const getUserData = async (req,res) => {
    const token = req.headers.authorization

    const headers = {
      headers: {
        'Authorization': token
      }
    };
  
    try {
      const { data: { display_name, images } } = await axios.get('https://api.spotify.com/v1/me', headers);

      const image = images.length > 0 ? images[0].url : null;

      res.status(200).send({
        username: display_name,
        image: image
      });
      
    } catch (error) {
      res.status(500).send({ error });
    }
  };

module.exports={getUserData}