const express = require('express');
const userRoute = require('./routes/user');
const adminRoute = require('./routes/admin');
const app = express();


app.use(express.json());


app.use('/user', userRoute)
app.use('/admin', adminRoute)


app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});