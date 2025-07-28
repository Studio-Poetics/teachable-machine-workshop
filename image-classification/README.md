# Image Classification Template

## Overview
This template demonstrates how to use Teachable Machine's **Image Classification** model with p5.js to classify images from your webcam in real-time.

## What You'll Learn
- How to load and use a Teachable Machine image model
- Real-time webcam image classification
- How to display classification results
- How to respond to different image classes

## Getting Started

### 1. Train Your Model
1. Go to [Teachable Machine](https://teachablemachine.withgoogle.com/)
2. Choose "Image Project"
3. Create different classes (e.g., "Apple", "Orange", "Banana")
4. Take photos or upload images for each class
5. Train your model
6. Export the model and copy the model URL

### 2. Update the Code
Replace `YOUR_MODEL_URL_HERE` in `script.js` with your actual model URL.

### 3. Customize
- Change the canvas size in `setup()`
- Modify the `handleClassification()` function to add your own responses
- Style the interface in `style.css`
- Add sound effects, animations, or other interactions

## File Structure
```
image-classification/
├── index.html          # Main HTML file
├── script.js           # p5.js sketch with TM integration
├── style.css           # Styling
└── README.md           # This documentation
```

## Key Functions

### `preload()`
Loads the Teachable Machine model before the sketch starts.

### `setup()`
Initializes the webcam and canvas.

### `modelReady()`
Called when the model is successfully loaded.

### `handleClassification(results)`
Processes the classification results and updates the display.

### `draw()`
Main drawing loop that displays the webcam feed and classification results.

## Customization Ideas
- **Art Project**: Change colors/shapes based on objects shown to camera
- **Game**: Use object detection as game controls
- **Educational Tool**: Create learning activities based on classification
- **Interactive Installation**: Trigger different media based on objects

## Troubleshooting
- **Camera not working**: Check browser permissions
- **Model not loading**: Verify the model URL is correct
- **Poor accuracy**: Retrain with more diverse images
- **Performance issues**: Reduce canvas size or classification frequency

## Next Steps
- Try combining with other p5.js features (sound, animation, etc.)
- Create multiple models for different contexts
- Add data visualization of confidence scores
- Implement multiple camera feeds