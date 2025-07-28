/**
 * Teachable Machine Image Classification Template
 * 
 * This template demonstrates how to use a Teachable Machine image model
 * with p5.js for real-time webcam image classification.
 * 
 * Replace YOUR_MODEL_URL_HERE with your actual Teachable Machine model URL
 */

// ========================================
// CONFIGURATION
// ========================================

// Replace this with your Teachable Machine model URL
const MODEL_URL = "https://teachablemachine.withgoogle.com/models/TZINV8fY4/";

// Canvas dimensions
const CANVAS_WIDTH = 640;
const CANVAS_HEIGHT = 480;

// Classification settings
const CLASSIFICATION_INTERVAL = 500; // milliseconds between classifications
const CONFIDENCE_THRESHOLD = 0.3; // minimum confidence to show prediction

// ========================================
// GLOBAL VARIABLES
// ========================================

let classifier;
let video;
let predictions = [];
let lastClassificationTime = 0;
let modelReady = false;

// UI elements
let statusElement;
let predictionsElement;

// ========================================
// P5.JS FUNCTIONS
// ========================================

/**
 * Setup function - initializes canvas and webcam
 */
function setup() {
    // Create canvas and attach it to the container
    let canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    canvas.parent('canvas-container');
    
    // Initialize webcam
    video = createCapture(VIDEO);
    video.size(CANVAS_WIDTH, CANVAS_HEIGHT);
    video.hide(); // Hide the default video element
    
    // Get UI elements
    statusElement = select('#status');
    predictionsElement = select('#predictions');
    
    // Load the Teachable Machine model
    loadTMModel();
    
    // Set initial status
    updateStatus('Loading model...');
}

/**
 * Main drawing loop
 */
function draw() {
    // Draw the webcam feed
    image(video, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Add overlay frame
    drawFrame();
    
    // Perform classification at intervals
    if (modelReady && millis() - lastClassificationTime > CLASSIFICATION_INTERVAL) {
        classifyVideo();
        lastClassificationTime = millis();
    }
    
    // Draw predictions on canvas
    drawPredictions();
}

// ========================================
// TEACHABLE MACHINE FUNCTIONS
// ========================================

/**
 * Load the Teachable Machine model
 */
async function loadTMModel() {
    try {
        // Check if model URL is set
        if (MODEL_URL === 'YOUR_MODEL_URL_HERE') {
            updateStatus('Please update the MODEL_URL in script.js with your Teachable Machine model URL');
            return;
        }
        
        // Ensure URL ends with slash
        const baseURL = MODEL_URL.endsWith('/') ? MODEL_URL : MODEL_URL + '/';
        
        // Load the model
        const modelURL = baseURL + 'model.json';
        const metadataURL = baseURL + 'metadata.json';
        
        console.log('Loading model from:', modelURL);
        console.log('Loading metadata from:', metadataURL);
        
        classifier = await tmImage.load(modelURL, metadataURL);
        console.log('Model loaded successfully!');
        modelReady = true;
        updateStatus('Model ready! Show objects to the camera.');
        
    } catch (error) {
        console.error('Error loading model:', error);
        updateStatus('Error loading model. Please check the model URL and ensure it\'s an Image model.');
    }
}

/**
 * Classify the current video frame
 */
async function classifyVideo() {
    if (classifier && video && modelReady) {
        try {
            const predictions = await classifier.predict(video.canvas);
            handleClassification(null, predictions);
        } catch (error) {
            console.error('Classification error:', error);
        }
    }
}

/**
 * Handle classification results
 * @param {Error} error - Error object if classification failed
 * @param {Object[]} results - Array of classification results
 */
function handleClassification(error, results) {
    if (error) {
        console.error('Classification error:', error);
        return;
    }
    
    // Validate results
    if (!results || !Array.isArray(results) || results.length === 0) {
        console.warn('Invalid classification results:', results);
        return;
    }
    
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
    
    // Example responses - customize these!
    switch(className.toLowerCase()) {
        case 'class 1': // Replace with your actual class names
            // Add your custom response here
            // Example: change background color, play sound, trigger animation
            console.log('Detected Class 1 with confidence:', confidence);
            break;
            
        case 'class 2':
            // Add your custom response here
            console.log('Detected Class 2 with confidence:', confidence);
            break;
            
        case 'class 3':
            // Add your custom response here
            console.log('Detected Class 3 with confidence:', confidence);
            break;
            
        default:
            // Handle unknown classes
            console.log('Detected unknown class:', className, 'with confidence:', confidence);
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

/**
 * Draw a frame around the canvas
 */
function drawFrame() {
    push();
    stroke(255);
    strokeWeight(4);
    noFill();
    rect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    pop();
}

/**
 * Draw predictions overlay on canvas
 */
function drawPredictions() {
    if (!predictions.length) return;
    
    const topPrediction = predictions[0];
    
    // Only show if confidence is above threshold
    if (topPrediction.probability > CONFIDENCE_THRESHOLD) {
        push();
        
        // Semi-transparent background
        fill(0, 0, 0, 150);
        noStroke();
        rect(10, 10, 250, 50);
        
        // Text
        fill(255);
        textAlign(LEFT, TOP);
        textSize(16);
        text(topPrediction.className, 20, 25);
        
        textSize(14);
        const confidence = (topPrediction.probability * 100).toFixed(1);
        text(`Confidence: ${confidence}%`, 20, 45);
        
        pop();
    }
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
        saveCanvas('classification-screenshot', 'png');
    }
}

// ========================================
// CUSTOMIZATION EXAMPLES
// ========================================

/**
 * Example: Change background color based on classification
 * Uncomment and modify this function, then call it from respondToClassification()
 */
/*
function changeBackgroundColor(className) {
    const colors = {
        'apple': color(255, 0, 0),      // Red
        'banana': color(255, 255, 0),   // Yellow
        'orange': color(255, 165, 0)    // Orange
    };
    
    if (colors[className.toLowerCase()]) {
        background(colors[className.toLowerCase()]);
    }
}
*/

/**
 * Example: Create particles based on classification
 * Implement this if you want particle effects
 */
/*
let particles = [];

function createParticles(className, confidence) {
    for (let i = 0; i < confidence * 10; i++) {
        particles.push({
            x: random(width),
            y: random(height),
            vx: random(-2, 2),
            vy: random(-2, 2),
            life: 255,
            className: className
        });
    }
}

function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        let p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 3;
        
        if (p.life <= 0) {
            particles.splice(i, 1);
        }
    }
}

function drawParticles() {
    for (let p of particles) {
        push();
        fill(255, p.life);
        noStroke();
        circle(p.x, p.y, 5);
        pop();
    }
}
*/