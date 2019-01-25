const express = require('express');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

app.use(cors());
app.use(morgan('common'));

app.put('/orders/1.0/:id/resubmit', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.status(422);
  res.send(JSON.stringify({
    statusCode: 1430,
    statusMessage: 'Oops! Something went wrong with editing your order. Please refresh the page and try to edit again, or edit the order on the POS.',
    tempAlohaMessageDoNotUse: null,
  }));
});

app.all(/.+/, (req, res) => {
  const { query } = req;
  const { props } = query;
  console.log(query, props)
  const options = JSON.parse(props);
  res.setHeader('Content-Type', 'application/json');
  res.status(options.statusCode);
  const result = {};
  options.responseKVPairs.forEach(pair => {
    result[pair.key] = pair.value;
  })
  res.send(JSON.stringify({ ...result }));
});

app.listen(5000);
