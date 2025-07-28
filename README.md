# Teachable Machine + p5.js Templates

This directory contains three comprehensive templates for using Google's Teachable Machine with p5.js. Each template is fully documented and ready for students to customize for their own projects.

## 📁 Available Templates

### 🖼️ [Image Classification](./image-classification/)
Classify objects, faces, or scenes from your webcam in real-time.

**Perfect for:**
- Object recognition projects
- Interactive art installations
- Educational tools
- Computer vision experiments

**Key Features:**
- Real-time webcam classification
- Customizable confidence thresholds
- Clean, responsive UI
- Extensive documentation

---

### 🎵 [Audio Classification](./audio-classification/)
Classify sounds, voices, or music from your microphone with stunning visualizations.

**Perfect for:**
- Sound-reactive installations
- Music visualization
- Voice-controlled interfaces
- Audio-based games

**Key Features:**
- Real-time audio classification
- Waveform and spectrum visualization
- Particle effects
- Volume monitoring

---

### 🤸 [Pose Classification](./pose-classification/)
Detect and classify body poses using advanced pose estimation.

**Perfect for:**
- Fitness applications
- Interactive games
- Gesture control systems
- Performance art

**Key Features:**
- 17-point pose detection
- Skeleton visualization
- Real-time pose classification
- Customizable keypoint display

## 🚀 Quick Start

1. **Choose a template** from the folders above
2. **Train your model** at [Teachable Machine](https://teachablemachine.withgoogle.com/)
3. **Update the model URL** in the template's `script.js` file
4. **Customize** the response functions for your specific use case
5. **Style** the interface to match your project

## 📖 How to Use

### Step 1: Train Your Model
1. Visit [teachablemachine.withgoogle.com](https://teachablemachine.withgoogle.com/)
2. Choose Image, Audio, or Pose project
3. Create classes and add training data
4. Train your model
5. Export and copy the model URL

### Step 2: Set Up Template
1. Copy the appropriate template folder
2. Open `script.js` in your editor
3. Replace `YOUR_MODEL_URL_HERE` with your actual model URL
4. Open `index.html` in a web browser

### Step 3: Customize
Each template includes:
- **Detailed code comments** explaining every function
- **Customization examples** you can uncomment and modify
- **Responsive design** that works on desktop and mobile
- **Accessibility features** for inclusive design

## 🛠️ Technical Requirements

### Browser Support
- **Chrome/Edge**: Full support
- **Firefox**: Full support
- **Safari**: Full support (may require user interaction for audio/camera)

### Libraries Used
- **p5.js**: Creative coding framework
- **TensorFlow.js**: Machine learning runtime
- **Teachable Machine**: Pre-trained model loader

### Hardware Requirements
- **Camera**: Required for Image and Pose classification
- **Microphone**: Required for Audio classification
- **Modern CPU**: For real-time inference

## 📚 Learning Resources

### Teachable Machine
- [Official Documentation](https://teachablemachine.withgoogle.com/)
- [FAQ & Troubleshooting](https://teachablemachine.withgoogle.com/faq)
- [Community Examples](https://experiments.withgoogle.com/collection/teachablemachine)

### p5.js
- [Official Website](https://p5js.org/)
- [Reference Documentation](https://p5js.org/reference/)
- [Creative Coding Tutorials](https://www.youtube.com/c/TheCodingTrain)

### Machine Learning
- [ML5.js Documentation](https://ml5js.org/)
- [TensorFlow.js Guide](https://www.tensorflow.org/js)
- [AI for Everyone Course](https://www.coursera.org/learn/ai-for-everyone)

## 🎨 Project Ideas

### Beginner Projects
- **Magic Mirror**: Change your appearance based on gestures
- **Sound Garden**: Grow plants with different sounds
- **Pose Simon**: Memory game using body poses
- **Object Counter**: Count and track specific objects

### Intermediate Projects
- **Fitness Trainer**: AI-powered form correction
- **Music Visualizer**: Respond to different music genres
- **Sign Language Translator**: Basic gesture recognition
- **Interactive Storytelling**: Story changes based on audience

### Advanced Projects
- **Multi-modal Installation**: Combine all three classification types
- **Real-time Performance**: Live performance with AI feedback
- **Accessibility Interface**: Computer control through gestures/sounds
- **Educational Assessment**: Automated skill evaluation

## 🔧 Customization Guide

### Modifying Responses
Each template includes a `respondToClassification()` function where you can add your custom logic:

```javascript
function respondToClassification(prediction) {
    const className = prediction.className;
    const confidence = prediction.probability;
    
    // Add your custom responses here!
    switch(className.toLowerCase()) {
        case 'your_class_name':
            // Your custom code here
            break;
    }
}
```

### Styling
All templates use CSS custom properties for easy theming:

```css
:root {
    --primary-color: #your-color;
    --secondary-color: #your-color;
    /* Customize colors, fonts, spacing, etc. */
}
```

### Adding Features
- **Sound Effects**: Use p5.sound library
- **Particle Systems**: Create visual effects
- **Data Logging**: Track usage and accuracy
- **Multiple Models**: Combine different classifications

## 🐛 Troubleshooting

### Common Issues

**Model not loading:**
- Check that the model URL is correct
- Ensure you've exported your model from Teachable Machine
- Verify internet connection

**Camera/Microphone not working:**
- Check browser permissions
- Try HTTPS instead of HTTP
- Ensure hardware is connected and working

**Poor classification accuracy:**
- Retrain with more diverse data
- Check lighting conditions (for image/pose)
- Reduce background noise (for audio)

**Performance issues:**
- Reduce canvas size
- Increase classification interval
- Close other browser tabs

### Getting Help
- Check the individual template README files
- Review browser console for error messages
- Test with the original Teachable Machine interface
- Search the [p5.js forum](https://discourse.processing.org/c/p5js) for similar issues

## 🤝 Contributing

These templates are designed to be starting points for learning and creativity. Feel free to:

- **Extend** the templates with new features
- **Share** your projects and modifications
- **Improve** the documentation and examples
- **Report** bugs or suggest enhancements

## 📄 License

These templates are provided for educational use. Please respect the licenses of the underlying libraries:
- p5.js: LGPL 2.1
- TensorFlow.js: Apache 2.0
- Teachable Machine: Apache 2.0

## 🌟 Showcase

Created something amazing with these templates? We'd love to see it! These templates have been used to create:

- Interactive museum installations
- Accessible computer interfaces
- AI-powered fitness apps
- Creative coding workshops
- Student research projects

---

**Happy coding! 🎉**

Remember: The best way to learn is by experimenting. Don't be afraid to break things, try new ideas, and push the boundaries of what's possible with AI and creative coding.