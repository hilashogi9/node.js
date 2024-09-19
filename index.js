const express = require('express');
const userRouter=require('./routes/user')

const app = express();
app.use(express.json());

app.use(userRouter)

app.listen(3000, () => {
    console.log('server is running on http://localhost:3000');
});