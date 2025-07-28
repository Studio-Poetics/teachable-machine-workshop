/**
 * Teachable Machine Pose Classification Template
 * 
 * This template demonstrates how to use a Teachable Machine pose model
 * with p5.js for real-time pose detection and classification.
 * 
 * Replace YOUR_MODEL_URL_HERE with your actual Teachable Machine model URL
 */

// ========================================
// CONFIGURATION
// ========================================

// Replace this with your Teachable Machine model URL
const MODEL_URL = "https://teachablemachine.withgoogle.com/models/-A0DTC3da/";

// Canvas dimensions
const CANVAS_WIDTH = 640;
const CANVAS_HEIGHT = 480;

// Classification settings
const CLASSIFICATION_INTERVAL = 500; // milliseconds between classifications
const CONFIDENCE_THRESHOLD = 0.6; // minimum confidence to show prediction
const KEYPOINT_CONFIDENCE = 0.5; // minimum confidence to show keypoints

// Visual settings
const KEYPOINT_SIZE = 8;
const SKELETON_THICKNESS = 3;

// ========================================
// GLOBAL VARIABLES
// ========================================

let model;
let webcam;
let predictions = [];
let lastClassificationTime = 0;
let modelReady = false;
let isRunning = false;
let webcamReady = false;

// Current pose data
let currentPose = null;
let currentLabel = null;
let currentConfidence = 0;

// UI elements
let statusElement;
let predictionsElement;
let startBtn;
let stopBtn;
let showKeypointsCheckbox;
let showSkeletonCheckbox;
let confidenceSlider;
let confidenceValueSpan;
let currentPoseDisplay;
let keypointsCountSpan;
let poseConfidenceSpan;

// Visualization settings
let showKeypoints = true;
let showSkeleton = true;
let keypointConfidenceThreshold = 0.5;

// Colors for different body parts
const colors = {
    nose: [255, 0, 0],
    leftEye: [255, 100, 0],
    rightEye: [255, 100, 0],
    leftEar: [255, 200, 0],
    rightEar: [255, 200, 0],
    leftShoulder: [0, 255, 0],
    rightShoulder: [0, 255, 0],
    leftElbow: [0, 255, 100],
    rightElbow: [0, 255, 100],
    leftWrist: [0, 255, 200],
    rightWrist: [0, 255, 200],
    leftHip: [0, 0, 255],
    rightHip: [0, 0, 255],
    leftKnee: [100, 0, 255],
    rightKnee: [100, 0, 255],
    leftAnkle: [200, 0, 255],
    rightAnkle: [200, 0, 255]
};

// Pose connections for skeleton
const poseConnections = [
    ['leftShoulder', 'rightShoulder'],
    ['leftShoulder', 'leftElbow'],
    ['leftElbow', 'leftWrist'],
    ['rightShoulder', 'rightElbow'],
    ['rightElbow', 'rightWrist'],
    ['leftShoulder', 'leftHip'],
    ['rightShoulder', 'rightHip'],
    ['leftHip', 'rightHip'],
    ['leftHip', 'leftKnee'],
    ['leftKnee', 'leftAnkle'],
    ['rightHip', 'rightKnee'],
    ['rightKnee', 'rightAnkle']
];

// ========================================
// P5.JS FUNCTIONS
// ========================================

/**
 * Setup function - initializes canvas and UI
 */
function setup() {
    console.log('Setup function called');
    
    // Create canvas and attach it to the container
    let canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    canvas.parent('canvas-container');
    
    // Store canvas reference globally for debugging
    window.p5Canvas = canvas;
    console.log('Canvas created:', canvas);
    
    // Get UI elements
    statusElement = select('#status');
    predictionsElement = select('#predictions');
    startBtn = select('#start-btn');
    stopBtn = select('#stop-btn');
    showKeypointsCheckbox = select('#show-keypoints');
    showSkeletonCheckbox = select('#show-skeleton');
    confidenceSlider = select('#confidence-slider');
    confidenceValueSpan = select('#confidence-value');
    currentPoseDisplay = select('#current-pose-display');
    keypointsCountSpan = select('#keypoints-count');
    poseConfidenceSpan = select('#pose-confidence');
    
    console.log('UI elements found:', {
        statusElement: !!statusElement,
        startBtn: !!startBtn,
        stopBtn: !!stopBtn
    });
    
    // Set up event listeners
    startBtn.mousePressed(startCamera);
    stopBtn.mousePressed(stopCamera);
    
    showKeypointsCheckbox.changed(() => {
        showKeypoints = showKeypointsCheckbox.checked();
    });
    
    showSkeletonCheckbox.changed(() => {
        showSkeleton = showSkeletonCheckbox.checked();
    });
    
    confidenceSlider.input(() => {
        keypointConfidenceThreshold = parseFloat(confidenceSlider.value());
        confidenceValueSpan.html(keypointConfidenceThreshold.toFixed(1));
    });
    
    // Load the model
    loadTMModel();
    
    // Set initial status
    updateStatus('Loading model...');
}

/**
 * Main drawing loop
 */
function draw() {
    // Clear background
    background(40, 45, 60);
    
    if (isRunning && webcamReady && webcam && webcam.canvas) {
        // Force webcam update in draw loop as backup
        try {
            webcam.update();
        } catch (e) {
            // Ignore update errors
        }
        
        // Make sure webcam canvas is ready
        if (webcam && webcam.canvas && 
            typeof webcam.canvas.width !== 'undefined' && 
            typeof webcam.canvas.height !== 'undefined' &&
            webcam.canvas.width > 0 && webcam.canvas.height > 0) {
            
            // Debug webcam canvas content
            console.log('Webcam canvas has video data:', !webcam.canvas.isBlank);
            
            // Check if webcam canvas has actual video content
            let ctx = drawingContext;
            
            // Try to get image data to see if there's actual content
            try {
                let imageData = webcam.canvas.getContext('2d').getImageData(0, 0, 100, 100);
                let hasNonZeroPixels = false;
                for (let i = 0; i < imageData.data.length; i += 4) {
                    if (imageData.data[i] > 0 || imageData.data[i+1] > 0 || imageData.data[i+2] > 0) {
                        hasNonZeroPixels = true;
                        break;
                    }
                }
                console.log('Webcam canvas has video content:', hasNonZeroPixels);
                
                if (hasNonZeroPixels) {
                    // Simple direct drawing like the working example
                    let ctx = drawingContext;
                    ctx.save();
                    ctx.scale(-1, 1); // Mirror effect
                    ctx.translate(-width, 0);
                    ctx.drawImage(webcam.canvas, 0, 0, width, height);
                    ctx.restore();
                    
                    // Only log occasionally to avoid spam
                    if (frameCount % 60 === 0) {
                        console.log('Drawing webcam video feed');
                    }
                } else {
                    // Don't draw placeholder every frame, just when needed
                    if (frameCount % 30 === 0) {
                        console.log('Waiting for webcam video data...');
                    }
                }
            } catch (error) {
                console.error('Error checking webcam canvas content:', error);
                
                // Fallback - just try to draw it
                ctx.drawImage(webcam.canvas, 0, 0, width, height);
            }
            
        } else {
            // Draw a test rectangle to show the drawing area
            fill(255, 0, 0, 100);
            noStroke();
            rect(0, 0, width, height);
            fill(255);
            textAlign(CENTER, CENTER);
            text('Webcam canvas not ready', width/2, height/2);
        }
        
        // Draw pose visualization
        if (currentPose) {
            drawPose(currentPose);
        }
        
        // Perform classification at intervals
        if (modelReady && millis() - lastClassificationTime > CLASSIFICATION_INTERVAL) {
            console.log('Attempting prediction - modelReady:', modelReady);
            predict();
            lastClassificationTime = millis();
        } else {
            if (frameCount % 60 === 0) { // Log every second
                console.log('Prediction check - modelReady:', modelReady, 'timeSinceLastClassification:', millis() - lastClassificationTime);
            }
        }
        
        // Draw overlay information
        drawOverlay();
        
    } else {
        // Show idle state
        drawIdleState();
    }
    
    // Draw frame
    drawFrame();
}

// ========================================
// CAMERA FUNCTIONS
// ========================================

/**
 * Start the camera
 */
async function startCamera() {
    try {
        updateStatus('Initializing camera...');
        
        // Initialize webcam
        const size = 640;
        const flip = true;
        webcam = new tmPose.Webcam(size, size, flip);
        
        console.log('Webcam created, setting up...');
        await webcam.setup();
        
        console.log('Webcam setup complete, starting...');
        await webcam.play();
        
        // Wait longer for the webcam to start streaming
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Force initial update
        await webcam.update();
        
        console.log('Webcam canvas:', webcam.canvas);
        if (webcam.canvas && typeof webcam.canvas.width !== 'undefined' && typeof webcam.canvas.height !== 'undefined') {
            console.log('Webcam canvas dimensions:', webcam.canvas.width, 'x', webcam.canvas.height);
        } else {
            console.log('Webcam canvas dimensions not available yet');
        }
        
        isRunning = true;
        webcamReady = true;
        startBtn.attribute('disabled', true);
        stopBtn.removeAttribute('disabled');
        updateStatus('Camera started! Stand back and strike a pose!');
        
        // Start the webcam update loop
        loop();
        
        // Debug: Check if webcam is updating
        setInterval(() => {
            if (isRunning && webcam && webcam.canvas) {
                console.log('Webcam update check - frame:', frameCount);
            }
        }, 2000);
        
    } catch (error) {
        console.error('Error starting camera:', error);
        updateStatus('Error starting camera. Please check permissions and try again.');
    }
}

/**
 * Stop the camera
 */
function stopCamera() {
    isRunning = false;
    webcamReady = false;
    startBtn.removeAttribute('disabled');
    stopBtn.attribute('disabled', true);
    updateStatus('Camera stopped. Click "Start Camera" to begin.');
    
    // Clear current pose data
    currentPose = null;
    currentLabel = null;
    currentConfidence = 0;
    predictions = [];
    
    // Update displays
    updatePredictionsDisplay();
    updateCurrentPoseDisplay();
    updatePoseStats();
    
    if (webcam) {
        webcam.stop();
    }
}

/**
 * Webcam loop for pose detection
 */
function loop() {
    if (isRunning && webcam) {
        try {
            // Update webcam canvas
            webcam.update();
            
            // Continue the loop
            requestAnimationFrame(loop);
        } catch (error) {
            console.error('Webcam loop error:', error);
            // Restart the loop even if there's an error
            setTimeout(loop, 16); // ~60fps fallback
        }
    }
}

// ========================================
// TEACHABLE MACHINE FUNCTIONS
// ========================================

/**
 * Load the Teachable Machine model
 */
async function loadTMModel() {
    try {
        console.log('Starting model load process with URL:', MODEL_URL);
        
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
        
        // Test if URLs are accessible
        try {
            const modelResponse = await fetch(modelURL);
            const metadataResponse = await fetch(metadataURL);
            
            console.log('Model URL response status:', modelResponse.status);
            console.log('Metadata URL response status:', metadataResponse.status);
            
            if (!modelResponse.ok) {
                throw new Error(`Model URL returned ${modelResponse.status}: ${modelResponse.statusText}`);
            }
            if (!metadataResponse.ok) {
                throw new Error(`Metadata URL returned ${metadataResponse.status}: ${metadataResponse.statusText}`);
            }
            
        } catch (fetchError) {
            console.error('Error accessing model URLs:', fetchError);
            updateStatus('Error: Cannot access model files. Please check the model URL.');
            return;
        }
        
        updateStatus('Model files accessible, loading model...');
        
        model = await tmPose.load(modelURL, metadataURL);
        console.log('Model loaded successfully!');
        console.log('Model details:', model);
        modelReady = true;
        updateStatus('Model ready! Click "Start Camera" to begin.');
        
    } catch (error) {
        console.error('Error loading model:', error);
        console.error('Error details:', error.message);
        updateStatus('Error loading model: ' + error.message);
    }
}

/**
 * Predict pose and classify
 */
async function predict() {
    console.log('predict() called - model:', !!model, 'webcam:', !!webcam, 'isRunning:', isRunning);
    if (!model || !webcam || !isRunning) return;
    
    try {
        // Make sure webcam canvas is ready
        if (!webcam || !webcam.canvas || 
            typeof webcam.canvas.width === 'undefined' || 
            typeof webcam.canvas.height === 'undefined' ||
            webcam.canvas.width === 0 || webcam.canvas.height === 0) {
            console.log('Webcam canvas not ready yet');
            return;
        }
        
        // Simplified prediction flow like the working example
        const { pose, posenetOutput } = await model.estimatePose(webcam.canvas);
        const prediction = await model.predict(posenetOutput);
        
        console.log('Prediction result:', prediction);
        
        currentPose = pose;
        
        // Handle the prediction results directly
        if (prediction && Array.isArray(prediction) && prediction.length > 0) {
            handleClassification(prediction);
        }
        
        // Update pose statistics
        updatePoseStats();
        
    } catch (error) {
        console.error('Prediction error:', error);
        console.error('Error details:', error.message);
        console.error('Stack trace:', error.stack);
    }
}

/**
 * Handle classification results
 * @param {Object[]} results - Array of classification results
 */
function handleClassification(results) {
    console.log('handleClassification called with results:', results);
    
    // Validate results
    if (!results || !Array.isArray(results) || results.length === 0) {
        console.warn('Invalid classification results:', results);
        return;
    }
    
    // Validate each result has required properties
    const validResults = results.filter(result => 
        result && 
        typeof result === 'object' && 
        typeof result.probability === 'number' && 
        typeof result.className === 'string'
    );
    
    if (validResults.length === 0) {
        console.warn('No valid classification results found:', results);
        return;
    }
    
    // Store predictions
    predictions = validResults;
    
    // Sort by confidence
    predictions.sort((a, b) => b.probability - a.probability);
    
    // Update UI with predictions
    updatePredictionsDisplay();
    
    // Get the top prediction
    const topPrediction = predictions[0];
    
    // Update current pose if confidence is above threshold
    if (topPrediction.probability > CONFIDENCE_THRESHOLD) {
        currentLabel = topPrediction.className;
        currentConfidence = topPrediction.probability;
        
        // Respond to classification
        respondToClassification(topPrediction);
    } else {
        currentLabel = null;
        currentConfidence = 0;
    }
    
    // Update current pose display
    updateCurrentPoseDisplay();
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
        case 'standing':
            // Response for standing pose
            console.log('Standing pose detected with confidence:', confidence);
            break;
            
        case 'sitting':
            // Response for sitting pose
            console.log('Sitting pose detected with confidence:', confidence);
            break;
            
        case 'arms up':
            // Response for arms up pose
            console.log('Arms up pose detected with confidence:', confidence);
            break;
            
        case 'waving':
            // Response for waving pose
            console.log('Waving pose detected with confidence:', confidence);
            break;
            
        default:
            // Handle other poses
            console.log('Detected:', className, 'with confidence:', confidence);
    }
}

// ========================================
// VISUALIZATION FUNCTIONS
// ========================================

/**
 * Draw the detected pose
 * @param {Object} pose - The pose object with keypoints
 */
function drawPose(pose) {
    if (!pose || !pose.keypoints) return;
    
    push();
    
    // Flip coordinates for mirror effect
    translate(width, 0);
    scale(-1, 1);
    
    // Draw skeleton first (behind keypoints)
    if (showSkeleton) {
        drawSkeleton(pose.keypoints);
    }
    
    // Draw keypoints
    if (showKeypoints) {
        drawKeypoints(pose.keypoints);
    }
    
    pop();
}

/**
 * Draw pose keypoints
 * @param {Array} keypoints - Array of keypoint objects
 */
function drawKeypoints(keypoints) {
    const keypointNames = [
        'nose', 'leftEye', 'rightEye', 'leftEar', 'rightEar',
        'leftShoulder', 'rightShoulder', 'leftElbow', 'rightElbow',
        'leftWrist', 'rightWrist', 'leftHip', 'rightHip',
        'leftKnee', 'rightKnee', 'leftAnkle', 'rightAnkle'
    ];
    
    for (let i = 0; i < keypoints.length; i++) {
        const keypoint = keypoints[i];
        const keypointName = keypointNames[i];
        
        // Only draw keypoints above confidence threshold
        if (keypoint.score > keypointConfidenceThreshold) {
            push();
            
            // Set color based on keypoint type
            const color = colors[keypointName] || [255, 255, 255];
            fill(color[0], color[1], color[2], 200);
            stroke(255, 255, 255, 150);
            strokeWeight(2);
            
            // Draw keypoint
            circle(keypoint.position.x * (width / 640), 
                   keypoint.position.y * (height / 480), 
                   KEYPOINT_SIZE);
            
            pop();
        }
    }
}

/**
 * Draw pose skeleton
 * @param {Array} keypoints - Array of keypoint objects
 */
function drawSkeleton(keypoints) {
    const keypointNames = [
        'nose', 'leftEye', 'rightEye', 'leftEar', 'rightEar',
        'leftShoulder', 'rightShoulder', 'leftElbow', 'rightElbow',
        'leftWrist', 'rightWrist', 'leftHip', 'rightHip',
        'leftKnee', 'rightKnee', 'leftAnkle', 'rightAnkle'
    ];
    
    // Create keypoint lookup
    const keypointLookup = {};
    for (let i = 0; i < keypoints.length; i++) {
        keypointLookup[keypointNames[i]] = keypoints[i];
    }
    
    // Draw connections
    for (const connection of poseConnections) {
        const startPoint = keypointLookup[connection[0]];
        const endPoint = keypointLookup[connection[1]];
        
        // Only draw if both points are above confidence threshold
        if (startPoint && endPoint && 
            startPoint.score > keypointConfidenceThreshold && 
            endPoint.score > keypointConfidenceThreshold) {
            
            push();
            
            stroke(255, 255, 255, 150);
            strokeWeight(SKELETON_THICKNESS);
            
            line(startPoint.position.x * (width / 640),
                 startPoint.position.y * (height / 480),
                 endPoint.position.x * (width / 640),
                 endPoint.position.y * (height / 480));
            
            pop();
        }
    }
}

/**
 * Draw overlay information
 */
function drawOverlay() {
    if (!currentLabel) return;
    
    push();
    
    // Semi-transparent background
    fill(0, 0, 0, 150);
    noStroke();
    rect(10, 10, 280, 70);
    
    // Current pose text
    fill(255);
    textAlign(LEFT, TOP);
    textSize(20);
    text(currentLabel, 20, 25);
    
    textSize(16);
    const confidence = (currentConfidence * 100).toFixed(1);
    text(`Confidence: ${confidence}%`, 20, 50);
    
    pop();
}

/**
 * Draw idle state when not running
 */
function drawIdleState() {
    push();
    fill(255, 150);
    textAlign(CENTER, CENTER);
    textSize(24);
    text('Click "Start Camera" to begin pose detection', width/2, height/2);
    
    // Draw sample pose silhouette
    fill(100, 120);
    noStroke();
    
    // Simple stick figure
    let centerX = width/2;
    let centerY = height/2 + 50;
    
    // Head
    circle(centerX, centerY - 80, 30);
    
    // Body
    line(centerX, centerY - 65, centerX, centerY + 40);
    
    // Arms
    line(centerX, centerY - 40, centerX - 40, centerY - 10);
    line(centerX, centerY - 40, centerX + 40, centerY - 10);
    
    // Legs
    line(centerX, centerY + 40, centerX - 30, centerY + 100);
    line(centerX, centerY + 40, centerX + 30, centerY + 100);
    
    pop();
}

/**
 * Draw frame around canvas
 */
function drawFrame() {
    push();
    stroke(255, 255, 255, 100);
    strokeWeight(2);
    noFill();
    rect(0, 0, width, height);
    pop();
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
    console.log('updatePredictionsDisplay called - predictionsElement:', !!predictionsElement, 'predictions:', predictions);
    if (!predictionsElement || !predictions.length) return;
    
    let html = '<h3>All Predictions:</h3>';
    
    // Show all predictions
    for (let i = 0; i < predictions.length; i++) {
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
 * Update current pose display
 */
function updateCurrentPoseDisplay() {
    if (!currentPoseDisplay) return;
    
    const poseName = currentLabel || 'No pose detected';
    const confidence = currentLabel ? (currentConfidence * 100).toFixed(1) + '%' : '0%';
    
    currentPoseDisplay.html(`
        <div class="pose-name">${poseName}</div>
        <div class="pose-confidence">${confidence}</div>
    `);
}

/**
 * Update pose statistics
 */
function updatePoseStats() {
    if (!keypointsCountSpan || !poseConfidenceSpan) return;
    
    if (!currentPose || !currentPose.keypoints || !Array.isArray(currentPose.keypoints)) {
        keypointsCountSpan.html('0/17');
        poseConfidenceSpan.html('0%');
        return;
    }
    
    // Count visible keypoints
    let visibleKeypoints = 0;
    let totalConfidence = 0;
    
    for (const keypoint of currentPose.keypoints) {
        if (keypoint && typeof keypoint.score === 'number' && keypoint.score > keypointConfidenceThreshold) {
            visibleKeypoints++;
            totalConfidence += keypoint.score;
        }
    }
    
    const avgConfidence = visibleKeypoints > 0 ? totalConfidence / visibleKeypoints : 0;
    
    keypointsCountSpan.html(`${visibleKeypoints}/17`);
    poseConfidenceSpan.html((avgConfidence * 100).toFixed(1) + '%');
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
        saveCanvas('pose-classification-screenshot', 'png');
    }
    
    // Space bar to toggle camera
    if (key === ' ') {
        if (isRunning) {
            stopCamera();
        } else {
            startCamera();
        }
    }
    
    // Toggle keypoints with 'k'
    if (key === 'k' || key === 'K') {
        showKeypoints = !showKeypoints;
        showKeypointsCheckbox.checked(showKeypoints);
    }
    
    // Toggle skeleton with 'j'
    if (key === 'j' || key === 'J') {
        showSkeleton = !showSkeleton;
        showSkeletonCheckbox.checked(showSkeleton);
    }
}

// ========================================
// CUSTOMIZATION EXAMPLES
// ========================================

/**
 * Example: Create particle effects based on pose
 * Uncomment and modify this function, then call it from respondToClassification()
 */
/*
let particles = [];

function createPoseParticles(poseName, confidence) {
    const numParticles = Math.floor(confidence * 20);
    
    for (let i = 0; i < numParticles; i++) {
        particles.push({
            x: random(width),
            y: random(height),
            vx: random(-3, 3),
            vy: random(-3, 3),
            life: 255,
            pose: poseName,
            size: random(3, 8)
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
        circle(p.x, p.y, p.size);
        pop();
    }
}
*/

/**
 * Example: Pose similarity scoring
 * Compare current pose to a reference pose
 */
/*
function calculatePoseSimilarity(pose1, pose2) {
    if (!pose1 || !pose2) return 0;
    
    let totalDistance = 0;
    let validPoints = 0;
    
    for (let i = 0; i < pose1.keypoints.length; i++) {
        const kp1 = pose1.keypoints[i];
        const kp2 = pose2.keypoints[i];
        
        if (kp1.score > 0.5 && kp2.score > 0.5) {
            const distance = dist(kp1.position.x, kp1.position.y, 
                                kp2.position.x, kp2.position.y);
            totalDistance += distance;
            validPoints++;
        }
    }
    
    if (validPoints === 0) return 0;
    
    const avgDistance = totalDistance / validPoints;
    const similarity = Math.max(0, 1 - (avgDistance / 200)); // Normalize
    return similarity;
}
*/