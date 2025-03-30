// const express = require('express');
// const mongoose = require('mongoose');
// const session =require('express-session')
// const routes = require('./Routes/router');


// require('dotenv').config();
// const app=express()


// app.use(express.urlencoded({extended:true}))
// app.use(express.json())
// app.use("/",routes);
// app.set('view engine','ejs')

// const port=process.env.PORT
// app.use(express.json())
// app.use(session({
//     secret: 'my-secret-key',
//     resave: false,               
//     saveUninitialized: false     
// }));

// const router = require('./Routes/router');
// app.use(router);

// app.use(express.static("uploads"));
// mongoose.connect(process.env.DB_URI)
// .then(()=>{
//     console.log("connect database")
// }
// )

// .catch((err)=>{
//     console.log(err)
// })
// // app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
// app.listen(8080, () => {
//     console.log('Server running at http://localhost:8080');
//   });
  



const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const routes = require('./Routes/router');  // Only one import

require('dotenv').config();
const app = express();

// ✅ Middleware Setup
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("uploads"));

// ✅ Set View Engine
app.set('view engine', 'ejs');

// ✅ Session Middleware (Moved Above Routes)
app.use(session({
    secret: 'my-secret-key',
    resave: false,
    saveUninitialized: false
}));

// ✅ Routes
app.use("/", routes);

// ✅ MongoDB Connection
mongoose.connect(process.env.DB_URI)
    .then(() => {
        console.log("Connected to database");
    })
    .catch((err) => {
        console.log("Database connection error:", err);
    });

// ✅ Port Setup with Fallback
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
