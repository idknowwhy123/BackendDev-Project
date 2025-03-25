const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const { xss } = require('express-xss-sanitizer');
const rateLimit = require('express-rate-limit');
const cors = require('cors');

dotenv.config({ path: './config/config.env' });
connectDB();

const companies = require('./routes/companies');
const auth = require('./routes/auth');
const bookings = require('./routes/bookings');
const app = express();

const limiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 100
})

const corsOptions = {
    origin: ["http://localhost:3000", "https://fe-project-2024-2-iaukumoai.vercel.app","https://jobfair-chi.vercel.app"],
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization'
};

app.set('trust proxy', 1);
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(mongoSanitize());
app.use(helmet());
app.use(xss());
app.use(limiter);

app.use('/api/v1/companies', companies);
app.use('/api/v1/auth', auth);
app.use('/api/v1/bookings', bookings);

const PORT = process.env.PORT || 5003;
const server = app.listen(PORT, console.log('Server running in', process.env.NODE_ENV, 'mode on port', PORT));

process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    server.close(() => process.exit(1));
});
