const express = require('express');
const axios = require('axios');
const app = express();
const cors = require('cors');
const PORT = 3000;

app.use(express.json());

const allowedOrigins = ['localhost:4200', 'https://viewer.norbif.hu/'];
app.use(cors({
  origin: function(origin, callback){
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }

}));
let currentSlideData = null;
let currentSlide = 0;
let isRunning = false;

// Controller API URL
const CONTROLLER_URL = 'https://viewer.norbif.hu/api/v1';

app.get('/api/status', (req, res) => {
  res.json({ isRunning });
});

app.get('/api/current-slide', (req, res) => {
  if (!isRunning || !currentSlideData) {
    return res.status(200).json({ running: false, slideNumber: null });
  }

  res.json({
    running: true,
    slideNumber: currentSlideData.pageNumber || null
  });
});



// Hibakezelés
function respondError(res, err, status = 500) {
  console.error('Hiba:', err);
  return res.status(status).json({ success: false, error: err.message || err });
}

// Start
app.post('/:id/start', (req, res) => {
  try {
    const { slide } = req.body;

    if (!slide) throw new Error('Missing slide data in start request');

    isRunning = true;
    currentSlideData = slide;
    console.log('START received');
    res.json({ success: true });
  } catch (err) {
    respondError(res, err);
  }
});

// Stop
app.post('/:id/stop', (req, res) => {
  try {
    isRunning = false;
    currentSlideData = null;
    console.log('STOP received');
    res.json({ success: true });
  } catch (err) {
    respondError(res, err);
  }
});

// Next
app.post('/:id/next', (req, res) => {
  try {
    const { slide } = req.body;

    if (!slide) throw new Error('Missing slide data in next request');

    currentSlideData = slide;
    console.log('NEXT received');
    res.json({ success: true });
  } catch (err) {
    respondError(res, err);
  }
});

// Previous
app.post('/:id/previous', (req, res) => {
  try {
    const { slide } = req.body;

    if (!slide) throw new Error('Missing slide data in previous request');

    currentSlideData = slide;
    console.log('PREVIOUS received');
    res.json({ success: true });
  } catch (err) {
    respondError(res, err);
  }
});

// Goto
app.post('/:id/goto', (req, res) => {
  try {
    const { gotoSlide, slide } = req.body;

    if (gotoSlide === undefined) throw new Error('Missing gotoSlide number');
    if (!slide) throw new Error('Missing slide data in goto request');

    currentSlideData = slide;
    console.log(`GOTO received to slide ${gotoSlide}`);
    res.json({ success: true });
  } catch (err) {
    respondError(res, err);
  }
});

// Restart
app.post('/:id/restart', (req, res) => {
  try {
    const { slide } = req.body;

    if (!slide) throw new Error('Missing slide data in restart request');

    isRunning = true;
    currentSlideData = slide;
    console.log('RESTART received');
    res.json({ success: true });
  } catch (err) {
    respondError(res, err);
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});