const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3000;

app.use(express.json());

let currentSlide = 0;
let isRunning = false;

// Controller API URL
const CONTROLLER_URL = 'http://localhost:5000/api/v1';


app.post('/:id/start', async (req, res) => {
  const { id } = req.params;
  try {
    const controllerResponse = await axios.post(`${CONTROLLER_URL}/${id}/start`);
    isRunning = true;
    currentSlide = 0;
    console.log(`Start presentation ${id}`);
    res.json(controllerResponse.data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to start presentation' });
  }
});


app.post('/:id/next', async (req, res) => {
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


app.post('/:id/previous', async (req, res) => {
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


app.post('/:id/goto', async (req, res) => {
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


app.post('/:id/stop', async (req, res) => {
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

