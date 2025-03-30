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

let currentSlide = 0;
let isRunning = false;

// Controller API URL
const CONTROLLER_URL = 'http://localhost:5000/api/v1';

app.get('/api/status', (req, res) => {
  res.json({ isRunning });
});

app.get('/api/current-slide', (req, res) => {
    res.json({ currentSlide });
});

app.post('/api/:id/start', async (req, res) => {
  const { id } = req.params;
  try {
    const controllerResponse = await axios.post(`${CONTROLLER_URL}/${id}/start`);
    isRunning = true;
    currentSlide = 0;
    console.log(`Start presentation ${id}`);
    res.json(controllerResponse.data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to start presentation'});
  }
});


app.post('/api/:id/next', async (req, res) => {
    const { id } = req.params;
    if (!isRunning) return res.status(400).json({ error: 'Presentation not running' });
  
    try {
      const controllerResponse = await axios.post(`${CONTROLLER_URL}/${id}/next`);
      currentSlide = controllerResponse.data.currentSlide;
      console.log(`Next slide: ${currentSlide}`);
  
      const slideContentResponse = await axios.post(`${CONTROLLER_URL}/${id}/slide-content`, {
        slideNumber: currentSlide
      });
  
      const slideContent = slideContentResponse.data.content;
      console.log(`Slide Content received: ${slideContent}`);
  
      res.json({
        ...controllerResponse.data,
        slideContent
      });
  
    } catch (err) {
      console.error('Error:', err.message);
      res.status(500).json({ error: 'Failed to move to next slide' });
    }
  });


app.post('/api/:id/previous', async (req, res) => {
  const { id } = req.params;
  if (!isRunning) return res.status(400).json({ error: 'Presentation not running' });

  try {
    const controllerResponse = await axios.post(`${CONTROLLER_URL}/${id}/previous`);
    currentSlide = controllerResponse.data.currentSlide;
    console.log(`Previous slide: ${currentSlide}`);
    res.json(controllerResponse.data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to move to previous slide' });
  }
});


app.post('/api/:id/goto', async (req, res) => {
  const { id } = req.params;
  const { gotoSlide } = req.body;
  if (!isRunning) return res.status(400).json({ error: 'Presentation not running' });

    try {
    const controllerResponse = await axios.post(`${CONTROLLER_URL}/${id}/goto`, { gotoSlide });
    currentSlide = controllerResponse.data.currentSlide;
    console.log(`Goto slide: ${currentSlide}`);
    res.json(controllerResponse.data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to goto slide' });
  }
});


app.post('/api/:id/stop', async (req, res) => {
  const { id } = req.params;
  try {
    const controllerResponse = await axios.post(`${CONTROLLER_URL}/${id}/stop`);
    isRunning = false;
    console.log(`Presentation stopped`);
    res.json(controllerResponse.data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to stop presentation' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});