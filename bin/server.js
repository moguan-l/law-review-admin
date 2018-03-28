const express = require('express');
const path = require('path');

const app = express();
const staticPath = path.join(__dirname, '../dist');

app.use(express.static(staticPath));

app.get('/*', function (req, res) {
    res.sendFile(path.join(staticPath, './index.html'))
});

app.listen(8080, function () {
    console.info(process.env.NODE_ENV)
});