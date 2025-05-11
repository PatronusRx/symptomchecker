<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SBO Assessment App</title>
  <style>
    * {
      box-sizing: border-box;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    }
    body {
      margin: 0;
      padding: 0;
      background-color: #f5f5f5;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .container {
      max-width: 375px;
      width: 100%;
      background-color: white;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      border-radius: 15px;
      overflow: hidden;
      position: relative;
      height: 667px;
      margin: 20px auto;
    }
    .screen {
      display: none;
      height: 100%;
      padding: 20px;
      flex-direction: column;
    }
    .screen.active {
      display: flex;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 15px;
      border-bottom: 1px solid #eee;
      margin-bottom: 20px;
    }
    .title {
      font-size: 18px;
      font-weight: 600;
      color: #333;
    }
    .back-button {
      color: #007aff;
      font-size: 16px;
      border: none;
      background: none;
      padding: 5px;
      cursor: pointer;
    }
    .progress-bar {
      height: 5px;
      background-color: #e0e0e0;
      border-radius: 5px;
      margin-bottom: 20px;
      overflow: hidden;
    }
    .progress {
      height: 100%;
      background-color: #007aff;
      transition: width 0.3s ease;
    }
    .question {
      font-size: 22px;
      font-weight: 500;
      margin-bottom: 20px;
      color: #333;
    }
    .description {
      font-size: 16px;
      color: #666;
      margin-bottom: 25px;
      line-height: 1.5;
    }
    .alert {
      background-color: #fff2f2;
      border-left: 4px solid #ff3b30;
      padding: 15px;
      margin-bottom: 20px;
      font-size: 16px;
      color: #ff3b30;
      border-radius: 5px;
    }
    .options {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-bottom: 20px;
    }
    .option {
      padding: 15px;
      border: 1px solid #ddd;
      border-radius: 10px;
      font-size: 18px;
      cursor: pointer;
      transition: background-color 0.2s;
      display: flex;
      align-items: center;
    }
    .option:hover, .option.selected {
      background-color: #f0f8ff;
      border-color: #007aff;
    }
    .option.selected {
      background-color: #e6f2ff;
    }
    .radio {
      height: 22px;
      width: 22px;
      border: 2px solid #ccc;
      border-radius: 50%;
      margin-right: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .option.selected .radio {
      border-color: #007aff;
    }
    .radio-inner {
      height: 12px;
      width: 12px;
      border-radius: 50%;
      background-color: #007aff;
      display: none;
    }
    .option.selected .radio-inner {
      display: block;
    }
    .input-field {
      padding: 15px;
      border: 1px solid #ddd;
      border-radius: 10px;
      font-size: 18px;
      margin-bottom: 20px;
      width: 100%;
    }
    .input-field:focus {
      border-color: #007aff;
      outline: none;
    }
    .button-container {
      margin-top: auto;
      display: flex;
      justify-content: center;
      gap: 10px;
    }
    .button {
      padding: 15px 25px;
      border-radius: 10px;
      font-size: 18px;
      font-weight: 500;
      border: none;
      cursor: pointer;
      background-color: #007aff;
      color: white;
      width: 100%;
      transition: background-color 0.2s;
    }
    .button:hover {
      background-color: #0056b3;
    }
    .button.secondary {
      background-color: #f2f2f2;
      color: #333;
    }
    .button.secondary:hover {
      background-color: #e5e5e5;
    }
    .emergency-button {
      position: absolute;
      top: 10px;
      right: 10px;
      padding: 8px 12px;
      background-color: #ff3b30;
      color: white;
      border: none;
      border-radius: 5px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
    }
    .summary-item {
      margin-bottom: 15px;
      padding-bottom: 15px;
      border-bottom: 1px solid #eee;
    }
    .summary-label {
      font-size: 14px;
      color: #666;
      margin-bottom: 5px;
    }
    .summary-value {
      font-size: 18px;
      color: #333;
    }
    .copy-button {
      margin-top: 20px;
      padding: 10px 15px;
      border: 1px solid #ddd;
      background-color: #f9f9f9;
      border-radius: 5px;
      font-size: 16px;
      color: #333;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 5px;
    }
    .controls {
      display: flex;
      gap: 10px;
      margin-top: 20px;
    }
    .nav-button {
      background-color: #e0e0e0;
      border: none;
      padding: 10px;
      border-radius: 5px;
      cursor: pointer;
      font-size: 14px;
    }
    .nav-button.active {
      background-color: #007aff;
      color: white;
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Welcome Screen -->
    <div class="screen active" id="screen-0">
      <div class="header">
        <div class="title">SBO Symptom Assessment</div>
      </div>
      <h1 style="text-align: center; margin-bottom: 10px;">Welcome</h1>
      <p class="description">This assessment will help you and your healthcare provider understand your symptoms related to potential small bowel obstruction.</p>
      <p class="description">The questionnaire takes about 2-3 minutes to complete.</p>
      <div class="alert">
        <strong>Important:</strong> If you're experiencing severe abdominal pain, continuous vomiting, high fever, or can't pass gas or stool for more than 24 hours, please seek immediate medical attention.
      </div>
      <p class="description">Your answers will be used to help your healthcare provider make an assessment. This is not a substitute for professional medical advice.</p>
      <div class="button-container">
        <button class="button" onclick="showScreen(1)">Begin Assessment</button>
      </div>
    </div>

    <!-- Abdominal Pain Screen -->
    <div class="screen" id="screen-1">
      <div class="header">
        <button class="back-button" onclick="showScreen(0)">Back</button>
        <div class="title">Pain Assessment</div>
      </div>
      <div class="progress-bar"><div class="progress" style="width: 10%;"></div></div>
      <div class="question">Are you experiencing abdominal pain?</div>
      <div class="options">
        <div class="option" onclick="selectOption(this, 1, 2)">
          <div class="radio"><div class="radio-inner"></div></div>
          <div>Yes</div>
        </div>
        <div class="option" onclick="selectOption(this, 1, 5)">
          <div class="radio"><div class="radio-inner"></div></div>
          <div>No</div>
        </div>
      </div>
      <div class="button-container">
        <button class="button" onclick="nextScreen()">Continue</button>
      </div>
    </div>

    <!-- Pain Severity Screen -->
    <div class="screen" id="screen-2">
      <div class="header">
        <button class="back-button" onclick="showScreen(1)">Back</button>
        <div class="title">Pain Assessment</div>
      </div>
      <div class="progress-bar"><div class="progress" style="width: 20%;"></div></div>
      <div class="question">How would you rate your abdominal pain?</div>
      <p class="description">On a scale from 0 (no pain) to 10 (worst pain imaginable)</p>
      <div class="options">
        <div class="option" onclick="selectOption(this, 2, 3)">
          <div class="radio"><div class="radio-inner"></div></div>
          <div>1-3 (Mild)</div>
        </div>
        <div class="option" onclick="selectOption(this, 2, 3)">
          <div class="radio"><div class="radio-inner"></div></div>
          <div>4-6 (Moderate)</div>
        </div>
        <div class="option" onclick="selectOption(this, 2, 3)">
          <div class="radio"><div class="radio-inner"></div></div>
          <div>7-9 (Severe)</div>
        </div>
        <div class="option" onclick="selectOption(this, 2, 'emergency')">
          <div class="radio"><div class="radio-inner"></div></div>
          <div>10 (Worst pain ever)</div>
        </div>
      </div>
      <div class="button-container">
        <button class="button" onclick="nextScreen()">Continue</button>
      </div>
    </div>

    <!-- Pain Location Screen -->
    <div class="screen" id="screen-3">
      <div class="header">
        <button class="back-button" onclick="showScreen(2)">Back</button>
        <div class="title">Pain Location</div>
      </div>
      <div class="progress-bar"><div class="progress" style="width: 30%;"></div></div>
      <div class="question">Where is your abdominal pain located?</div>
      <p class="description">Select the primary location</p>
      <div class="options">
        <div class="option" onclick="selectOption(this, 3, 4)">
          <div class="radio"><div class="radio-inner"></div></div>
          <div>Upper abdomen</div>
        </div>
        <div class="option" onclick="selectOption(this, 3, 4)">
          <div class="radio"><div class="radio-inner"></div></div>
          <div>Around the belly button</div>
        </div>
        <div class="option" onclick="selectOption(this, 3, 4)">
          <div class="radio"><div class="radio-inner"></div></div>
          <div>Lower abdomen</div>
        </div>
        <div class="option" onclick="selectOption(this, 3, 4)">
          <div class="radio"><div class="radio-inner"></div></div>
          <div>All over the abdomen</div>
        </div>
      </div>
      <div class="button-container">
        <button class="button" onclick="nextScreen()">Continue</button>
      </div>
    </div>

    <!-- Pain Character Screen -->
    <div class="screen" id="screen-4">
      <div class="header">
        <button class="back-button" onclick="showScreen(3)">Back</button>
        <div class="title">Pain Character</div>
      </div>
      <div class="progress-bar"><div class="progress" style="width: 40%;"></div></div>
      <div class="question">How would you describe your pain?</div>
      <div class="options">
        <div class="option" onclick="selectOption(this, 4, 5)">
          <div class="radio"><div class="radio-inner"></div></div>
          <div>Cramping (comes and goes)</div>
        </div>
        <div class="option" onclick="selectOption(this, 4, 5)">
          <div class="radio"><div class="radio-inner"></div></div>
          <div>Constant (always there)</div>
        </div>
        <div class="option" onclick="selectOption(this, 4, 5)">
          <div class="radio"><div class="radio-inner"></div></div>
          <div>Sharp</div>
        </div>
        <div class="option" onclick="selectOption(this, 4, 5)">
          <div class="radio"><div class="radio-inner"></div></div>
          <div>Dull</div>
        </div>
      </div>
      <div class="button-container">
        <button class="button" onclick="nextScreen()">Continue</button>
      </div>
    </div>

    <!-- Vomiting Screen -->
    <div class="screen" id="screen-5">
      <div class="header">
        <button class="back-button" onclick="showScreen(4)">Back</button>
        <div class="title">Vomiting</div>
      </div>
      <div class="progress-bar"><div class="progress" style="width: 50%;"></div></div>
      <div class="question">Have you been vomiting?</div>
      <div class="options">
        <div class="option" onclick="selectOption(this, 5, 6)">
          <div class="radio"><div class="radio-inner"></div></div>
          <div>Yes</div>
        </div>
        <div class="option" onclick="selectOption(this, 5, 7)">
          <div class="radio"><div class="radio-inner"></div></div>
          <div>No</div>
        </div>
      </div>
      <div class="button-container">
        <button class="button" onclick="nextScreen()">Continue</button>
      </div>
    </div>

    <!-- Vomiting Frequency Screen -->
    <div class="screen" id="screen-6">
      <div class="header">
        <button class="back-button" onclick="showScreen(5)">Back</button>
        <div class="title">Vomiting</div>
      </div>
      <div class="progress-bar"><div class="progress" style="width: 60%;"></div></div>
      <div class="question">How frequently have you been vomiting?</div>
      <div class="options">
        <div class="option" onclick="selectOption(this, 6, 7)">
          <div class="radio"><div class="radio-inner"></div></div>
          <div>1-2 times today</div>
        </div>
        <div class="option" onclick="selectOption(this, 6, 7)">
          <div class="radio"><div class="radio-inner"></div></div>
          <div>3-5 times today</div>
        </div>
        <div class="option" onclick="selectOption(this, 6, 'emergency')">
          <div class="radio"><div class="radio-inner"></div></div>
          <div>More than 5 times today</div>
        </div>
        <div class="option" onclick="selectOption(this, 6, 'emergency')">
          <div class="radio"><div class="radio-inner"></div></div>
          <div>Continuous/unable to keep anything down</div>
        </div>
      </div>
      <div class="button-container">
        <button class="button" onclick="nextScreen()">Continue</button>
      </div>
    </div>

    <!-- Bowel Movements Screen -->
    <div class="screen" id="screen-7">
      <div class="header">
        <button class="back-button" onclick="showScreen(5)">Back</button>
        <div class="title">Bowel Movements</div>
      </div>
      <div class="progress-bar"><div class="progress" style="width: 70%;"></div></div>
      <div class="question">When was your last bowel movement?</div>
      <div class="options">
        <div class="option" onclick="selectOption(this, 7, 8)">
          <div class="radio"><div class="radio-inner"></div></div>
          <div>Today</div>
        </div>
        <div class="option" onclick="selectOption(this, 7, 8)">
          <div class="radio"><div class="radio-inner"></div></div>
          <div>Yesterday</div>
        </div>
        <div class="option" onclick="selectOption(this, 7, 8)">
          <div class="radio"><div class="radio-inner"></div></div>
          <div>2-3 days ago</div>
        </div>
        <div class="option" onclick="selectOption(this, 7, 'emergency')">
          <div class="radio"><div class="radio-inner"></div></div>
          <div>More than 3 days ago</div>
        </div>
      </div>
      <div class="button-container">
        <button class="button" onclick="nextScreen()">Continue</button>
      </div>
    </div>

    <!-- Passing Gas Screen -->
    <div class="screen" id="screen-8">
      <div class="header">
        <button class="back-button" onclick="showScreen(7)">Back</button>
        <div class="title">Passing Gas</div>
      </div>
      <div class="progress-bar"><div class="progress" style="width: 80%;"></div></div>
      <div class="question">Have you been able to pass gas (flatulence)?</div>
      <div class="options">
        <div class="option" onclick="selectOption(this, 8, 9)">
          <div class="radio"><div class="radio-inner"></div></div>
          <div>Yes, normally</div>
        </div>
        <div class="option" onclick="selectOption(this, 8, 9)">
          <div class="radio"><div class="radio-inner"></div></div>
          <div>Yes, but less than usual</div>
        </div>
        <div class="option" onclick="selectOption(this, 8, 'emergency')">
          <div class="radio"><div class="radio-inner"></div></div>
          <div>No, not for more than 24 hours</div>
        </div>
      </div>
      <div class="button-container">
        <button class="button" onclick="nextScreen()">Continue</button>
      </div>
    </div>

    <!-- Medical History Screen -->
    <div class="screen" id="screen-9">
      <div class="header">
        <button class="back-button" onclick="showScreen(8)">Back</button>
        <div class="title">Medical History</div>
      </div>
      <div class="progress-bar"><div class="progress" style="width: 90%;"></div></div>
      <div class="question">Have you had any of the following? (Select all that apply)</div>
      <div class="options" style="margin-bottom: 20px;">
        <div class="option" onclick="toggleMultiOption(this)">
          <div class="radio"><div class="radio-inner"></div></div>
          <div>Prior abdominal surgery</div>
        </div>
        <div class="option" onclick="toggleMultiOption(this)">
          <div class="radio"><div class="radio-inner"></div></div>
          <div>Previous bowel obstruction</div>
        </div>
        <div class="option" onclick="toggleMultiOption(this)">
          <div class="radio"><div class="radio-inner"></div></div>
          <div>Hernia</div>
        </div>
        <div class="option" onclick="toggleMultiOption(this)">
          <div class="radio"><div class="radio-inner"></div></div>
          <div>Inflammatory bowel disease</div>
        </div>
        <div class="option" onclick="toggleMultiOption(this)">
          <div class="radio"><div class="radio-inner"></div></div>
          <div>None of the above</div>
        </div>
      </div>
      <div class="button-container">
        <button class="button" onclick="showScreen(10)">Continue</button>
      </div>
    </div>

    <!-- Summary Screen -->
    <div class="screen" id="screen-10">
      <div class="header">
        <button class="back-button" onclick="showScreen(9)">Back</button>
        <div class="title">Summary</div>
      </div>
      <div class="progress-bar"><div class="progress" style="width: 100%;"></div></div>
      <div class="question">Review Your Responses</div>
      <p class="description">Please review your answers before submitting. You can go back to make changes if needed.</p>
      
      <div style="overflow-y: auto; max-height: 300px; margin-bottom: 20px;">
        <div class="summary-item">
          <div class="summary-label">Abdominal Pain</div>
          <div class="summary-value">Yes</div>
        </div>
        <div class="summary-item">
          <div class="summary-label">Pain Severity</div>
          <div class="summary-value">4-6 (Moderate)</div>
        </div>
        <div class="summary-item">
          <div class="summary-label">Pain Location</div>
          <div class="summary-value">Around the belly button</div>
        </div>
        <div class="summary-item">
          <div class="summary-label">Pain Character</div>
          <div class="summary-value">Cramping (comes and goes)</div>
        </div>
        <div class="summary-item">
          <div class="summary-label">Vomiting</div>
          <div class="summary-value">Yes (1-2 times today)</div>
        </div>
        <div class="summary-item">
          <div class="summary-label">Last Bowel Movement</div>
          <div class="summary-value">Yesterday</div>
        </div>
        <div class="summary-item">
          <div class="summary-label">Passing Gas</div>
          <div class="summary-value">Yes, but less than usual</div>
        </div>
        <div class="summary-item">
          <div class="summary-label">Medical History</div>
          <div class="summary-value">Prior abdominal surgery</div>
        </div>
      </div>
      
      <div class="button-container">
        <button class="button" onclick="showScreen(11)">Submit Assessment</button>
      </div>
    </div>

    <!-- Results Screen -->
    <div class="screen" id="screen-11">
      <div class="header">
        <div class="title">Assessment Complete</div>
      </div>
      <h1 style="text-align: center; margin-bottom: 10px;">Thank You</h1>
      <p class="description">Your assessment has been submitted to your healthcare provider.</p>
      
      <div class="alert">
        <strong>Important:</strong> This assessment is not a diagnosis. Please follow up with your healthcare provider as directed.
      </div>
      
      <p class="description">Based on your responses, here's what you should know:</p>
      
      <div style="padding: 15px; background-color: #f9f9f9; border-radius: 10px; margin-bottom: 20px;">
        Your symptoms may be consistent with a small bowel obstruction. Your history of prior abdominal surgery increases this risk. Please contact your healthcare provider today for further evaluation.
      </div>
      
      <button class="copy-button" onclick="alert('Response copied!')">
        Copy response
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
      </button>
      
      <div class="button-container">
        <button class="button" onclick="showScreen(0)">Start New Assessment</button>
      </div>
    </div>

    <!-- Emergency Screen -->
    <div class="screen" id="screen-emergency">
      <div class="header">
        <button class="back-button" onclick="goBack()">Back</button>
        <div class="title">SEEK MEDICAL ATTENTION</div>
      </div>
      <div class="alert" style="margin-top: 20px; font-size: 20px; text-align: center; padding: 20px;">
        <strong>WARNING: SEEK IMMEDIATE MEDICAL ATTENTION</strong>
      </div>
      <p class="description" style="text-align: center; font-weight: bold; font-size: 18px;">Your symptoms suggest a potentially serious condition that requires immediate medical evaluation.</p>
      
      <p class="description">Please do one of the following:</p>
      <ul style="font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
        <li>Go to the nearest emergency room</li>
        <li>Call 911 or your local emergency number</li>
        <li>Contact your doctor immediately</li>
      </ul>
      
      <p class="description">Do not wait to see if symptoms improve on their own.</p>
      
      <div class="button-container">
        <button class="button secondary" onclick="goBack()">Return to Assessment</button>
      </div>
    </div>
  </div>

  <!-- Navigation Controls (for Demo Only) -->
  <div class="controls">
    <button class="nav-button" onclick="showNavScreen(0)">Welcome</button>
    <button class="nav-button" onclick="showNavScreen(1)">Pain</button>
    <button class="nav-button" onclick="showNavScreen(5)">Vomiting</button>
    <button class="nav-button" onclick="showNavScreen(7)">Bowels</button>
    <button class="nav-button" onclick="showNavScreen(9)">History</button>
    <button class="nav-button" onclick="showNavScreen(10)">Summary</button>
    <button class="nav-button" onclick="showNavScreen(11)">Results</button>
    <button class="nav-button" onclick="showNavScreen('emergency')">Emergency</button>
  </div>

  <script>
    let currentScreen = 0;
    let previousScreen = 0;
    let selectedOptions = {};
    let nextScreens = {};
    
    function showScreen(screenId) {
      previousScreen = currentScreen;
      currentScreen = screenId;
      
      document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
      });
      
      document.getElementById('screen-' + screenId).classList.add('active');
      
      // Update navigation buttons
      document.querySelectorAll('.nav-button').forEach(button => {
        button.classList.remove('active');
      });
      
      const activeNavButton = document.querySelector(`.nav-button:nth-child(${screenId + 1})`);
      if (activeNavButton) {
        activeNavButton.classList.add('active');
      }
    }
    
    function showNavScreen(screenId) {
      previousScreen = currentScreen;
      currentScreen = screenId;
      
      document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
      });
      
      document.getElementById('screen-' + screenId).classList.add('active');
      
      // Update navigation buttons
      document.querySelectorAll('.nav-button').forEach(button => {
        button.classList.remove('active');
      });
      
      const buttons = document.querySelectorAll('.nav-button');
      let buttonIndex;
      
      if (screenId === 'emergency') {
        buttonIndex = buttons.length - 1;
      } else {
        buttonIndex = parseInt(screenId);
      }
      
      if (buttons[buttonIndex]) {
        buttons[buttonIndex].classList.add('active');
      }
    }
    
    function selectOption(element, screenId, nextScreenId) {
      // Deselect other options on the same screen
      document.querySelectorAll(`#screen-${screenId} .option`).forEach(option => {
        option.classList.remove('selected');
      });
      
      // Select the clicked option
      element.classList.add('selected');
      
      // Store the selection
      selectedOptions[screenId] = element.textContent.trim();
      
      // Store the next screen
      nextScreens[screenId] = nextScreenId;
    }
    
    function toggleMultiOption(element) {
      // Toggle selection for the clicked option
      element.classList.toggle('selected');
      
      // If "None of the above" is selected, deselect others
      if (element.textContent.includes("None of the above") && element.classList.contains('selected')) {
        document.querySelectorAll(`#screen-9 .option:not(:contains('None'))`).forEach(option => {
          option.classList.remove('selected');
        });
      }
      
      // If any other option is selected, deselect "None of the above"
      if (!element.textContent.includes("None of the above") && element.classList.contains('selected')) {
        document.querySelectorAll(`#screen-9 .option:contains('None')`).forEach(option => {
          option.classList.remove('selected');
        });
      }
    }
    
    function nextScreen() {
      if (nextScreens[currentScreen]) {
        if (nextScreens[currentScreen] === 'emergency') {
          showScreen('emergency');
        } else {
          showScreen(nextScreens[currentScreen]);
        }
      }
    }
    
    function goBack() {
      showScreen(previousScreen);
    }
    
    // Initialize the app
    document.addEventListener('DOMContentLoaded', function() {
      showScreen(0);
    });
  </script>
</body>
</html>