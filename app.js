require('dotenv').config();

const express = require('express');
const https = require('https');
const fs = require('fs');
const http = require('http');
const hsts = require('hsts');
const path = require('path');

const app = express();
const PORT_HTTP = 3000;
const PORT_HTTPS = 3443;

const helmet = require('helmet');
const PORT = process.env.PORT || 3001;

const mongoose = require('mongoose');
const bodyParser = require('body-parser');


app.use(
    helmet({
        xFrameOptions: { action: "deny" },
        strictTransportSecurity: {
            maxAge: 31556952, // 1 year
            preload: true
        }
    })
);


app.use('/static', express.static('public', {
    setHeaders: (res, path) => {
        if (path.endsWith('.css')) {
            res.set('Cache-Control', 'max-age=86400');
        }
        if (path.endsWith('.jpg') || path.endsWith('.png')) {
            res.set('Cache-Control', 'max-age=2592000');
        }
    }
}));

app.get('/', (req, res) => {
    res.set('Cache-Control', 'max-age=300, public'); // cache for 5 minutes
    res.sendFile(path.join(__dirname,'routes/index.html'));
});

app.get('/secure', (req, res) => {
    res.set('Cache-Control', 'no-store, no cache, private');
    res.send('HTTPS Quest Tracker');
});

app.get('/habits', (req, res) => {
    res.set('Cache-Control', 'max-age=60, public'); // cache for 1 minute
    res.sendFile(path.join(__dirname,'routes/habits.html'));
});

app.get('/goals', (req, res) => {
    res.set('Cache-Control', 'max-age=900, public'); // cache for 15 minutes
    res.sendFile(path.join(__dirname,'routes/goals.html'));
});

app.get('/profile', (req, res) => {
    res.set('Cache-Control', 'max-age=3600, private'); // cache for 1 hour
    res.sendFile(path.join(__dirname,'routes/profile.html'));
});

app.get('/posts', (req, res) => {
    res.set('Cache-Control', 'max-age=300, public, stale-while-revalidate=86400'); // cache for 5 minutes
    res.sendFile(path.join(__dirname,'routes/posts.html'));
});

app.get('/posts/:id', (req, res) => {
    res.set('Cache-Control', 'max-age=300, public'); // cache for 5 minutes
    res.sendFile(path.join(__dirname,'routes/posts.html'));
});

app.get('/login', (req, res) => {
    res.set('Cache-Control', 'max-age=60, public'); // cache for 1 minute
    res.sendFile(path.join(__dirname,'routes/login.html'));
});


const hstsOptions = {
    maxAge: 31536000, 
    includeSubDomains: true, 
    preload: true 
};

http.createServer(app).listen(PORT_HTTP, () => {
    console.log(`HTTP Server running at http://localhost:${PORT_HTTP}`);
});

const options = {
    key: fs.readFileSync('hidden/private-key.pem'),
    cert: fs.readFileSync('hidden/certificate.pem'),
};

const httpsServer = https.createServer(options, (req, res) => {
    hsts(hstsOptions)(req, res, () => {
        app(req, res);
    });
});

httpsServer.listen(PORT_HTTPS, () => {
    console.log(`HTTPS Server running at https://localhost:${PORT_HTTPS}`);
});

console.log(`PORT_HTTP is set to: ${PORT_HTTP}`);









app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/habitQuestUserAuth', {
    useNewUrlParser: true,
    useUnifiedTopology: true
    }).then(() => console.log("MongoDB connected to HabitQuestUserAuth!"))
    .catch(err => console.log(err));


// import routes and start server
const authRoutes = require('./routes/auth');

app.use('/api/auth', authRoutes);


app.listen(PORT, () => console.log(`Server 
running on port ${PORT}`));

// import admin.js route
const adminRoutes = require('./routes/admin');
app.use('/api/admin', adminRoutes);


console.log(process.env.JWT_SECRET);