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
  res.setHeader('Content-Type', 'application/json');
  res.status(422);
  res.send(JSON.stringify({
    statusCode: 1234,
    statusMessage: 'Generic Error!',
    tempAlohaMessageDoNotUse: null,
  }));
});

app.listen(5000);
