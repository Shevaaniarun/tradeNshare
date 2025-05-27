const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } 
}));


// Set view engine (EJS or any other)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
const indexRoutes = require('./routes/index');
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const sellRoutes = require('./routes/sell');
const donateRoutes = require('./routes/donate');
const reviewRoutes = require('./routes/review');
const buyRoutes = require('./routes/buy');
const userRoutes = require('./routes/user');
const itemRoutes = require('./routes/item');

app.use('/', indexRoutes);
app.use('/auth', authRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/sell', sellRoutes);
app.use('/donate', donateRoutes);
app.use('/review', reviewRoutes);
app.use('/buy', buyRoutes);
app.use('/user', userRoutes);
app.use('/item', itemRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});










