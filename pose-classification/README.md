# Pose Classification Template

## Overview
This template demonstrates how to use Teachable Machine's **Pose Classification** model with p5.js to classify body poses from your webcam in real-time.

## What You'll Learn
- How to load and use a Teachable Machine pose model
- Real-time webcam pose detection and classification
- Drawing pose keypoints and skeleton
- How to respond to different pose classes
- Creating interactive pose-based applications

## Getting Started

### 1. Train Your Model
1. Go to [Teachable Machine](https://teachablemachine.withgoogle.com/)
2. Choose "Pose Project"
3. Create different classes (e.g., "Standing", "Sitting", "Arms Up", "Waving")
4. Record yourself doing different poses for each class
5. Train your model
6. Export the model and copy the model URL

### 2. Update the Code
Replace `YOUR_MODEL_URL_HERE` in `script.js` with your actual model URL.

### 3. Customize
- Change the canvas size in `setup()`
- Modify the `handleClassification()` function to add your own responses
- Customize pose visualization in `drawPose()`
- Style the interface in `style.css`
- Add sound effects, animations, or other interactions

## File Structure
```
pose-classification/
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

### `predict()`
Gets pose estimation and classification from the model.

### `handleClassification(results)`
Processes the classification results and updates the display.

### `drawPose(pose)`
Draws the detected pose keypoints and skeleton.

### `draw()`
Main drawing loop that displays the webcam feed, pose, and classification results.

## Pose Detection Features
- **17 Body Keypoints**: Nose, eyes, ears, shoulders, elbows, wrists, hips, knees, ankles
- **Skeleton Drawing**: Connects keypoints to show body structure
- **Confidence Threshold**: Only shows keypoints above confidence threshold
- **Real-time Classification**: Continuously analyzes poses

## Customization Ideas
- **Fitness App**: Count reps, track form, guide workouts
- **Interactive Game**: Use poses as game controls
- **Art Installation**: Generate visuals based on body movement
- **Educational Tool**: Teach yoga poses, dance moves, or exercises
- **Accessibility Tool**: Gesture-based computer control
- **Performance Art**: Create reactive environments

## Troubleshooting
- **Camera not working**: Check browser permissions
- **Model not loading**: Verify the model URL is correct
- **Poor pose detection**: Ensure good lighting and full body visibility
- **Inaccurate classification**: Retrain with more diverse poses
- **Performance issues**: Reduce canvas size or classification frequency

## Pose Keypoint Reference
The model detects these 17 keypoints:
1. Nose
2. Left Eye
3. Right Eye  
4. Left Ear
5. Right Ear
6. Left Shoulder
7. Right Shoulder
8. Left Elbow
9. Right Elbow
10. Left Wrist
11. Right Wrist
12. Left Hip
13. Right Hip
14. Left Knee
15. Right Knee
16. Left Ankle
17. Right Ankle

## Tips for Better Results
- **Lighting**: Use even, bright lighting
- **Background**: Plain backgrounds work best
- **Distance**: Stand 3-6 feet from camera
- **Clothing**: Avoid loose, flowing clothing
- **Pose Variety**: Train with different angles and variations

## Next Steps
- Try combining with other p5.js features (particles, sound, etc.)
- Create pose sequence recognition
- Add pose similarity scoring
- Implement pose-to-pose transitions
- Build multiplayer pose games