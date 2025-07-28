/**
 * Teachable Machine Audio Classification Template
 * 
 * This template demonstrates how to use a Teachable Machine audio model
 * with p5.js for real-time microphone audio classification.
 * 
 * Replace YOUR_MODEL_URL_HERE with your actual Teachable Machine model URL
 */

// ========================================
// CONFIGURATION
// ========================================

// Replace this with your Teachable Machine model URL
const MODEL_URL = 'YOUR_MODEL_URL_HERE';

// Canvas dimensions
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 400;

// Audio settings
const CLASSIFICATION_INTERVAL = 1000; // milliseconds between classifications
const CONFIDENCE_THRESHOLD = 0.5; // minimum confidence to show prediction
const FFT_SIZE = 512; // FFT size for frequency analysis

// Visualization settings
const WAVEFORM_SCALE = 200;
const SPECTRUM_SCALE = 150;

// ========================================
// GLOBAL VARIABLES
// ========================================

let classifier;
let microphone;
let predictions = [];
let lastClassificationTime = 0;
let modelReady = false;
let isListening = false;

// Audio analysis
let fft;
let amplitude;
let waveform = [];
let spectrum = [];
let volume = 0;

// UI elements
let statusElement;
let predictionsElement;
let startBtn;
let stopBtn;
let volumeLevel;
let sampleRateElement;
let channelsElement;

// Visualization
let colors = [];
let particles = [];

// ========================================
// P5.JS FUNCTIONS
// ========================================

/**
 * Preload function - loads the Teachable Machine model
 */
function preload() {
    // Initialize color palette
    colors = [
        color(255, 100, 100),  // Red
        color(100, 255, 100),  // Green  
        color(100, 100, 255),  // Blue
        color(255, 255, 100),  // Yellow
        color(255, 100, 255),  // Magenta
        color(100, 255, 255)   // Cyan
    ];
}

/**
 * Setup function - initializes canvas
 */
function setup() {
    // Create canvas and attach it to the container
    let canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    canvas.parent('canvas-container');
    
    // Initialize audio analysis tools
    fft = new p5.FFT(0.8, FFT_SIZE);
    amplitude = new p5.Amplitude();
    
    // Get UI elements
    statusElement = select('#status');
    predictionsElement = select('#predictions');
    startBtn = select('#start-btn');
    stopBtn = select('#stop-btn');
    volumeLevel = select('#volume-level');
    sampleRateElement = select('#sample-rate');
    channelsElement = select('#channels');
    
    // Set up button event listeners
    startBtn.mousePressed(startListening);
    stopBtn.mousePressed(stopListening);
    
    // Load the model
    loadModel();
    
    // Set initial status
    updateStatus('Loading model...');
}

/**
 * Main drawing loop
 */
function draw() {
    // Clear background
    background(20, 25, 40);
    
    if (isListening && microphone) {
        // Get audio data
        waveform = fft.waveform();
        spectrum = fft.analyze();
        volume = amplitude.getLevel();
        
        // Update volume meter
        updateVolumeMeter(volume);
        
        // Draw audio visualizations
        drawWaveform();
        drawSpectrum();
        drawVolumeCircle();
        
        // Perform classification at intervals
        if (modelReady && millis() - lastClassificationTime > CLASSIFICATION_INTERVAL) {
            classifyAudio();
            lastClassificationTime = millis();
        }
        
        // Update particles
        updateParticles();
        drawParticles();
    } else {
        // Show idle state
        drawIdleState();
    }
    
    // Draw UI overlay
    drawOverlay();
}

// ========================================
// AUDIO FUNCTIONS
// ========================================

/**
 * Start listening to microphone
 */
function startListening() {
    if (!microphone) {
        // Create microphone input
        microphone = new p5.AudioIn();
        microphone.start();
        
        // Connect to analysis tools
        fft.setInput(microphone);
        amplitude.setInput(microphone);
        
        // Update audio info
        updateAudioInfo();
    }
    
    isListening = true;
    startBtn.attribute('disabled', true);
    stopBtn.removeAttribute('disabled');
    updateStatus('Listening... Make some sounds!');
}

/**
 * Stop listening to microphone
 */
function stopListening() {
    isListening = false;
    startBtn.removeAttribute('disabled');
    stopBtn.attribute('disabled', true);
    updateStatus('Stopped listening. Click "Start Listening" to begin.');
    
    // Clear predictions
    predictions = [];
    updatePredictionsDisplay();
}

/**
 * Update audio information display
 */
function updateAudioInfo() {
    if (microphone) {
        // Note: p5.js doesn't directly expose sample rate and channels
        // These are typical values for web audio
        sampleRateElement.html('44,100 Hz');
        channelsElement.html('1 (Mono)');
    }
}

// ========================================
// TEACHABLE MACHINE FUNCTIONS
// ========================================

/**
 * Load the Teachable Machine model
 */
async function loadModel() {
    try {
        // Check if model URL is set
        if (MODEL_URL === 'YOUR_MODEL_URL_HERE') {
            updateStatus('Please update the MODEL_URL in script.js with your Teachable Machine model URL');
            return;
        }
        
        // Load the model
        classifier = await tmAudio.create(MODEL_URL + 'model.json', MODEL_URL + 'metadata.json');
        console.log('Model loaded successfully!');
        modelReady = true;
        updateStatus('Model ready! Click "Start Listening" to begin.');
        
    } catch (error) {
        console.error('Error loading model:', error);
        updateStatus('Error loading model. Please check the model URL.');
    }
}

/**
 * Classify the current audio
 */
async function classifyAudio() {
    if (!classifier || !isListening) return;
    
    try {
        // Get predictions from the model
        const predictions = await classifier.predict();
        handleClassification(predictions);
        
    } catch (error) {
        console.error('Classification error:', error);
    }
}

/**
 * Handle classification results
 * @param {Object[]} results - Array of classification results
 */
function handleClassification(results) {
    // Store predictions
    predictions = results;
    
    // Update UI with predictions
    updatePredictionsDisplay();
    
    // Get the top prediction
    const topPrediction = results[0];
    
    // Only respond if confidence is above threshold
    if (topPrediction.probability > CONFIDENCE_THRESHOLD) {
        respondToClassification(topPrediction);
    }
}

/**
 * Respond to classification results
 * CUSTOMIZE THIS FUNCTION for your specific use case!
 * 
 * @param {Object} prediction - The top prediction object
 */
function respondToClassification(prediction) {
    const className = prediction.className;
    const confidence = prediction.probability;
    
    // Create particles based on classification
    createParticles(className, confidence);
    
    // Example responses - customize these!
    switch(className.toLowerCase()) {
        case 'background noise': // Common class name
            // Subtle response for background noise
            console.log('Background noise detected');
            break;
            
        case 'clapping':
            // Create burst of particles for clapping
            console.log('Clapping detected with confidence:', confidence);
            createBurstEffect();
            break;
            
        case 'whistling':
            // Create wave effect for whistling
            console.log('Whistling detected with confidence:', confidence);
            createWaveEffect();
            break;
            
        case 'speaking':
            // Visualize speech with different colors
            console.log('Speaking detected with confidence:', confidence);
            createSpeechEffect();
            break;
            
        default:
            // Handle other classes
            console.log('Detected:', className, 'with confidence:', confidence);
    }
}

// ========================================
// VISUALIZATION FUNCTIONS
// ========================================

/**
 * Draw waveform visualization
 */
function drawWaveform() {
    push();
    translate(0, height / 4);
    stroke(100, 255, 150);
    strokeWeight(2);
    noFill();
    
    beginShape();
    for (let i = 0; i < waveform.length; i++) {
        let x = map(i, 0, waveform.length, 0, width);
        let y = map(waveform[i], -1, 1, -WAVEFORM_SCALE/2, WAVEFORM_SCALE/2);
        vertex(x, y);
    }
    endShape();
    
    // Label
    fill(255, 200);
    noStroke();
    textAlign(LEFT, CENTER);
    text('Waveform', 10, -WAVEFORM_SCALE/2 - 20);
    
    pop();
}

/**
 * Draw frequency spectrum visualization
 */
function drawSpectrum() {
    push();
    translate(0, height * 3/4);
    
    for (let i = 0; i < spectrum.length; i++) {
        let x = map(i, 0, spectrum.length, 0, width);
        let h = map(spectrum[i], 0, 255, 0, SPECTRUM_SCALE);
        
        // Color based on frequency
        let hue = map(i, 0, spectrum.length, 0, 360);
        colorMode(HSB);
        fill(hue, 80, 90, 0.8);
        noStroke();
        
        rect(x, 0, width / spectrum.length, -h);
    }
    
    colorMode(RGB);
    
    // Label
    fill(255, 200);
    noStroke();
    textAlign(LEFT, CENTER);
    text('Frequency Spectrum', 10, -SPECTRUM_SCALE - 20);
    
    pop();
}

/**
 * Draw volume circle
 */
function drawVolumeCircle() {
    push();
    translate(width - 100, height - 100);
    
    // Background circle
    stroke(100);
    strokeWeight(2);
    noFill();
    circle(0, 0, 80);
    
    // Volume circle
    let volumeRadius = map(volume, 0, 1, 0, 40);
    fill(255, 100, 100, 150);
    noStroke();
    circle(0, 0, volumeRadius * 2);
    
    // Label
    fill(255);
    textAlign(CENTER, CENTER);
    text('VOL', 0, 50);
    
    pop();
}

/**
 * Draw idle state when not listening
 */
function drawIdleState() {
    push();
    fill(100, 120);
    textAlign(CENTER, CENTER);
    textSize(24);
    text('Click "Start Listening" to begin audio classification', width/2, height/2);
    pop();
}

/**
 * Draw overlay information
 */
function drawOverlay() {
    if (!isListening || !predictions.length) return;
    
    const topPrediction = predictions[0];
    
    if (topPrediction.probability > CONFIDENCE_THRESHOLD) {
        push();
        
        // Semi-transparent background
        fill(0, 0, 0, 150);
        noStroke();
        rect(10, 10, 300, 60);
        
        // Text
        fill(255);
        textAlign(LEFT, TOP);
        textSize(18);
        text(topPrediction.className, 20, 25);
        
        textSize(14);
        const confidence = (topPrediction.probability * 100).toFixed(1);
        text(`Confidence: ${confidence}%`, 20, 50);
        
        pop();
    }
}

// ========================================
// PARTICLE EFFECTS
// ========================================

/**
 * Create particles based on classification
 */
function createParticles(className, confidence) {
    const numParticles = Math.floor(confidence * 20);
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    for (let i = 0; i < numParticles; i++) {
        particles.push({
            x: random(width),
            y: random(height),
            vx: random(-3, 3),
            vy: random(-3, 3),
            size: random(3, 8),
            life: 255,
            color: color,
            className: className
        });
    }
}

/**
 * Create burst effect for sudden sounds
 */
function createBurstEffect() {
    for (let i = 0; i < 30; i++) {
        let angle = random(TWO_PI);
        let speed = random(2, 8);
        particles.push({
            x: width / 2,
            y: height / 2,
            vx: cos(angle) * speed,
            vy: sin(angle) * speed,
            size: random(5, 12),
            life: 255,
            color: color(255, 150, 50),
            type: 'burst'
        });
    }
}

/**
 * Create wave effect for continuous sounds
 */
function createWaveEffect() {
    for (let i = 0; i < 20; i++) {
        particles.push({
            x: random(width),
            y: height / 2 + sin(frameCount * 0.1 + i) * 50,
            vx: random(-1, 1),
            vy: random(-2, 2),
            size: random(3, 6),
            life: 255,
            color: color(100, 150, 255),
            type: 'wave'
        });
    }
}

/**
 * Create speech visualization effect
 */
function createSpeechEffect() {
    for (let i = 0; i < 15; i++) {
        particles.push({
            x: random(width * 0.2, width * 0.8),
            y: random(height * 0.3, height * 0.7),
            vx: random(-2, 2),
            vy: random(-2, 2),
            size: random(2, 6),
            life: 255,
            color: color(150, 255, 150),
            type: 'speech'
        });
    }
}

/**
 * Update particle positions and life
 */
function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        let p = particles[i];
        
        // Update position
        p.x += p.vx;
        p.y += p.vy;
        
        // Update life
        p.life -= 3;
        
        // Add gravity for burst particles
        if (p.type === 'burst') {
            p.vy += 0.1;
        }
        
        // Remove dead particles
        if (p.life <= 0) {
            particles.splice(i, 1);
        }
    }
}

/**
 * Draw particles
 */
function drawParticles() {
    for (let p of particles) {
        push();
        
        // Set color with alpha based on life
        let alpha = map(p.life, 0, 255, 0, 255);
        p.color.setAlpha(alpha);
        fill(p.color);
        noStroke();
        
        // Draw particle
        circle(p.x, p.y, p.size);
        
        pop();
    }
}

// ========================================
// UI FUNCTIONS
// ========================================

/**
 * Update the status message
 * @param {string} message - Status message to display
 */
function updateStatus(message) {
    if (statusElement) {
        statusElement.html(message);
    }
}

/**
 * Update the volume meter
 * @param {number} vol - Volume level (0-1)
 */
function updateVolumeMeter(vol) {
    if (volumeLevel) {
        const percentage = vol * 100;
        volumeLevel.style('width', percentage + '%');
        
        // Change color based on volume
        if (percentage < 30) {
            volumeLevel.style('background-color', '#10b981'); // Green
        } else if (percentage < 70) {
            volumeLevel.style('background-color', '#f59e0b'); // Yellow
        } else {
            volumeLevel.style('background-color', '#ef4444'); // Red
        }
    }
}

/**
 * Update the predictions display
 */
function updatePredictionsDisplay() {
    if (!predictionsElement || !predictions.length) return;
    
    let html = '<h3>Predictions:</h3>';
    
    // Show top 3 predictions
    for (let i = 0; i < Math.min(3, predictions.length); i++) {
        const prediction = predictions[i];
        const percentage = (prediction.probability * 100).toFixed(1);
        const barWidth = prediction.probability * 100;
        
        html += `
            <div class="prediction-item">
                <div class="prediction-label">${prediction.className}</div>
                <div class="prediction-bar">
                    <div class="prediction-fill" style="width: ${barWidth}%"></div>
                    <span class="prediction-confidence">${percentage}%</span>
                </div>
            </div>
        `;
    }
    
    predictionsElement.html(html);
}

// ========================================
// HELPER FUNCTIONS
// ========================================

/**
 * Handle window resize
 */
function windowResized() {
    // Optionally implement responsive behavior
    // resizeCanvas(windowWidth, windowHeight);
}

/**
 * Handle key presses
 */
function keyPressed() {
    // Add keyboard interactions if needed
    // Example: Press 's' to save a screenshot
    if (key === 's' || key === 'S') {
        saveCanvas('audio-classification-screenshot', 'png');
    }
    
    // Space bar to toggle listening
    if (key === ' ') {
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    }
}