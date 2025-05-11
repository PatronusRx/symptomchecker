<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vaginal Bleeding Tracker</title>
  <style>
    * {
      box-sizing: border-box;
      font-family: Arial, sans-serif;
    }
    body {
      margin: 0;
      padding: 0;
      background-color: #f5f5f5;
      color: #333;
    }
    .app-container {
      max-width: 420px;
      margin: 0 auto;
      background: white;
      height: 740px;
      position: relative;
      overflow: hidden;
      border: 10px solid #333;
      border-radius: 30px;
    }
    .screen {
      width: 100%;
      height: 100%;
      padding: 20px;
      display: none;
    }
    .screen.active {
      display: block;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .progress {
      height: 8px;
      background-color: #e9e9e9;
      border-radius: 4px;
      margin-bottom: 30px;
    }
    .progress-bar {
      height: 100%;
      background-color: #ff6b6b;
      border-radius: 4px;
      transition: width 0.3s ease;
    }
    h1 {
      font-size: 22px;
      color: #333;
      margin: 0 0 10px 0;
    }
    h2 {
      font-size: 18px;
      color: #555;
      margin: 0 0 20px 0;
    }
    .btn {
      display: block;
      width: 100%;
      padding: 16px;
      background-color: #ff6b6b;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: bold;
      margin: 10px 0;
      cursor: pointer;
      text-align: center;
      transition: background-color 0.3s;
    }
    .btn:hover {
      background-color: #e05c5c;
    }
    .btn-secondary {
      background-color: #e9e9e9;
      color: #333;
    }
    .btn-secondary:hover {
      background-color: #d9d9d9;
    }
    .btn-warning {
      background-color: #ff3b3b;
    }
    .btn-warning:hover {
      background-color: #e03535;
    }
    .option-group {
      margin: 20px 0;
    }
    .option-btn {
      display: block;
      width: 100%;
      padding: 16px;
      background-color: white;
      color: #333;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-size: 16px;
      margin: 10px 0;
      cursor: pointer;
      text-align: left;
      transition: all 0.3s;
    }
    .option-btn:hover, .option-btn.selected {
      background-color: #f9e9e9;
      border-color: #ff6b6b;
    }
    .option-btn.selected {
      border-width: 2px;
    }
    .input-field {
      width: 100%;
      padding: 16px;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-size: 16px;
      margin: 10px 0;
    }
    .emergency-banner {
      background-color: #ffebeb;
      border-left: 4px solid #ff3b3b;
      padding: 15px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .emergency-banner h3 {
      margin: 0 0 10px 0;
      color: #ff3b3b;
    }
    .emergency-banner p {
      margin: 0;
    }
    .review-item {
      padding: 12px 0;
      border-bottom: 1px solid #eee;
    }
    .review-label {
      font-weight: bold;
      margin-bottom: 5px;
    }
    .review-value {
      margin: 0;
      color: #555;
    }
    .back-btn {
      background: none;
      border: none;
      color: #888;
      font-size: 14px;
      padding: 5px;
      cursor: pointer;
    }
    .nav-buttons {
      position: absolute;
      bottom: 20px;
      left: 20px;
      right: 20px;
      display: flex;
      justify-content: space-between;
    }
    .next-btn {
      flex-grow: 1;
    }
    .back-nav-btn {
      width: 80px;
      background-color: #e9e9e9;
      color: #333;
      margin-right: 10px;
    }
  </style>
</head>
<body>
  <div class="app-container">
    <!-- Welcome Screen -->
    <div class="screen active" id="welcome-screen">
      <h1>Vaginal Bleeding Tracker</h1>
      <h2>Track your symptoms to share with your healthcare provider</h2>
      <p>This tool will help you record important details about vaginal bleeding. The information you provide can help your healthcare provider make an accurate diagnosis.</p>
      <p>If you experience severe bleeding or other concerning symptoms, please seek medical care immediately.</p>
      <div class="emergency-banner">
        <h3>Seek immediate medical attention if you have:</h3>
        <ul>
          <li>Heavy bleeding (soaking through pad/tampon every hour)</li>
          <li>Lightheadedness, dizziness, or fainting</li>
          <li>Severe abdominal or pelvic pain</li>
          <li>Fever above 100.4°F (38°C)</li>
        </ul>
      </div>
      <button class="btn" onclick="showScreen('onset-screen')">Start Tracking</button>
    </div>

    <!-- Onset Screen -->
    <div class="screen" id="onset-screen">
      <div class="header">
        <h1>When did the bleeding start?</h1>
        <span>1/10</span>
      </div>
      <div class="progress">
        <div class="progress-bar" style="width: 10%;"></div>
      </div>
      <input type="date" class="input-field" id="bleeding-start-date">
      <div class="option-group">
        <h2>How did the bleeding begin?</h2>
        <button class="option-btn" onclick="selectOption(this)">Suddenly (all at once)</button>
        <button class="option-btn" onclick="selectOption(this)">Gradually (slowly over time)</button>
        <button class="option-btn" onclick="selectOption(this)">After an injury or trauma</button>
      </div>
      <div class="nav-buttons">
        <button class="btn back-nav-btn" onclick="showScreen('welcome-screen')">Back</button>
        <button class="btn next-btn" onclick="showScreen('bleeding-amount-screen')">Next</button>
      </div>
    </div>

    <!-- Bleeding Amount Screen -->
    <div class="screen" id="bleeding-amount-screen">
      <div class="header">
        <h1>How heavy is the bleeding?</h1>
        <span>2/10</span>
      </div>
      <div class="progress">
        <div class="progress-bar" style="width: 20%;"></div>
      </div>
      <div class="option-group">
        <button class="option-btn" onclick="selectOption(this)">Light (just spotting)</button>
        <button class="option-btn" onclick="selectOption(this)">Moderate (similar to or less than normal period)</button>
        <button class="option-btn" onclick="selectOption(this)">Heavy (more than normal period)</button>
        <button class="option-btn" onclick="selectOption(this, true)">Very heavy (soaking through pad/tampon hourly)</button>
      </div>
      <div class="emergency-banner" id="emergency-warning" style="display: none;">
        <h3>Warning: Seek Medical Care</h3>
        <p>Very heavy bleeding can be a sign of a serious condition. Please contact your healthcare provider right away or go to the nearest emergency room.</p>
      </div>
      <div class="nav-buttons">
        <button class="btn back-nav-btn" onclick="showScreen('onset-screen')">Back</button>
        <button class="btn next-btn" onclick="showScreen('bleeding-characteristics-screen')">Next</button>
      </div>
    </div>

    <!-- Bleeding Characteristics Screen -->
    <div class="screen" id="bleeding-characteristics-screen">
      <div class="header">
        <h1>Bleeding Characteristics</h1>
        <span>3/10</span>
      </div>
      <div class="progress">
        <div class="progress-bar" style="width: 30%;"></div>
      </div>
      <div class="option-group">
        <h2>What color is the blood?</h2>
        <button class="option-btn" onclick="selectOption(this)">Bright red</button>
        <button class="option-btn" onclick="selectOption(this)">Dark red</button>
        <button class="option-btn" onclick="selectOption(this)">Brown</button>
        <button class="option-btn" onclick="selectOption(this)">Mixed with clots</button>
      </div>
      <div class="option-group">
        <h2>Are there blood clots?</h2>
        <button class="option-btn" onclick="selectOption(this)">No clots</button>
        <button class="option-btn" onclick="selectOption(this)">Small clots (smaller than a dime)</button>
        <button class="option-btn" onclick="selectOption(this)">Medium clots (dime to quarter size)</button>
        <button class="option-btn" onclick="selectOption(this, true)">Large clots (larger than a quarter)</button>
      </div>
      <div class="emergency-banner" id="clots-warning" style="display: none;">
        <h3>Warning: Seek Medical Care</h3>
        <p>Large blood clots may indicate a serious condition. Please contact your healthcare provider right away.</p>
      </div>
      <div class="nav-buttons">
        <button class="btn back-nav-btn" onclick="showScreen('bleeding-amount-screen')">Back</button>
        <button class="btn next-btn" onclick="showScreen('pain-screen')">Next</button>
      </div>
    </div>

    <!-- Pain Screen -->
    <div class="screen" id="pain-screen">
      <div class="header">
        <h1>Pain Assessment</h1>
        <span>4/10</span>
      </div>
      <div class="progress">
        <div class="progress-bar" style="width: 40%;"></div>
      </div>
      <h2>Do you have pain with the bleeding?</h2>
      <div class="option-group">
        <button class="option-btn" onclick="selectOption(this); togglePainOptions(false)">No pain</button>
        <button class="option-btn" onclick="selectOption(this); togglePainOptions(true)">Mild pain</button>
        <button class="option-btn" onclick="selectOption(this); togglePainOptions(true)">Moderate pain</button>
        <button class="option-btn" onclick="selectOption(this, true); togglePainOptions(true)">Severe pain</button>
      </div>
      <div id="pain-options" style="display: none;">
        <h2>Where is the pain located?</h2>
        <div class="option-group">
          <button class="option-btn" onclick="selectOption(this)">Lower abdomen</button>
          <button class="option-btn" onclick="selectOption(this)">Lower back</button>
          <button class="option-btn" onclick="selectOption(this)">Pelvic area</button>
          <button class="option-btn" onclick="selectOption(this)">Other location</button>
        </div>
      </div>
      <div class="emergency-banner" id="pain-warning" style="display: none;">
        <h3>Warning: Seek Medical Care</h3>
        <p>Severe pain with vaginal bleeding can indicate a serious condition that needs immediate evaluation. Please contact your healthcare provider or go to the nearest emergency room.</p>
      </div>
      <div class="nav-buttons">
        <button class="btn back-nav-btn" onclick="showScreen('bleeding-characteristics-screen')">Back</button>
        <button class="btn next-btn" onclick="showScreen('timing-screen')">Next</button>
      </div>
    </div>

    <!-- Timing Screen -->
    <div class="screen" id="timing-screen">
      <div class="header">
        <h1>Timing of Bleeding</h1>
        <span>5/10</span>
      </div>
      <div class="progress">
        <div class="progress-bar" style="width: 50%;"></div>
      </div>
      <div class="option-group">
        <h2>How long has this bleeding episode lasted?</h2>
        <button class="option-btn" onclick="selectOption(this)">Less than 1 day</button>
        <button class="option-btn" onclick="selectOption(this)">1-3 days</button>
        <button class="option-btn" onclick="selectOption(this)">4-7 days</button>
        <button class="option-btn" onclick="selectOption(this, true)">More than 7 days</button>
      </div>
      <div class="option-group">
        <h2>Is the bleeding related to your menstrual cycle?</h2>
        <button class="option-btn" onclick="selectOption(this)">During expected period</button>
        <button class="option-btn" onclick="selectOption(this)">Between periods</button>
        <button class="option-btn" onclick="selectOption(this)">After missed period</button>
        <button class="option-btn" onclick="selectOption(this)">I have irregular cycles</button>
        <button class="option-btn" onclick="selectOption(this)">I've gone through menopause</button>
      </div>
      <div class="emergency-banner" id="duration-warning" style="display: none;">
        <h3>Warning: Consult Healthcare Provider</h3>
        <p>Bleeding that lasts longer than 7 days should be evaluated by a healthcare provider.</p>
      </div>
      <div class="nav-buttons">
        <button class="btn back-nav-btn" onclick="showScreen('pain-screen')">Back</button>
        <button class="btn next-btn" onclick="showScreen('additional-symptoms-screen')">Next</button>
      </div>
    </div>

    <!-- Additional Symptoms Screen -->
    <div class="screen" id="additional-symptoms-screen">
      <div class="header">
        <h1>Additional Symptoms</h1>
        <span>6/10</span>
      </div>
      <div class="progress">
        <div class="progress-bar" style="width: 60%;"></div>
      </div>
      <h2>Are you experiencing any of these symptoms?</h2>
      <p>Select all that apply</p>
      <div class="option-group">
        <button class="option-btn multi-select" onclick="toggleMultiSelect(this)">Fever</button>
        <button class="option-btn multi-select" onclick="toggleMultiSelect(this, true)">Dizziness or lightheadedness</button>
        <button class="option-btn multi-select" onclick="toggleMultiSelect(this)">Nausea or vomiting</button>
        <button class="option-btn multi-select" onclick="toggleMultiSelect(this)">Unusual vaginal discharge</button>
        <button class="option-btn multi-select" onclick="toggleMultiSelect(this)">Pain during urination</button>
        <button class="option-btn multi-select" onclick="toggleMultiSelect(this)">Fatigue or weakness</button>
        <button class="option-btn multi-select" onclick="toggleMultiSelect(this)">None of these</button>
      </div>
      <div class="emergency-banner" id="dizziness-warning" style="display: none;">
        <h3>Warning: Seek Medical Care</h3>
        <p>Dizziness or lightheadedness with vaginal bleeding may indicate significant blood loss. Please seek immediate medical attention.</p>
      </div>
      <div class="nav-buttons">
        <button class="btn back-nav-btn" onclick="showScreen('timing-screen')">Back</button>
        <button class="btn next-btn" onclick="showScreen('menstrual-history-screen')">Next</button>
      </div>
    </div>

    <!-- Menstrual History Screen -->
    <div class="screen" id="menstrual-history-screen">
      <div class="header">
        <h1>Menstrual History</h1>
        <span>7/10</span>
      </div>
      <div class="progress">
        <div class="progress-bar" style="width: 70%;"></div>
      </div>
      <h2>When was the first day of your last period?</h2>
      <input type="date" class="input-field">
      <div class="option-group">
        <h2>How long do your periods usually last?</h2>
        <button class="option-btn" onclick="selectOption(this)">Less than 3 days</button>
        <button class="option-btn" onclick="selectOption(this)">3-5 days</button>
        <button class="option-btn" onclick="selectOption(this)">6-7 days</button>
        <button class="option-btn" onclick="selectOption(this)">More than 7 days</button>
        <button class="option-btn" onclick="selectOption(this)">Varies significantly</button>
      </div>
      <div class="option-group">
        <h2>Is there a possibility you might be pregnant?</h2>
        <button class="option-btn" onclick="selectOption(this)">No</button>
        <button class="option-btn" onclick="selectOption(this)">Yes</button>
        <button class="option-btn" onclick="selectOption(this)">Not sure</button>
      </div>
      <div class="nav-buttons">
        <button class="btn back-nav-btn" onclick="showScreen('additional-symptoms-screen')">Back</button>
        <button class="btn next-btn" onclick="showScreen('medications-screen')">Next</button>
      </div>
    </div>

    <!-- Medications Screen -->
    <div class="screen" id="medications-screen">
      <div class="header">
        <h1>Medications</h1>
        <span>8/10</span>
      </div>
      <div class="progress">
        <div class="progress-bar" style="width: 80%;"></div>
      </div>
      <h2>Are you currently taking any of these?</h2>
      <p>Select all that apply</p>
      <div class="option-group">
        <button class="option-btn multi-select" onclick="toggleMultiSelect(this)">Birth control pills</button>
        <button class="option-btn multi-select" onclick="toggleMultiSelect(this)">Hormonal IUD</button>
        <button class="option-btn multi-select" onclick="toggleMultiSelect(this)">Birth control implant or shot</button>
        <button class="option-btn multi-select" onclick="toggleMultiSelect(this)">Blood thinners (e.g., warfarin, aspirin)</button>
        <button class="option-btn multi-select" onclick="toggleMultiSelect(this)">Hormone replacement therapy</button>
        <button class="option-btn multi-select" onclick="toggleMultiSelect(this)">None of these</button>
      </div>
      <h2>List any other medications you take regularly:</h2>
      <textarea class="input-field" rows="3" placeholder="Enter medications here"></textarea>
      <div class="nav-buttons">
        <button class="btn back-nav-btn" onclick="showScreen('menstrual-history-screen')">Back</button>
        <button class="btn next-btn" onclick="showScreen('medical-history-screen')">Next</button>
      </div>
    </div>

    <!-- Medical History Screen -->
    <div class="screen" id="medical-history-screen">
      <div class="header">
        <h1>Medical History</h1>
        <span>9/10</span>
      </div>
      <div class="progress">
        <div class="progress-bar" style="width: 90%;"></div>
      </div>
      <h2>Do you have any of these conditions?</h2>
      <p>Select all that apply</p>
      <div class="option-group">
        <button class="option-btn multi-select" onclick="toggleMultiSelect(this)">Uterine fibroids</button>
        <button class="option-btn multi-select" onclick="toggleMultiSelect(this)">Endometriosis</button>
        <button class="option-btn multi-select" onclick="toggleMultiSelect(this)">Polycystic ovary syndrome (PCOS)</button>
        <button class="option-btn multi-select" onclick="toggleMultiSelect(this)">Thyroid disorder</button>
        <button class="option-btn multi-select" onclick="toggleMultiSelect(this)">Bleeding disorder</button>
        <button class="option-btn multi-select" onclick="toggleMultiSelect(this)">Cancer (current or past)</button>
        <button class="option-btn multi-select" onclick="toggleMultiSelect(this)">None of these</button>
      </div>
      <h2>Have you had any of these procedures?</h2>
      <div class="option-group">
        <button class="option-btn multi-select" onclick="toggleMultiSelect(this)">D&C (dilation and curettage)</button>
        <button class="option-btn multi-select" onclick="toggleMultiSelect(this)">Endometrial ablation</button>
        <button class="option-btn multi-select" onclick="toggleMultiSelect(this)">Hysteroscopy</button>
        <button class="option-btn multi-select" onclick="toggleMultiSelect(this)">Other uterine or cervical procedures</button>
        <button class="option-btn multi-select" onclick="toggleMultiSelect(this)">None of these</button>
      </div>
      <div class="nav-buttons">
        <button class="btn back-nav-btn" onclick="showScreen('medications-screen')">Back</button>
        <button class="btn next-btn" onclick="showScreen('review-screen')">Review</button>
      </div>
    </div>

    <!-- Review Screen -->
    <div class="screen" id="review-screen">
      <div class="header">
        <h1>Review Your Information</h1>
        <span>10/10</span>
      </div>
      <div class="progress">
        <div class="progress-bar" style="width: 100%;"></div>
      </div>
      <p>Please review the information you've provided before submitting:</p>
      <div class="review-item">
        <div class="review-label">Bleeding start date:</div>
        <div class="review-value">April 15, 2025</div>
      </div>
      <div class="review-item">
        <div class="review-label">Bleeding onset:</div>
        <div class="review-value">Gradually (slowly over time)</div>
      </div>
      <div class="review-item">
        <div class="review-label">Bleeding heaviness:</div>
        <div class="review-value">Moderate (similar to normal period)</div>
      </div>
      <div class="review-item">
        <div class="review-label">Blood color:</div>
        <div class="review-value">Dark red</div>
      </div>
      <div class="review-item">
        <div class="review-label">Pain level:</div>
        <div class="review-value">Mild pain (lower abdomen)</div>
      </div>
      <p>Tap any section above to edit your responses.</p>
      <div class="emergency-banner">
        <h3>Remember:</h3>
        <p>Seek immediate medical attention if bleeding becomes heavy, you develop severe pain, or you experience dizziness/lightheadedness.</p>
      </div>
      <div class="nav-buttons">
        <button class="btn back-nav-btn" onclick="showScreen('medical-history-screen')">Back</button>
        <button class="btn next-btn" onclick="showScreen('confirmation-screen')">Submit</button>
      </div>
    </div>

    <!-- Confirmation Screen -->
    <div class="screen" id="confirmation-screen">
      <h1>Information Submitted</h1>
      <p>Thank you for completing the vaginal bleeding assessment. Your information has been saved.</p>
      <div class="emergency-banner">
        <h3>Important:</h3>
        <p>This tracker is not a substitute for medical care. If you're experiencing severe symptoms, please seek medical attention right away.</p>
      </div>
      <h2>Next Steps:</h2>
      <p>1. Share this information with your healthcare provider at your next appointment.</p>
      <p>2. Continue tracking if bleeding persists or changes.</p>
      <p>3. Follow up with your healthcare provider as recommended.</p>
      <button class="btn" id="copy-btn">Copy My Responses</button>
      <button class="btn btn-secondary" onclick="showScreen('welcome-screen')">Start New Tracking</button>
    </div>
  </div>

  <script>
    function showScreen(screenId) {
      // Hide all screens
      document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
      });
      
      // Show the selected screen
      document.getElementById(screenId).classList.add('active');
    }
    
    function selectOption(element, showWarning = false) {
      // Find all siblings and remove selected class
      const siblings = element.parentElement.querySelectorAll('.option-btn:not(.multi-select)');
      siblings.forEach(sib => {
        sib.classList.remove('selected');
      });
      
      // Add selected class to clicked element
      element.classList.add('selected');
      
      // Show warning if applicable
      const screenId = element.closest('.screen').id;
      if (showWarning) {
        if (screenId === 'bleeding-amount-screen') {
          document.getElementById('emergency-warning').style.display = 'block';
        } else if (screenId === 'bleeding-characteristics-screen') {
          document.getElementById('clots-warning').style.display = 'block';
        } else if (screenId === 'pain-screen') {
          document.getElementById('pain-warning').style.display = 'block';
        } else if (screenId === 'timing-screen') {
          document.getElementById('duration-warning').style.display = 'block';
        }
      }
    }
    
    function toggleMultiSelect(element, showWarning = false) {
      // Toggle selected class
      element.classList.toggle('selected');
      
      // Show warning if applicable
      if (showWarning && element.classList.contains('selected')) {
        document.getElementById('dizziness-warning').style.display = 'block';
      } else if (showWarning) {
        document.getElementById('dizziness-warning').style.display = 'none';
      }
      
      // If "None of these" is selected, deselect all others
      if (element.textContent === 'None of these' && element.classList.contains('selected')) {
        const siblings = element.parentElement.querySelectorAll('.option-btn.multi-select');
        siblings.forEach(sib => {
          if (sib !== element) {
            sib.classList.remove('selected');
          }
        });
      } 
      // If any other option is selected, deselect "None of these"
      else if (element.textContent !== 'None of these' && element.classList.contains('selected')) {
        const noneOption = element.parentElement.querySelector('.option-btn.multi-select:last-child');
        if (noneOption && noneOption.textContent === 'None of these') {
          noneOption.classList.remove('selected');
        }
      }
    }
    
    function togglePainOptions(show) {
      const painOptions = document.getElementById('pain-options');
      painOptions.style.display = show ? 'block' : 'none';
    }
    
    // Copy button functionality
    document.getElementById('copy-btn').addEventListener('click', function() {
      alert('Your responses have been copied to clipboard');
    });
  </script>
</body>
</html>