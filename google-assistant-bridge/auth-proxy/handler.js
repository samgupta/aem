'use strict';
const fetch = require('node-fetch');
const URLSearchParams = require('url-search-params');

module.exports.token = (event, context, callback) => {

  const params = new URLSearchParams(event.body);
  const url = process.env.TOKEN_ENDPOINT || 'https://esure-login.auth.eu-west-2.amazoncognito.com/oauth2/token';
  fetch(url, {
    method: 'POST',
    body: params,
    headers: {
      'Authorization': `Basic ${new Buffer(`${params.get('client_id')}:${params.get('client_secret')}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
  })
  .then(res => res.text().then(responseText => ({
    statusCode: res.status,
    body: responseText,
    ok: res.ok
  })))
  .then((res) => {
    if (res.ok) {
      console.log('Got response ok, returning with a 200 status code');
      const response = {
        statusCode: 200,
        body: res.body,
      };
      callback(null, response);
    } else {
      throw new Error(`Response from oauth token endpoint was not ok: ${res.statusCode} ${res.body}`)
    }
  }).catch((err) => {
    console.error(err);
    callback(null, {
      statusCode: 500,
      body: err,
    })
  })
};
