const express = require('express');
const app = express();
const PORT = 5000;

app.use(express.json());

// Dummy state
let currentSlide = 0;

app.post('/api/v1/:id/start', (req, res) => {
  currentSlide = 0;
  console.log(`Controller: START`);
  res.json({
    success: true,
    presentationId: req.params.id,
    action: "start",
    startedAt: new Date(),
    currentSlide
  });
});

app.post('/api/v1/:id/next', (req, res) => {
  currentSlide++;
  console.log(`Controller: NEXT → slide ${currentSlide}`);
  res.json({
    success: true,
    presentationId: req.params.id,
    action: "next",
    currentSlide
  });
});

app.post('/api/v1/:id/previous', (req, res) => {
  if (currentSlide > 0) currentSlide--;
  console.log(`Controller: PREVIOUS → slide ${currentSlide}`);
  res.json({
    success: true,
    presentationId: req.params.id,
    action: "previous",
    currentSlide
  });
});

app.post('/api/v1/:id/goto', (req, res) => {
  currentSlide = req.body.gotoSlide;
  console.log(`Controller: GOTO → slide ${currentSlide}`);
  res.json({
    success: true,
    presentationId: req.params.id,
    action: "goto",
    currentSlide
  });
});

app.post('/api/v1/:id/stop', (req, res) => {
  console.log(`Controller: STOP`);
  res.json({
    success: true,
    presentationId: req.params.id,
    action: "stop",
    stoppedAt: new Date(),
  });
});

app.post('/api/v1/:id/slide-content', (req, res) => {
    const { id } = req.params;
    const { slideNumber } = req.body;
    console.log(`Controller: Sending content for slide ${slideNumber}`);
    res.json({
      content: `Tartalom a(z) ${slideNumber}. diáról`
    });
  });

app.listen(PORT, () => {
  console.log(`Controller API running on port ${PORT}`);
});