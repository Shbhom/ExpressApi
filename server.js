const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const cookieParser=require('cookie-parser')
const corsOptions = require('./config/CORS.js');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const {verifyJWT} = require('./middleware/verifyJWT');

//router
const rootRouter= require('./routes/root');
const registerRouter= require('./routes/register');
const loginRouter= require('./routes/auth');
const refreshRouter= require('./routes/refresh');
const subdirRouter= require('./routes/subdir');
const employeesRouter= require('./routes/api/employees');

//port number
const PORT = process.env.PORT || 5000;

// custom middleware
app.use(logger);
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded data form
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json 
app.use(express.json());

//middleware for cookie
app.use(cookieParser())

//serve static files
app.use('/', express.static('./views'));
app.use('/subdir', express.static(path.join(__dirname, '/public')));

// routers
app.use('/', rootRouter);
app.use('/register', registerRouter);
app.use('/login', loginRouter);
app.use('/refresh', refreshRouter)

app.use(verifyJWT)
//here since we want user to access the home page and 
//and register them as user or login them and since it all work as waterfall
//tokens will be verified before accessing subdir or employees
app.use('/subdir',subdirRouter );
app.use('/employees', employeesRouter);

app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({ "error": "404 Not Found" });
    } else {
        res.type('txt').send("404 Not Found");
    }
});

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
