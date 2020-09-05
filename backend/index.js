const express = require('express');
const app = express();
const port = 3000;

const testRouter = require('./routers/test');
const videoRouter = require('./routers/videotest');

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.get('/', (req, res) => res.send('Hello World!'));

app.use('/test', testRouter);
app.use('/api/app/test/video', videoRouter);

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
