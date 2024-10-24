import jwt from "jsonwebtoken"
import axios from "axios";

export const placeSearch = (req,res) => {
    let searchParams = new URLSearchParams({
        query,
        //map center
    }).toString();
    axios.request({
        method: 'GET',
        url: `https://api.foursquare.com/v3/places/search${req.body.searchParams}`,
        headers: {
            accept: `application/json`,
            Authorization: process.env.PLACES_API_KEY,
        }
    }).then(function (response) {
            console.log(response.data);
    })
    .catch(function (error) {
            console.error(error);
    });
}

export const placeDetails = (req, res) => {
    axios.request({
        method: 'GET',
        url:   `https://api.foursquare.com/v3/places/fsq_id/${req.body.fsq_Id}`,
        headers: process.env.PLACES_API_KEY
      }).then(function (response) {
        console.log(response.data);
    })
    .catch(function (error) {
            console.error(error);
    });
}