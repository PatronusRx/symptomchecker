<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mental Health Assessment</title>
  <style>
    * {
      box-sizing: border-box;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    }
    body {
      margin: 0;
      padding: 0;
      background-color: #f5f5f5;
      color: #333;
    }
    .app-container {
      max-width: 400px;
      margin: 0 auto;
      background-color: white;
      min-height: 100vh;
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
      position: relative;
    }
    .app-header {
      padding: 20px;
      background-color: #5b87c5;
      color: white;
      text-align: center;
      position: relative;
    }
    .app-content {
      padding: 20px;
    }
    .progress-bar-container {
      width: 100%;
      background-color: #e0e0e0;
      border-radius: 10px;
      margin: 10px 0 20px;
    }
    .progress-bar {
      height: 10px;
      background-color: #4CAF50;
      border-radius: 10px;
      width: 20%;
    }
    .question {
      margin-bottom: 30px;
    }
    .question-text {
      font-size: 18px;
      margin-bottom: 15px;
      font-weight: 500;
    }
    .options-container {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .option-button {
      padding: 15px;
      border: 1px solid #ddd;
      border-radius: 8px;
      background-color: white;
      text-align: left;
      font-size: 16px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .option-button:hover, .option-button:focus {
      background-color: #f0f7ff;
      border-color: #5b87c5;
    }
    .option-button.selected {
      background-color: #e6f0ff;
      border-color: #5b87c5;
      color: #5b87c5;
    }
    .emergency-alert {
      background-color: #ffebee;
      border: 1px solid #f44336;
      border-radius: 8px;
      padding: 15px;
      margin-bottom: 20px;
      display: flex;
      align-items: flex-start;
    }
    .emergency-icon {
      color: #f44336;
      font-size: 24px;
      margin-right: 10px;
      flex-shrink: 0;
    }
    .emergency-text {
      color: #d32f2f;
      font-weight: 500;
    }
    .emergency-call-button {
      background-color: #f44336;
      color: white;
      border: none;
      border-radius: 8px;
      padding: 12px 20px;
      font-size: 16px;
      margin-top: 10px;
      cursor: pointer;
      width: 100%;
      font-weight: 500;
    }
    .info-box {
      background-color: #e3f2fd;
      border: 1px solid #2196F3;
      border-radius: 8px;
      padding: 15px;
      margin-bottom: 20px;
    }
    .info-text {
      color: #0d47a1;
    }
    .nav-buttons {
      display: flex;
      justify-content: space-between;
      margin-top: 30px;
    }
    .nav-button {
      padding: 12px 20px;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      cursor: pointer;
      font-weight: 500;
    }
    .back-button {
      background-color: #f5f5f5;
      color: #555;
    }
    .next-button {
      background-color: #5b87c5;
      color: white;
    }
    .disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .screen {
      display: none;
    }
    .screen.active {
      display: block;
    }
    .text-input {
      width: 100%;
      padding: 15px;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-size: 16px;
      margin-bottom: 10px;
    }
    .radio-group {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .checkbox-option {
      display: flex;
      align-items: center;
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 8px;
    }
    .checkbox-option input {
      margin-right: 10px;
    }
    .slider-container {
      margin: 20px 0;
    }
    .slider-labels {
      display: flex;
      justify-content: space-between;
      margin-bottom: 5px;
    }
    .severity-slider {
      width: 100%;
      margin: 10px 0;
    }
    .summary-item {
      margin-bottom: 15px;
      padding-bottom: 15px;
      border-bottom: 1px solid #eee;
    }
    .summary-label {
      font-weight: 500;
      margin-bottom: 5px;
      color: #555;
    }
    .summary-value {
      color: #333;
    }
    .copy-button {
      background-color: #4CAF50;
      color: white;
      border: none;
      border-radius: 8px;
      padding: 12px 20px;
      font-size: 16px;
      margin-top: 10px;
      cursor: pointer;
      width: 100%;
      font-weight: 500;
    }
    .home-button {
      margin-top: 20px;
      background-color: #f5f5f5;
      color: #555;
    }
    .resource-button {
      padding: 12px;
      background-color: #e3f2fd;
      border: 1px solid #2196F3;
      border-radius: 8px;
      margin-bottom: 10px;
      width: 100%;
      text-align: left;
      display: flex;
      align-items: center;
    }
    .resource-icon {
      margin-right: 10px;
      color: #2196F3;
      font-size: 20px;
    }
    .intro-text {
      margin-bottom: 20px;
      line-height: 1.5;
    }
    .bold-prompt {
      font-weight: 500;
      color: #333;
      margin-bottom: 5px;
    }
    .textarea {
      width: 100%;
      padding: 15px;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-size: 16px;
      margin-bottom: 10px;
      min-height: 100px;
      resize: vertical;
    }
  </style>
</head>
<body>
  <div class="app-container">
    <!-- Welcome Screen -->
    <div class="screen active" id="welcome-screen">
      <div class="app-header">
        <h1>Mental Health Check-in</h1>
      </div>
      <div class="app-content">
        <p class="intro-text">
          Thank you for taking a step to check in on your mental health. This assessment will help you and your healthcare provider understand your current thoughts and feelings.
        </p>
        
        <div class="emergency-alert">
          <span class="emergency-icon">⚠️</span>
          <div>
            <div class="emergency-text">If you're in immediate danger or crisis, please reach out for help right away.</div>
            <div style="margin-top: 10px;">
              <button class="emergency-call-button" onclick="window.location.href='tel:988'">Call 988 Crisis Lifeline</button>
            </div>
            <div style="margin-top: 10px;">
              <button class="emergency-call-button" onclick="window.location.href='tel:911'">Call 911</button>
            </div>
          </div>
        </div>
        
        <div class="info-box">
          <div class="info-text">
            <strong>About this assessment:</strong>
            <ul>
              <li>Takes 5-7 minutes to complete</li>
              <li>Your responses are private</li>
              <li>You can stop and resume at any time</li>
              <li>This is not a substitute for emergency care</li>
            </ul>
          </div>
        </div>
        
        <button class="next-button" style="width: 100%;" onclick="goToScreen('screen-1')">Begin Assessment</button>
      </div>
    </div>

    <!-- Screen 1: Initial Risk Assessment -->
    <div class="screen" id="screen-1">
      <div class="app-header">
        <h1>Mental Health Check-in</h1>
      </div>
      <div class="app-content">
        <div class="progress-bar-container">
          <div class="progress-bar" style="width: 20%"></div>
        </div>
        
        <div class="emergency-alert">
          <span class="emergency-icon">⚠️</span>
          <div>
            <div class="emergency-text">If you need immediate help:</div>
            <div style="margin-top: 5px; color: #333;">
              Call 988 Crisis Lifeline or 911
            </div>
          </div>
        </div>
        
        <div class="question">
          <div class="question-text">Have you had thoughts about taking your own life?</div>
          <div class="options-container">
            <button class="option-button" onclick="selectOption(this)">No, not at all</button>
            <button class="option-button" onclick="selectOption(this)">Fleeting thoughts, but no desire to act</button>
            <button class="option-button" onclick="selectOption(this)">Yes, I've thought about it but have no plan</button>
            <button class="option-button" onclick="selectOption(this)">Yes, I've been thinking about it frequently</button>
            <button class="option-button" onclick="selectOption(this)">Yes, and I've considered how I would do it</button>
          </div>
        </div>
        
        <div class="question">
          <div class="question-text">How would you rate your mood today?</div>
          <div class="slider-container">
            <div class="slider-labels">
              <span>Very low</span>
              <span>Neutral</span>
              <span>Good</span>
            </div>
            <input type="range" min="1" max="10" value="5" class="severity-slider">
          </div>
        </div>
        
        <div class="nav-buttons">
          <button class="nav-button back-button" onclick="goToScreen('welcome-screen')">Back</button>
          <button class="nav-button next-button" onclick="goToScreen('screen-2')">Next</button>
        </div>
      </div>
    </div>

    <!-- Screen 2: Onset and History -->
    <div class="screen" id="screen-2">
      <div class="app-header">
        <h1>Mental Health Check-in</h1>
      </div>
      <div class="app-content">
        <div class="progress-bar-container">
          <div class="progress-bar" style="width: 40%"></div>
        </div>
        
        <div class="question">
          <div class="question-text">When did these thoughts or feelings begin?</div>
          <div class="options-container">
            <button class="option-button" onclick="selectOption(this)">Within the last 24 hours</button>
            <button class="option-button" onclick="selectOption(this)">Within the past week</button>
            <button class="option-button" onclick="selectOption(this)">Within the past month</button>
            <button class="option-button" onclick="selectOption(this)">More than a month ago</button>
            <button class="option-button" onclick="selectOption(this)">I've had these thoughts on and off for a long time</button>
          </div>
        </div>
        
        <div class="question">
          <div class="question-text">Have you had similar thoughts in the past?</div>
          <div class="options-container">
            <button class="option-button" onclick="selectOption(this)">No, this is the first time</button>
            <button class="option-button" onclick="selectOption(this)">Yes, once before</button>
            <button class="option-button" onclick="selectOption(this)">Yes, a few times before</button>
            <button class="option-button" onclick="selectOption(this)">Yes, many times before</button>
          </div>
        </div>
        
        <div class="question">
          <div class="bold-prompt">If you've had these thoughts before, when was the most recent time?</div>
          <input type="text" class="text-input" placeholder="E.g., 3 months ago, last year, etc.">
        </div>
        
        <div class="nav-buttons">
          <button class="nav-button back-button" onclick="goToScreen('screen-1')">Back</button>
          <button class="nav-button next-button" onclick="goToScreen('screen-3')">Next</button>
        </div>
      </div>
    </div>

    <!-- Screen 3: Quality and Nature -->
    <div class="screen" id="screen-3">
      <div class="app-header">
        <h1>Mental Health Check-in</h1>
      </div>
      <div class="app-content">
        <div class="progress-bar-container">
          <div class="progress-bar" style="width: 60%"></div>
        </div>
        
        <div class="question">
          <div class="question-text">How would you describe your thoughts?</div>
          <div class="radio-group">
            <label class="checkbox-option">
              <input type="checkbox" name="thought-quality"> A general wish to not be alive
            </label>
            <label class="checkbox-option">
              <input type="checkbox" name="thought-quality"> Specific thoughts about ending my life
            </label>
            <label class="checkbox-option">
              <input type="checkbox" name="thought-quality"> Thoughts that come into my mind unwanted
            </label>
            <label class="checkbox-option">
              <input type="checkbox" name="thought-quality"> Voices or commands telling me to harm myself
            </label>
          </div>
        </div>
        
        <div class="question">
          <div class="question-text">How often do these thoughts occur?</div>
          <div class="options-container">
            <button class="option-button" onclick="selectOption(this)">Rarely (once a week or less)</button>
            <button class="option-button" onclick="selectOption(this)">Sometimes (several times a week)</button>
            <button class="option-button" onclick="selectOption(this)">Often (daily)</button>
            <button class="option-button" onclick="selectOption(this)">Constantly or nearly constantly</button>
          </div>
        </div>
        
        <div class="question">
          <div class="question-text">How much control do you feel you have over these thoughts?</div>
          <div class="options-container">
            <button class="option-button" onclick="selectOption(this)">Complete control</button>
            <button class="option-button" onclick="selectOption(this)">Moderate control</button>
            <button class="option-button" onclick="selectOption(this)">Minimal control</button>
            <button class="option-button" onclick="selectOption(this)">No control</button>
          </div>
        </div>
        
        <div class="nav-buttons">
          <button class="nav-button back-button" onclick="goToScreen('screen-2')">Back</button>
          <button class="nav-button next-button" onclick="goToScreen('screen-4')">Next</button>
        </div>
      </div>
    </div>

    <!-- Screen 4: Severity and Intent -->
    <div class="screen" id="screen-4">
      <div class="app-header">
        <h1>Mental Health Check-in</h1>
      </div>
      <div class="app-content">
        <div class="progress-bar-container">
          <div class="progress-bar" style="width: 80%"></div>
        </div>
        
        <div class="question">
          <div class="question-text">On a scale from 0-10, how strong are these thoughts right now?</div>
          <div class="slider-container">
            <div class="slider-labels">
              <span>0<br>Not present</span>
              <span>5<br>Moderate</span>
              <span>10<br>Very intense</span>
            </div>
            <input type="range" min="0" max="10" value="0" class="severity-slider">
          </div>
        </div>
        
        <div class="question">
          <div class="question-text">Do you intend to act on these thoughts?</div>
          <div class="options-container">
            <button class="option-button" onclick="selectOption(this)">No intent to act</button>
            <button class="option-button" onclick="selectOption(this)">Some thoughts but can easily resist</button>
            <button class="option-button" onclick="selectOption(this)">Strong thoughts with difficulty resisting</button>
            <button class="option-button" onclick="selectOption(this)">I plan to act on these thoughts</button>
          </div>
        </div>
        
        <div class="question">
          <div class="question-text">Have you taken any steps to prepare?</div>
          <div class="options-container">
            <button class="option-button" onclick="selectOption(this)">No preparations</button>
            <button class="option-button" onclick="selectOption(this)">Thought about methods</button>
            <button class="option-button" onclick="selectOption(this)">Gathered materials/means</button>
            <button class="option-button" onclick="selectOption(this)">Made specific arrangements (notes, giving away possessions, etc.)</button>
          </div>
        </div>
        
        <div class="nav-buttons">
          <button class="nav-button back-button" onclick="goToScreen('screen-3')">Back</button>
          <button class="nav-button next-button" onclick="goToScreen('screen-5')">Next</button>
        </div>
      </div>
    </div>

    <!-- Screen 5: Contributing Factors -->
    <div class="screen" id="screen-5">
      <div class="app-header">
        <h1>Mental Health Check-in</h1>
      </div>
      <div class="app-content">
        <div class="progress-bar-container">
          <div class="progress-bar" style="width: 100%"></div>
        </div>
        
        <div class="question">
          <div class="question-text">What factors might be contributing to how you're feeling?</div>
          <div class="radio-group">
            <label class="checkbox-option">
              <input type="checkbox"> Relationship difficulties
            </label>
            <label class="checkbox-option">
              <input type="checkbox"> Financial stressors
            </label>
            <label class="checkbox-option">
              <input type="checkbox"> Work or school pressure
            </label>
            <label class="checkbox-option">
              <input type="checkbox"> Health problems
            </label>
            <label class="checkbox-option">
              <input type="checkbox"> Substance use
            </label>
            <label class="checkbox-option">
              <input type="checkbox"> Feelings of isolation
            </label>
            <label class="checkbox-option">
              <input type="checkbox"> Recent loss or trauma
            </label>
            <label class="checkbox-option">
              <input type="checkbox"> Other
            </label>
          </div>
        </div>
        
        <div class="question">
          <div class="question-text">What helps when you're feeling this way?</div>
          <div class="radio-group">
            <label class="checkbox-option">
              <input type="checkbox"> Talking to friends/family
            </label>
            <label class="checkbox-option">
              <input type="checkbox"> Professional support
            </label>
            <label class="checkbox-option">
              <input type="checkbox"> Self-care activities
            </label>
            <label class="checkbox-option">
              <input type="checkbox"> Exercise
            </label>
            <label class="checkbox-option">
              <input type="checkbox"> Creative outlets
            </label>
            <label class="checkbox-option">
              <input type="checkbox"> Religion/spirituality
            </label>
            <label class="checkbox-option">
              <input type="checkbox"> Helping others
            </label>
            <label class="checkbox-option">
              <input type="checkbox"> Nothing has helped so far
            </label>
          </div>
        </div>
        
        <div class="question">
          <div class="bold-prompt">Is there anything else you'd like to share about what you're experiencing?</div>
          <textarea class="textarea" placeholder="Your thoughts and feelings..."></textarea>
        </div>
        
        <div class="nav-buttons">
          <button class="nav-button back-button" onclick="goToScreen('screen-4')">Back</button>
          <button class="nav-button next-button" onclick="goToScreen('summary-screen')">Review</button>
        </div>
      </div>
    </div>

    <!-- Summary Screen -->
    <div class="screen" id="summary-screen">
      <div class="app-header">
        <h1>Assessment Summary</h1>
      </div>
      <div class="app-content">
        <h2>Your Responses</h2>
        <p>Please review your assessment responses below:</p>
        
        <div class="summary-item">
          <div class="summary-label">Suicidal thoughts:</div>
          <div class="summary-value">Yes, I've thought about it but have no plan</div>
        </div>
        
        <div class="summary-item">
          <div class="summary-label">Current mood:</div>
          <div class="summary-value">5/10 (Neutral)</div>
        </div>
        
        <div class="summary-item">
          <div class="summary-label">Onset:</div>
          <div class="summary-value">Within the past month</div>
        </div>
        
        <div class="summary-item">
          <div class="summary-label">Previous episodes:</div>
          <div class="summary-value">Yes, a few times before</div>
        </div>
        
        <div class="summary-item">
          <div class="summary-label">Nature of thoughts:</div>
          <div class="summary-value">A general wish to not be alive, Thoughts that come into my mind unwanted</div>
        </div>
        
        <div class="summary-item">
          <div class="summary-label">Frequency:</div>
          <div class="summary-value">Sometimes (several times a week)</div>
        </div>
        
        <div class="summary-item">
          <div class="summary-label">Current intensity:</div>
          <div class="summary-value">4/10</div>
        </div>
        
        <div class="summary-item">
          <div class="summary-label">Intent:</div>
          <div class="summary-value">No intent to act</div>
        </div>
        
        <div class="summary-item">
          <div class="summary-label">Contributing factors:</div>
          <div class="summary-value">Work or school pressure, Feelings of isolation</div>
        </div>
        
        <div class="summary-item">
          <div class="summary-label">Helpful factors:</div>
          <div class="summary-value">Talking to friends/family, Exercise</div>
        </div>
        
        <button class="copy-button" onclick="alert('Assessment copied to clipboard')">Copy Assessment Results</button>
        
        <div class="emergency-alert" style="margin-top: 20px;">
          <span class="emergency-icon">⚠️</span>
          <div>
            <div class="emergency-text">If you're in crisis, please reach out:</div>
            <div style="margin-top: 10px;">
              <button class="emergency-call-button" onclick="window.location.href='tel:988'">Call 988 Crisis Lifeline</button>
            </div>
            <div style="margin-top: 10px;">
              <button class="emergency-call-button" onclick="window.location.href='tel:911'">Call 911</button>
            </div>
          </div>
        </div>
        
        <div style="margin-top: 20px;">
          <h3>Resources</h3>
          <button class="resource-button">
            <span class="resource-icon">📱</span>
            Crisis Text Line: Text HOME to 741741
          </button>
          <button class="resource-button">
            <span class="resource-icon">🔍</span>
            Find local mental health services
          </button>
          <button class="resource-button">
            <span class="resource-icon">📋</span>
            Mental health coping strategies
          </button>
        </div>
        
        <div class="nav-buttons">
          <button class="nav-button back-button" onclick="goToScreen('screen-5')">Back</button>
          <button class="nav-button home-button" onclick="goToScreen('welcome-screen')">Done</button>
        </div>
      </div>
    </div>

  </div>

  <script>
    function goToScreen(screenId) {
      // Hide all screens
      document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
      });
      
      // Show the target screen
      document.getElementById(screenId).classList.add('active');
      
      // Scroll to top
      window.scrollTo(0, 0);
    }
    
    function selectOption(button) {
      // Clear other selections in the same question
      const parent = button.closest('.question');
      parent.querySelectorAll('.option-button').forEach(btn => {
        btn.classList.remove('selected');
      });
      
      // Select this option
      button.classList.add('selected');
    }
  </script>
</body>
</html>