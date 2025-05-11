<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Swollen Leg Evaluation</title>
    <style>
        * {
            box-sizing: border-box;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        }
        
        body {
            margin: 0;
            padding: 0;
            background-color: #f5f7fa;
            color: #333;
        }
        
        .app-container {
            max-width: 480px;
            margin: 0 auto;
            background-color: white;
            min-height: 100vh;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            position: relative;
        }
        
        .app-header {
            background-color: #3066BE;
            color: white;
            padding: 16px;
            text-align: center;
            position: sticky;
            top: 0;
            z-index: 100;
        }
        
        .progress-bar-container {
            background-color: #e0e0e0;
            height: 8px;
            width: 100%;
            margin-top: 8px;
        }
        
        .progress-bar {
            height: 100%;
            background-color: #4BD28F;
            width: 10%;
            transition: width 0.3s ease;
        }
        
        .screen {
            padding: 20px;
            display: none;
        }
        
        .screen.active {
            display: block;
        }
        
        .question {
            font-size: 18px;
            font-weight: 500;
            margin-bottom: 20px;
        }
        
        .options {
            display: flex;
            flex-direction: column;
            gap: 12px;
            margin-bottom: 24px;
        }
        
        .option {
            background-color: #f5f7fa;
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 16px;
            font-size: 16px;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        
        .option:hover, .option.selected {
            background-color: #e8f0fe;
            border-color: #3066BE;
        }
        
        .option.selected {
            border-width: 2px;
        }
        
        .date-input, .text-input, .number-input {
            width: 100%;
            padding: 16px;
            font-size: 16px;
            border: 1px solid #ddd;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        
        .button-container {
            display: flex;
            justify-content: space-between;
            margin-top: 24px;
            padding-bottom: 32px;
        }
        
        .btn {
            padding: 16px 24px;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 500;
            cursor: pointer;
            border: none;
            transition: background-color 0.2s ease;
        }
        
        .btn-back {
            background-color: #f5f7fa;
            color: #555;
        }
        
        .btn-next {
            background-color: #3066BE;
            color: white;
        }
        
        .btn-back:hover {
            background-color: #e0e0e0;
        }
        
        .btn-next:hover {
            background-color: #255bb8;
        }
        
        .emergency-alert {
            background-color: #ffebee;
            border-left: 4px solid #d32f2f;
            padding: 16px;
            margin-bottom: 24px;
            border-radius: 4px;
        }
        
        .emergency-title {
            color: #d32f2f;
            font-weight: 600;
            margin-bottom: 8px;
        }
        
        .summary-section {
            margin-bottom: 24px;
            border-bottom: 1px solid #eee;
            padding-bottom: 16px;
        }
        
        .summary-title {
            font-weight: 600;
            font-size: 18px;
            margin-bottom: 12px;
            color: #3066BE;
        }
        
        .summary-item {
            display: flex;
            margin-bottom: 8px;
        }
        
        .summary-label {
            flex: 1;
            font-weight: 500;
        }
        
        .summary-value {
            flex: 1;
        }
        
        .copy-btn {
            display: block;
            width: 100%;
            background-color: #4BD28F;
            color: white;
            padding: 16px;
            border-radius: 8px;
            text-align: center;
            margin-top: 24px;
            font-weight: 500;
            cursor: pointer;
            border: none;
        }
        
        .copy-btn:hover {
            background-color: #3cb179;
        }
        
        .option-additional {
            margin-top: 12px;
            padding-left: 16px;
            display: none;
        }
        
        .option.selected + .option-additional {
            display: block;
        }
        
        .checkbox-option {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 16px;
        }
        
        .checkbox-option input[type="checkbox"] {
            width: 20px;
            height: 20px;
        }
        
        .checkbox-label {
            font-size: 16px;
        }
    </style>
</head>
<body>
    <div class="app-container">
        <div class="app-header">
            <h1>Swollen Leg Evaluation</h1>
            <div class="progress-bar-container">
                <div class="progress-bar" id="progressBar"></div>
            </div>
        </div>
        
        <!-- Start Screen -->
        <div class="screen active" id="screen1">
            <h2>Swollen Leg Assessment</h2>
            <p>This app will help you document your swollen leg symptoms for your healthcare provider.</p>
            <p>Please answer the questions as accurately as possible. Your responses will be organized into a report that you can share with your doctor.</p>
            
            <div class="emergency-alert">
                <div class="emergency-title">SEEK IMMEDIATE MEDICAL ATTENTION IF:</div>
                <ul>
                    <li>You have severe, sudden leg swelling with pain</li>
                    <li>You're experiencing chest pain or difficulty breathing</li>
                    <li>Your leg is pale, cold, or has no pulse</li>
                    <li>You're unable to walk or put weight on your leg</li>
                    <li>You have confusion or feel faint</li>
                </ul>
            </div>
            
            <div class="button-container">
                <div></div> <!-- Empty div to maintain spacing -->
                <button class="btn btn-next" onclick="nextScreen(2)">Begin Assessment</button>
            </div>
        </div>
        
        <!-- Onset Screen -->
        <div class="screen" id="screen2">
            <div class="question">When did you first notice the swelling?</div>
            <div class="options">
                <div class="option" onclick="selectOption(this)">Today or yesterday</div>
                <div class="option" onclick="selectOption(this)">2-7 days ago</div>
                <div class="option" onclick="selectOption(this)">1-4 weeks ago</div>
                <div class="option" onclick="selectOption(this)">More than 1 month ago</div>
                <div class="option" onclick="selectOption(this)">I've had this problem before</div>
            </div>
            
            <div class="question">How quickly did the swelling develop?</div>
            <div class="options">
                <div class="option" onclick="selectOption(this)">Suddenly (minutes to hours)</div>
                <div class="option" onclick="selectOption(this)">Gradually (days to weeks)</div>
                <div class="option" onclick="selectOption(this)">I'm not sure</div>
            </div>
            
            <div class="button-container">
                <button class="btn btn-back" onclick="prevScreen(1)">Back</button>
                <button class="btn btn-next" onclick="nextScreen(3)">Next</button>
            </div>
        </div>
        
        <!-- Critical Warning Screen -->
        <div class="screen" id="screen3">
            <div class="question">Are you experiencing any of these urgent symptoms?</div>
            <div class="emergency-alert">
                <div class="emergency-title">Check all that apply:</div>
                
                <div class="checkbox-option">
                    <input type="checkbox" id="urgent1">
                    <label class="checkbox-label" for="urgent1">Severe pain in your leg</label>
                </div>
                
                <div class="checkbox-option">
                    <input type="checkbox" id="urgent2">
                    <label class="checkbox-label" for="urgent2">Chest pain</label>
                </div>
                
                <div class="checkbox-option">
                    <input type="checkbox" id="urgent3">
                    <label class="checkbox-label" for="urgent3">Shortness of breath</label>
                </div>
                
                <div class="checkbox-option">
                    <input type="checkbox" id="urgent4">
                    <label class="checkbox-label" for="urgent4">Your leg is pale, cold, or has changed color</label>
                </div>
                
                <div class="checkbox-option">
                    <input type="checkbox" id="urgent5">
                    <label class="checkbox-label" for="urgent5">Numbness or tingling in your leg</label>
                </div>
                
                <div class="checkbox-option">
                    <input type="checkbox" id="urgent6">
                    <label class="checkbox-label" for="urgent6">Inability to move your leg normally</label>
                </div>
                
                <div class="checkbox-option">
                    <input type="checkbox" id="urgent7">
                    <label class="checkbox-label" for="urgent7">High fever (over 100.4°F or 38°C)</label>
                </div>
                
                <div class="checkbox-option">
                    <input type="checkbox" id="urgent8">
                    <label class="checkbox-label" for="urgent8">Confusion or feeling lightheaded</label>
                </div>
                
                <div class="checkbox-option">
                    <input type="checkbox" id="urgent9">
                    <label class="checkbox-label" for="urgent9">None of the above</label>
                </div>
            </div>
            
            <div class="question">Have you had any of these risk factors in the past month?</div>
            <div class="options">
                <div class="option" onclick="selectOption(this)">Recent surgery</div>
                <div class="option" onclick="selectOption(this)">Long flight or car ride (over 4 hours)</div>
                <div class="option" onclick="selectOption(this)">Cancer diagnosis or treatment</div>
                <div class="option" onclick="selectOption(this)">Pregnancy</div>
                <div class="option" onclick="selectOption(this)">Previous blood clot (DVT or PE)</div>
                <div class="option" onclick="selectOption(this)">None of the above</div>
            </div>
            
            <div class="button-container">
                <button class="btn btn-back" onclick="prevScreen(2)">Back</button>
                <button class="btn btn-next" onclick="checkUrgentSymptoms()">Next</button>
            </div>
        </div>
        
        <!-- Emergency Screen (conditional) -->
        <div class="screen" id="screenEmergency">
            <h2>Seek Medical Care Immediately</h2>
            
            <div class="emergency-alert">
                <div class="emergency-title">WARNING:</div>
                <p>Based on your responses, you may be experiencing symptoms that require immediate medical attention.</p>
                <p>Please do one of the following immediately:</p>
                <ul>
                    <li>Call 911 or your local emergency number</li>
                    <li>Have someone drive you to the nearest emergency room</li>
                    <li>If neither option is available, call your doctor's office for urgent guidance</li>
                </ul>
                <p>Do not wait to see if symptoms improve on their own.</p>
            </div>
            
            <p>You can still complete this assessment to share with healthcare providers, but please seek immediate care first.</p>
            
            <div class="button-container">
                <button class="btn btn-back" onclick="prevScreen(3)">Back</button>
                <button class="btn btn-next" onclick="nextScreen(4)">Continue Assessment</button>
            </div>
        </div>
        
        <!-- Location Screen -->
        <div class="screen" id="screen4">
            <div class="question">Which leg is swollen?</div>
            <div class="options">
                <div class="option" onclick="selectOption(this)">Right leg only</div>
                <div class="option" onclick="selectOption(this)">Left leg only</div>
                <div class="option" onclick="selectOption(this)">Both legs</div>
            </div>
            
            <div class="question">Where exactly is the swelling?</div>
            <div class="options">
                <div class="option" onclick="selectOption(this)">Foot only</div>
                <div class="option" onclick="selectOption(this)">Ankle only</div>
                <div class="option" onclick="selectOption(this)">Below the knee</div>
                <div class="option" onclick="selectOption(this)">Entire leg</div>
                <div class="option" onclick="selectOption(this)">Other or specific area</div>
                <div class="option-additional">
                    <input type="text" class="text-input" placeholder="Please describe the location">
                </div>
            </div>
            
            <div class="button-container">
                <button class="btn btn-back" onclick="prevScreen(3)">Back</button>
                <button class="btn btn-next" onclick="nextScreen(5)">Next</button>
            </div>
        </div>
        
        <!-- Symptoms & Quality Screen -->
        <div class="screen" id="screen5">
            <div class="question">How would you describe the swelling?</div>
            <div class="options">
                <div class="option" onclick="selectOption(this)">Mild (barely noticeable)</div>
                <div class="option" onclick="selectOption(this)">Moderate (obvious swelling)</div>
                <div class="option" onclick="selectOption(this)">Severe (very swollen and tight)</div>
            </div>
            
            <div class="question">When you press on the swollen area with your finger, what happens?</div>
            <div class="options">
                <div class="option" onclick="selectOption(this)">It leaves a dent that slowly goes away (pitting)</div>
                <div class="option" onclick="selectOption(this)">It does not leave a dent (non-pitting)</div>
                <div class="option" onclick="selectOption(this)">I haven't tried this</div>
            </div>
            
            <div class="question">Do you have any pain in the affected leg(s)?</div>
            <div class="options">
                <div class="option" onclick="selectOption(this)">No pain</div>
                <div class="option" onclick="selectOption(this)">Mild pain</div>
                <div class="option" onclick="selectOption(this)">Moderate pain</div>
                <div class="option" onclick="selectOption(this)">Severe pain</div>
            </div>
            
            <div class="button-container">
                <button class="btn btn-back" onclick="prevScreen(4)">Back</button>
                <button class="btn btn-next" onclick="nextScreen(6)">Next</button>
            </div>
        </div>
        
        <!-- Timing & Pattern Screen -->
        <div class="screen" id="screen6">
            <div class="question">When is the swelling typically at its worst?</div>
            <div class="options">
                <div class="option" onclick="selectOption(this)">Morning</div>
                <div class="option" onclick="selectOption(this)">End of the day</div>
                <div class="option" onclick="selectOption(this)">After sitting for long periods</div>
                <div class="option" onclick="selectOption(this)">After standing for long periods</div>
                <div class="option" onclick="selectOption(this)">It's constant throughout the day</div>
                <div class="option" onclick="selectOption(this)">No clear pattern</div>
            </div>
            
            <div class="question">What makes the swelling better?</div>
            <div class="options">
                <div class="option" onclick="selectOption(this)">Elevating my legs</div>
                <div class="option" onclick="selectOption(this)">Compression stockings</div>
                <div class="option" onclick="selectOption(this)">Walking or exercise</div>
                <div class="option" onclick="selectOption(this)">Rest</div>
                <div class="option" onclick="selectOption(this)">Nothing seems to help</div>
                <div class="option" onclick="selectOption(this)">Other</div>
                <div class="option-additional">
                    <input type="text" class="text-input" placeholder="Please describe what helps">
                </div>
            </div>
            
            <div class="button-container">
                <button class="btn btn-back" onclick="prevScreen(5)">Back</button>
                <button class="btn btn-next" onclick="nextScreen(7)">Next</button>
            </div>
        </div>
        
        <!-- Associated Symptoms Screen -->
        <div class="screen" id="screen7">
            <div class="question">Have you noticed any other symptoms with the swelling?</div>
            <div class="emergency-alert">
                <div class="checkbox-option">
                    <input type="checkbox" id="assoc1">
                    <label class="checkbox-label" for="assoc1">Skin changes (redness, warmth, rash)</label>
                </div>
                
                <div class="checkbox-option">
                    <input type="checkbox" id="assoc2">
                    <label class="checkbox-label" for="assoc2">Skin discoloration or darkening</label>
                </div>
                
                <div class="checkbox-option">
                    <input type="checkbox" id="assoc3">
                    <label class="checkbox-label" for="assoc3">Itching</label>
                </div>
                
                <div class="checkbox-option">
                    <input type="checkbox" id="assoc4">
                    <label class="checkbox-label" for="assoc4">Open sores or ulcers</label>
                </div>
                
                <div class="checkbox-option">
                    <input type="checkbox" id="assoc5">
                    <label class="checkbox-label" for="assoc5">Fatigue</label>
                </div>
                
                <div class="checkbox-option">
                    <input type="checkbox" id="assoc6">
                    <label class="checkbox-label" for="assoc6">Recent weight gain</label>
                </div>
                
                <div class="checkbox-option">
                    <input type="checkbox" id="assoc7">
                    <label class="checkbox-label" for="assoc7">Decreased urination</label>
                </div>
                
                <div class="checkbox-option">
                    <input type="checkbox" id="assoc8">
                    <label class="checkbox-label" for="assoc8">None of the above</label>
                </div>
            </div>
            
            <div class="question">Have you noticed any changes in your breathing?</div>
            <div class="options">
                <div class="option" onclick="selectOption(this)">No breathing changes</div>
                <div class="option" onclick="selectOption(this)">Shortness of breath with activity</div>
                <div class="option" onclick="selectOption(this)">Shortness of breath at rest</div>
                <div class="option" onclick="selectOption(this)">Shortness of breath when lying flat</div>
                <div class="option" onclick="selectOption(this)">Need to sleep on multiple pillows</div>
            </div>
            
            <div class="button-container">
                <button class="btn btn-back" onclick="prevScreen(6)">Back</button>
                <button class="btn btn-next" onclick="nextScreen(8)">Next</button>
            </div>
        </div>
        
        <!-- Medical History Screen -->
        <div class="screen" id="screen8">
            <div class="question">Do you have any of these medical conditions?</div>
            <div class="emergency-alert">
                <div class="checkbox-option">
                    <input type="checkbox" id="med1">
                    <label class="checkbox-label" for="med1">High blood pressure</label>
                </div>
                
                <div class="checkbox-option">
                    <input type="checkbox" id="med2">
                    <label class="checkbox-label" for="med2">Heart failure</label>
                </div>
                
                <div class="checkbox-option">
                    <input type="checkbox" id="med3">
                    <label class="checkbox-label" for="med3">Kidney disease</label>
                </div>
                
                <div class="checkbox-option">
                    <input type="checkbox" id="med4">
                    <label class="checkbox-label" for="med4">Liver disease</label>
                </div>
                
                <div class="checkbox-option">
                    <input type="checkbox" id="med5">
                    <label class="checkbox-label" for="med5">Diabetes</label>
                </div>
                
                <div class="checkbox-option">
                    <input type="checkbox" id="med6">
                    <label class="checkbox-label" for="med6">Thyroid problems</label>
                </div>
                
                <div class="checkbox-option">
                    <input type="checkbox" id="med7">
                    <label class="checkbox-label" for="med7">Previous blood clot (DVT/PE)</label>
                </div>
                
                <div class="checkbox-option">
                    <input type="checkbox" id="med8">
                    <label class="checkbox-label" for="med8">Varicose veins</label>
                </div>
                
                <div class="checkbox-option">
                    <input type="checkbox" id="med9">
                    <label class="checkbox-label" for="med9">Lymphedema</label>
                </div>
                
                <div class="checkbox-option">
                    <input type="checkbox" id="med10">
                    <label class="checkbox-label" for="med10">Cancer</label>
                </div>
                
                <div class="checkbox-option">
                    <input type="checkbox" id="med11">
                    <label class="checkbox-label" for="med11">None of the above</label>
                </div>
            </div>
            
            <div class="button-container">
                <button class="btn btn-back" onclick="prevScreen(7)">Back</button>
                <button class="btn btn-next" onclick="nextScreen(9)">Next</button>
            </div>
        </div>
        
        <!-- Medications Screen -->
        <div class="screen" id="screen9">
            <div class="question">Are you currently taking any of these medications?</div>
            <div class="emergency-alert">
                <div class="checkbox-option">
                    <input type="checkbox" id="rx1">
                    <label class="checkbox-label" for="rx1">Blood pressure medications</label>
                </div>
                
                <div class="checkbox-option">
                    <input type="checkbox" id="rx2">
                    <label class="checkbox-label" for="rx2">Water pills (diuretics)</label>
                </div>
                
                <div class="checkbox-option">
                    <input type="checkbox" id="rx3">
                    <label class="checkbox-label" for="rx3">Pain medications (NSAIDs like ibuprofen)</label>
                </div>
                
                <div class="checkbox-option">
                    <input type="checkbox" id="rx4">
                    <label class="checkbox-label" for="rx4">Steroids (like prednisone)</label>
                </div>
                
                <div class="checkbox-option">
                    <input type="checkbox" id="rx5">
                    <label class="checkbox-label" for="rx5">Hormones or birth control</label>
                </div>
                
                <div class="checkbox-option">
                    <input type="checkbox" id="rx6">
                    <label class="checkbox-label" for="rx6">Diabetes medications</label>
                </div>
                
                <div class="checkbox-option">
                    <input type="checkbox" id="rx7">
                    <label class="checkbox-label" for="rx7">Blood thinners</label>
                </div>
            </div>
            
            <div class="question">Have you recently started any new medications?</div>
            <div class="options">
                <div class="option" onclick="selectOption(this)">No</div>
                <div class="option" onclick="selectOption(this)">Yes, within the past week</div>
                <div class="option" onclick="selectOption(this)">Yes, within the past month</div>
                <div class="option" onclick="selectOption(this)">Yes, please specify</div>
                <div class="option-additional">
                    <input type="text" class="text-input" placeholder="Please list new medications">
                </div>
            </div>
            
            <div class="button-container">
                <button class="btn btn-back" onclick="prevScreen(8)">Back</button>
                <button class="btn btn-next" onclick="nextScreen(10)">Next</button>
            </div>
        </div>
        
        <!-- Lifestyle Screen -->
        <div class="screen" id="screen10">
            <div class="question">How would you describe your salt intake?</div>
            <div class="options">
                <div class="option" onclick="selectOption(this)">Low salt diet</div>
                <div class="option" onclick="selectOption(this)">Moderate salt intake</div>
                <div class="option" onclick="selectOption(this)">High salt intake</div>
                <div class="option" onclick="selectOption(this)">I frequently eat processed or fast foods</div>
                <div class="option" onclick="selectOption(this)">I don't know</div>
            </div>
            
            <div class="question">How much fluid do you typically drink per day?</div>
            <div class="options">
                <div class="option" onclick="selectOption(this)">Less than 4 cups (1 liter)</div>
                <div class="option" onclick="selectOption(this)">4-8 cups (1-2 liters)</div>
                <div class="option" onclick="selectOption(this)">More than 8 cups (2 liters)</div>
            </div>
            
            <div class="question">Does your job or daily activities involve:</div>
            <div class="options">
                <div class="option" onclick="selectOption(this)">Prolonged standing</div>
                <div class="option" onclick="selectOption(this)">Prolonged sitting</div>
                <div class="option" onclick="selectOption(this)">Both standing and sitting</div>
                <div class="option" onclick="selectOption(this)">Regular movement/active job</div>
            </div>
            
            <div class="button-container">
                <button class="btn btn-back" onclick="prevScreen(9)">Back</button>
                <button class="btn btn-next" onclick="nextScreen(11)">Next</button>
            </div>
        </div>
        
        <!-- Impact Screen -->
        <div class="screen" id="screen11">
            <div class="question">How much does the swelling affect your daily activities?</div>
            <div class="options">
                <div class="option" onclick="selectOption(this)">Not at all</div>
                <div class="option" onclick="selectOption(this)">Minimal impact</div>
                <div class="option" onclick="selectOption(this)">Moderate impact (some activities limited)</div>
                <div class="option" onclick="selectOption(this)">Severe impact (many activities limited)</div>
                <div class="option" onclick="selectOption(this)">Unable to perform normal activities</div>
            </div>
            
            <div class="question">Have you tried any treatments for your leg swelling?</div>
            <div class="emergency-alert">
                <div class="checkbox-option">
                    <input type="checkbox" id="tx1">
                    <label class="checkbox-label" for="tx1">Leg elevation</label>
                </div>
                
                <div class="checkbox-option">
                    <input type="checkbox" id="tx2">
                    <label class="checkbox-label" for="tx2">Compression stockings</label>
                </div>
                
                <div class="checkbox-option">
                    <input type="checkbox" id="tx3">
                    <label class="checkbox-label" for="tx3">Reduced salt intake</label>
                </div>
                
                <div class="checkbox-option">
                    <input type="checkbox" id="tx4">
                    <label class="checkbox-label" for="tx4">Water pills (diuretics)</label>
                </div>
                
                <div class="checkbox-option">
                    <input type="checkbox" id="tx5">
                    <label class="checkbox-label" for="tx5">Exercise</label>
                </div>
                
                <div class="checkbox-option">
                    <input type="checkbox" id="tx6">
                    <label class="checkbox-label" for="tx6">None of the above</label>
                </div>
            </div>
            
            <div class="question">Is there anything else you think your healthcare provider should know?</div>
            <textarea class="text-input" style="height: 100px;" placeholder="Add any additional information here"></textarea>
            
            <div class="button-container">
                <button class="btn btn-back" onclick="prevScreen(10)">Back</button>
                <button class="btn btn-next" onclick="nextScreen(12)">Review My Responses</button>
            </div>
        </div>
        
        <!-- Review Screen -->
        <div class="screen" id="screen12">
            <h2>Review Your Responses</h2>
            <p>Please review the information below before submitting:</p>
            
            <div class="summary-section">
                <div class="summary-title">Onset & Duration</div>
                <div class="summary-item">
                    <div class="summary-label">When noticed:</div>
                    <div class="summary-value">2-7 days ago</div>
                </div>
                <div class="summary-item">
                    <div class="summary-label">Development:</div>
                    <div class="summary-value">Gradually</div>
                </div>
            </div>
            
            <div class="summary-section">
                <div class="summary-title">Location & Severity</div>
                <div class="summary-item">
                    <div class="summary-label">Which leg:</div>
                    <div class="summary-value">Right leg only</div>
                </div>
                <div class="summary-item">
                    <div class="summary-label">Location:</div>
                    <div class="summary-value">Below the knee</div>
                </div>
                <div class="summary-item">
                    <div class="summary-label">Severity:</div>
                    <div class="summary-value">Moderate (obvious swelling)</div>
                </div>
                <div class="summary-item">
                    <div class="summary-label">Type:</div>
                    <div class="summary-value">Pitting edema</div>
                </div>
            </div>
            
            <div class="summary-section">
                <div class="summary-title">Pattern & Triggers</div>
                <div class="summary-item">
                    <div class="summary-label">Worst timing:</div>
                    <div class="summary-value">End of the day</div>
                </div>
                <div class="summary-item">
                    <div class="summary-label">What helps:</div>
                    <div class="summary-value">Elevating legs</div>
                </div>
            </div>
            
            <div class="summary-section">
                <div class="summary-title">Medical Background</div>
                <div class="summary-item">
                    <div class="summary-label">Conditions:</div>
                    <div class="summary-value">High blood pressure, Varicose veins</div>
                </div>
                <div class="summary-item">
                    <div class="summary-label">Medications:</div>
                    <div class="summary-value">Blood pressure medications</div>
                </div>
            </div>
            
            <button class="copy-btn" onclick="alert('Results copied to clipboard!')">Copy Results</button>
            
            <div class="button-container">
                <button class="btn btn-back" onclick="prevScreen(11)">Back</button>
                <button class="btn btn-next" onclick="submitAssessment()">Submit Assessment</button>
            </div>
        </div>
        
        <!-- Thank You Screen -->
        <div class="screen" id="screenThankYou">
            <h2>Assessment Completed</h2>
            <p>Thank you for completing the swollen leg assessment!</p>
            
            <div class="emergency-alert" style="background-color: #e8f5e9; border-color: #4caf50;">
                <div class="emergency-title" style="color: #4caf50;">Next Steps:</div>
                <ol>
                    <li>Share this assessment with your healthcare provider</li>
                    <li>Follow any treatment recommendations from your provider</li>
                    <li>Continue to monitor your symptoms</li>
                    <li>Seek immediate medical attention if your symptoms worsen</li>
                </ol>
            </div>
            
            <p>Your assessment has been saved. You can access it again by clicking the button below:</p>
            
            <button class="copy-btn" onclick="alert('Results copied to clipboard!')">Copy My Results</button>
            
            <div class="button-container">
                <button class="btn btn-back" onclick="prevScreen(12)">Review My Responses</button>
                <button class="btn btn-next" onclick="startOver()">Start a New Assessment</button>
            </div>
        </div>
    </div>

    <script>
        function nextScreen(screenNum) {
            // Hide all screens
            document.querySelectorAll('.screen').forEach(screen => {
                screen.classList.remove('active');
            });
            
            // Show target screen
            document.getElementById('screen' + screenNum).classList.add('active');
            
            // Update progress bar (12 total screens excluding emergency and thank you)
            const progress = Math.min((screenNum / 12) * 100, 100);
            document.getElementById('progressBar').style.width = progress + '%';
            
            // Scroll to top
            window.scrollTo(0, 0);
        }
        
        function prevScreen(screenNum) {
            nextScreen(screenNum);
        }
        
        function selectOption(option) {
            // Find all sibling options and remove selected class
            const options = option.parentElement.querySelectorAll('.option');
            options.forEach(opt => {
                opt.classList.remove('selected');
            });
            
            // Add selected class to clicked option
            option.classList.add('selected');
        }
        
        function checkUrgentSymptoms() {
            // In a real app, this would check if any urgent symptoms were selected
            // For this prototype, let's simulate a 30% chance of showing the emergency screen
            const showEmergency = Math.random() < 0.3;
            
            if (showEmergency) {
                document.querySelectorAll('.screen').forEach(screen => {
                    screen.classList.remove('active');
                });
                document.getElementById('screenEmergency').classList.add('active');
            } else {
                nextScreen(4);
            }
        }
        
        function submitAssessment() {
            // Hide all screens
            document.querySelectorAll('.screen').forEach(screen => {
                screen.classList.remove('active');
            });
            
            // Show thank you screen
            document.getElementById('screenThankYou').classList.add('active');
            
            // Set progress to 100%
            document.getElementById('progressBar').style.width = '100%';
        }
        
        function startOver() {
            // Reset to first screen
            nextScreen(1);
            
            // Clear all selections (would be more comprehensive in a real app)
            document.querySelectorAll('.option').forEach(opt => {
                opt.classList.remove('selected');
            });
            
            document.querySelectorAll('input[type="checkbox"]').forEach(check => {
                check.checked = false;
            });
            
            document.querySelectorAll('input[type="text"], textarea').forEach(input => {
                input.value = '';
            });
        }
    </script>
</body>
</html>