# Audio Classification Template

## Overview
This template demonstrates how to use Teachable Machine's **Audio Classification** model with p5.js to classify sounds from your microphone in real-time.

## What You'll Learn
- How to load and use a Teachable Machine audio model
- Real-time microphone audio classification
- Audio visualization with p5.js
- How to respond to different sound classes

## Getting Started

### 1. Train Your Model
1. Go to [Teachable Machine](https://teachablemachine.withgoogle.com/)
2. Choose "Audio Project"
3. Create different classes (e.g., "Clapping", "Whistling", "Background Noise")
4. Record audio samples for each class (18 seconds each recommended)
5. Train your model
6. Export the model and copy the model URL

### 2. Update the Code
Replace `YOUR_MODEL_URL_HERE` in `script.js` with your actual model URL.

### 3. Customize
- Modify the `handleClassification()` function to add your own responses
- Change the audio visualization in `drawAudioVisualization()`
- Style the interface in `style.css`
- Add sound effects, animations, or other interactions

## File Structure
```
audio-classification/
├── index.html          # Main HTML file
├── script.js           # p5.js sketch with TM integration
├── style.css           # Styling
└── README.md           # This documentation
```

## Key Functions

### `preload()`
Loads the Teachable Machine model before the sketch starts.

### `setup()`
Initializes the microphone and canvas.

### `modelReady()`
Called when the model is successfully loaded.

### `handleClassification(results)`
Processes the classification results and updates the display.

### `draw()`
Main drawing loop that displays audio visualization and classification results.

### `drawAudioVisualization()`
Creates visual representation of the audio input.

## Audio Features
- **Real-time classification**: Continuously analyzes microphone input
- **Audio visualization**: Visual waveform and frequency representation
- **Confidence display**: Shows prediction confidence levels
- **Volume meter**: Displays current audio input level

## Customization Ideas
- **Music Visualizer**: Create different visuals based on detected sounds
- **Sound-Controlled Game**: Use audio classification as game controls
- **Interactive Art**: Generate art based on different sounds
- **Educational Tool**: Create learning activities with sound recognition
- **Accessibility Tool**: Visual feedback for audio events

## Troubleshooting
- **Microphone not working**: Check browser permissions for microphone access
- **Model not loading**: Verify the model URL is correct
- **Poor accuracy**: Retrain with more diverse audio samples
- **No audio detected**: Check microphone volume and system audio settings
- **Background noise**: Train a "background noise" or "silence" class

## Browser Compatibility
- Chrome/Chromium: Full support
- Firefox: Full support
- Safari: Full support (may require user interaction to start audio)
- Edge: Full support

## Performance Tips
- Reduce canvas size for better performance
- Decrease classification frequency if needed
- Use `frameRate()` to control animation speed
- Consider using `noLoop()` and `redraw()` for static visualizations

## Next Steps
- Try combining with other p5.js features (visuals, animations, etc.)
- Create multiple models for different contexts
- Add audio recording and playback features
- Implement real-time audio effects based on classification