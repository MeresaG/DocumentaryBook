const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const path = require('path');
const passport = require('passport');
const session = require('express-session');
const { default: mongoose } = require('mongoose');
const MongoStore = require('connect-mongo')(session);

const connectDB = require('./config/db');
const passportConfig = require('./config/passport');



//Load config
dotenv.config({ path : './config/config.env' });

//Passport config
passportConfig(passport);
connectDB();

const app = express();

//Body Parser
app.use(express.urlencoded({extended: false}));
app.use(express.json());

//Method Override
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      let method = req.body._method
      delete req.body._method
      return method
    }
  }))


//Logging
if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

//Handlebar helpers
const { formatDate, stripTags, truncate, editIcon, select } = require('./helpers/hbs')

//Handlebars
app.engine('hbs', exphbs.engine({ helpers: {
    formatDate, stripTags, truncate, editIcon,select,
 }, 
    defaultLayout : 'main', extname : '.hbs'}));

    app.set('view engine', 'hbs');

//sessions
app.use(session({
    secret: 'documentary app',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({mongooseConnection: mongoose.connection})
  }))

//passport Middlewar
app.use(passport.initialize());
app.use(passport.session());


//set global variable
app.use(function(req, res, next) {
    res.locals.user = req.user || null
    next()
});

//static folder
app.use(express.static(path.join(__dirname, 'public')));


//Routes
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/documentaries', require('./routes/documentaries'));

const PORT = process.env.PORT || 3000;

app.listen(
    PORT, 
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

