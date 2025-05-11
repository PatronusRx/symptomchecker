<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sore Throat Tracker</title>
    <style>
        :root {
            --primary: #4285f4;
            --danger: #ea4335;
            --success: #34a853;
            --warning: #fbbc05;
            --light: #f8f9fa;
            --dark: #202124;
            --gray: #5f6368;
            --border-radius: 12px;
        }
        
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        }
        
        body {
            background-color: #f8f9fa;
            color: #202124;
            line-height: 1.6;
            padding: 0;
            margin: 0;
            max-width: 100%;
            overflow-x: hidden;
        }
        
        .container {
            width: 100%;
            max-width: 480px;
            margin: 0 auto;
            background: white;
            height: 100vh;
            overflow-y: auto;
            box-shadow: 0 1px 3px rgba(0,0,0,0.12);
            position: relative;
            padding-bottom: 80px;
        }
        
        header {
            background-color: var(--primary);
            color: white;
            padding: 16px;
            text-align: center;
            position: sticky;
            top: 0;
            z-index: 100;
        }
        
        h1 {
            font-size: 20px;
            font-weight: 500;
        }
        
        .progress-container {
            height: 8px;
            background: rgba(255,255,255,0.3);
            border-radius: 4px;
            margin-top: 8px;
        }
        
        .progress-bar {
            height: 100%;
            background: white;
            border-radius: 4px;
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
            margin-bottom: 24px;
        }
        
        h2 {
            font-size: 18px;
            font-weight: 500;
            margin-bottom: 16px;
        }
        
        h3 {
            font-size: 16px;
            font-weight: 500;
            margin-bottom: 12px;
            color: var(--dark);
        }
        
        .option {
            background: white;
            border: 1px solid #dadce0;
            padding: 16px;
            margin-bottom: 12px;
            border-radius: var(--border-radius);
            cursor: pointer;
            transition: all 0.2s ease;
        }
        
        .option:hover, .option:focus {
            border-color: var(--primary);
            box-shadow: 0 1px 3px rgba(66, 133, 244, 0.3);
        }
        
        .option.selected {
            border-color: var(--primary);
            background-color: rgba(66, 133, 244, 0.1);
        }
        
        label {
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
        }
        
        input[type="text"], 
        input[type="number"],
        select,
        textarea {
            width: 100%;
            padding: 12px;
            border: 1px solid #dadce0;
            border-radius: var(--border-radius);
            font-size: 16px;
            margin-bottom: 8px;
        }

        input[type="text"]:focus, 
        input[type="number"]:focus,
        select:focus,
        textarea:focus {
            outline: none;
            border-color: var(--primary);
            box-shadow: 0 1px 3px rgba(66, 133, 244, 0.3);
        }
        
        .checkbox-group {
            margin-bottom: 12px;
        }
        
        .checkbox-item {
            display: flex;
            align-items: center;
            margin-bottom: 8px;
        }
        
        .checkbox-item input {
            margin-right: 12px;
            width: 20px;
            height: 20px;
        }
        
        .checkbox-item label {
            margin-bottom: 0;
            font-weight: normal;
        }
        
        .alarm-feature {
            background-color: rgba(234, 67, 53, 0.1);
            border: 1px solid var(--danger);
            padding: 16px;
            border-radius: var(--border-radius);
            margin-bottom: 24px;
        }
        
        .alarm-title {
            color: var(--danger);
            font-weight: 500;
            display: flex;
            align-items: center;
            margin-bottom: 8px;
        }
        
        .alarm-title span {
            margin-left: 8px;
        }
        
        .emergency-box {
            background-color: var(--danger);
            color: white;
            padding: 16px;
            border-radius: var(--border-radius);
            margin: 16px 0;
            font-weight: 500;
        }
        
        .navigation {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: white;
            padding: 16px;
            display: flex;
            justify-content: space-between;
            box-shadow: 0 -1px 3px rgba(0,0,0,0.1);
            max-width: 480px;
            margin: 0 auto;
        }
        
        button {
            padding: 12px 24px;
            border: none;
            border-radius: var(--border-radius);
            font-size: 16px;
            font-weight: 500;
            cursor: pointer;
            transition: background-color 0.2s ease;
        }
        
        button.primary {
            background-color: var(--primary);
            color: white;
        }
        
        button.secondary {
            background-color: #f1f3f4;
            color: var(--dark);
        }
        
        button:hover {
            opacity: 0.9;
        }
        
        button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
        
        .severity-scale {
            display: flex;
            justify-content: space-between;
            margin: 16px 0;
        }
        
        .severity-point {
            text-align: center;
        }
        
        .severity-number {
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            background: #f1f3f4;
            margin-bottom: 4px;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        
        .severity-number:hover {
            background: rgba(66, 133, 244, 0.1);
        }
        
        .severity-number.selected {
            background: var(--primary);
            color: white;
        }
        
        .severity-label {
            font-size: 12px;
            color: var(--gray);
        }
        
        .summary-section {
            margin-bottom: 24px;
            padding-bottom: 16px;
            border-bottom: 1px solid #dadce0;
        }
        
        .summary-item {
            margin-bottom: 8px;
        }
        
        .summary-label {
            font-weight: 500;
        }
        
        .copy-btn {
            background-color: var(--success);
            color: white;
            margin-top: 24px;
        }
        
        .notification {
            position: fixed;
            bottom: 80px;
            left: 50%;
            transform: translateX(-50%);
            padding: 12px 24px;
            background: rgba(52, 168, 83, 0.9);
            color: white;
            border-radius: var(--border-radius);
            font-weight: 500;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .notification.show {
            opacity: 1;
        }
        
        .hidden {
            display: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>Sore Throat Tracker</h1>
            <div class="progress-container">
                <div class="progress-bar" id="progressBar"></div>
            </div>
        </header>

        <!-- Welcome Screen -->
        <div class="screen active" id="screen1">
            <h2>Sore Throat Assessment</h2>
            <p>This tool will help assess your sore throat symptoms to provide better information for your healthcare provider.</p>
            <p>Complete this short assessment (2-3 minutes) before your appointment.</p>
            
            <div class="alarm-feature">
                <div class="alarm-title">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                        <line x1="12" y1="9" x2="12" y2="13"></line>
                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                    <span>Emergency Warning</span>
                </div>
                <p>Seek emergency medical care immediately if you have:</p>
                <ul>
                    <li>Severe difficulty breathing</li>
                    <li>Inability to swallow saliva or drooling</li>
                    <li>Unusual neck swelling</li>
                    <li>Severe pain unresponsive to pain relievers</li>
                </ul>
            </div>
            
            <p>This assessment is not a substitute for professional medical advice. Always consult with your healthcare provider.</p>
        </div>

        <!-- Critical Alarm Features Screen -->
        <div class="screen" id="screen2">
            <h2>Critical Symptoms Check</h2>
            <p>Do you have any of these symptoms? (Check all that apply)</p>
            
            <div class="checkbox-group">
                <div class="checkbox-item">
                    <input type="checkbox" id="severe_breathing" name="alarmFeatures" value="severe_breathing">
                    <label for="severe_breathing">Severe difficulty breathing</label>
                </div>
                <div class="checkbox-item">
                    <input type="checkbox" id="drooling" name="alarmFeatures" value="drooling">
                    <label for="drooling">Inability to swallow saliva/drooling</label>
                </div>
                <div class="checkbox-item">
                    <input type="checkbox" id="stridor" name="alarmFeatures" value="stridor">
                    <label for="stridor">High-pitched breathing sounds (stridor)</label>
                </div>
                <div class="checkbox-item">
                    <input type="checkbox" id="hot_potato" name="alarmFeatures" value="hot_potato">
                    <label for="hot_potato">Muffled/"hot potato" voice</label>
                </div>
                <div class="checkbox-item">
                    <input type="checkbox" id="lockjaw" name="alarmFeatures" value="lockjaw">
                    <label for="lockjaw">Inability to open mouth fully (lockjaw)</label>
                </div>
                <div class="checkbox-item">
                    <input type="checkbox" id="neck_swelling" name="alarmFeatures" value="neck_swelling">
                    <label for="neck_swelling">Neck swelling/fullness</label>
                </div>
                <div class="checkbox-item">
                    <input type="checkbox" id="unilateral_swelling" name="alarmFeatures" value="unilateral_swelling">
                    <label for="unilateral_swelling">One-sided throat/tonsil swelling</label>
                </div>
                <div class="checkbox-item">
                    <input type="checkbox" id="severe_pain" name="alarmFeatures" value="severe_pain">
                    <label for="severe_pain">Severe pain unresponsive to pain relievers</label>
                </div>
                <div class="checkbox-item">
                    <input type="checkbox" id="dehydration" name="alarmFeatures" value="dehydration">
                    <label for="dehydration">Signs of dehydration (very dry mouth, decreased urination)</label>
                </div>
                <div class="checkbox-item">
                    <input type="checkbox" id="none_alarm" name="alarmFeatures" value="none_alarm">
                    <label for="none_alarm">None of the above</label>
                </div>
            </div>
            
            <div class="emergency-box hidden" id="emergencyWarning">
                <p>These symptoms may indicate a serious condition requiring immediate medical attention. Please seek emergency care immediately.</p>
            </div>
        </div>

        <!-- Onset Screen -->
        <div class="screen" id="screen3">
            <h2>Symptom Onset</h2>
            
            <div class="question">
                <label for="onset_type">How did your sore throat start?</label>
                <div class="option" data-value="sudden" onclick="selectOption(this, 'onset_type')">
                    Suddenly (within hours)
                </div>
                <div class="option" data-value="gradual" onclick="selectOption(this, 'onset_type')">
                    Gradually (over days)
                </div>
                <input type="hidden" id="onset_type" name="onset_type">
            </div>
            
            <div class="question">
                <label for="duration">How long have you had the sore throat?</label>
                <div class="option" data-value="less_than_24h" onclick="selectOption(this, 'duration')">
                    Less than 24 hours
                </div>
                <div class="option" data-value="1_3_days" onclick="selectOption(this, 'duration')">
                    1-3 days
                </div>
                <div class="option" data-value="4_7_days" onclick="selectOption(this, 'duration')">
                    4-7 days
                </div>
                <div class="option" data-value="1_2_weeks" onclick="selectOption(this, 'duration')">
                    1-2 weeks
                </div>
                <div class="option" data-value="more_than_2_weeks" onclick="selectOption(this, 'duration')">
                    More than 2 weeks
                </div>
                <input type="hidden" id="duration" name="duration">
            </div>
            
            <div class="question">
                <label for="episode_type">Is this your first episode of sore throat?</label>
                <div class="option" data-value="first" onclick="selectOption(this, 'episode_type')">
                    Yes, first time
                </div>
                <div class="option" data-value="recurrent" onclick="selectOption(this, 'episode_type')">
                    No, I've had sore throats before
                </div>
                <input type="hidden" id="episode_type" name="episode_type">
            </div>
        </div>

        <!-- Pain Characteristics Screen -->
        <div class="screen" id="screen4">
            <h2>Pain Characteristics</h2>
            
            <div class="question">
                <label for="pain_type">How would you describe your throat pain?</label>
                <div class="option" data-value="burning" onclick="selectOption(this, 'pain_type')">
                    Burning
                </div>
                <div class="option" data-value="raw" onclick="selectOption(this, 'pain_type')">
                    Raw/Scratchy
                </div>
                <div class="option" data-value="sharp" onclick="selectOption(this, 'pain_type')">
                    Sharp/Stabbing
                </div>
                <div class="option" data-value="dull" onclick="selectOption(this, 'pain_type')">
                    Dull/Achy
                </div>
                <div class="option" data-value="foreign_body" onclick="selectOption(this, 'pain_type')">
                    Foreign body sensation (feels like something is stuck)
                </div>
                <input type="hidden" id="pain_type" name="pain_type">
            </div>
            
            <div class="question">
                <label for="pain_location">Where is your throat pain located?</label>
                <div class="option" data-value="one_side" onclick="selectOption(this, 'pain_location')">
                    One side only
                </div>
                <div class="option" data-value="both_sides" onclick="selectOption(this, 'pain_location')">
                    Both sides
                </div>
                <div class="option" data-value="front" onclick="selectOption(this, 'pain_location')">
                    Front of throat
                </div>
                <div class="option" data-value="back" onclick="selectOption(this, 'pain_location')">
                    Back of throat
                </div>
                <input type="hidden" id="pain_location" name="pain_location">
            </div>
            
            <div class="question">
                <label>How severe is your throat pain (1 = very mild, 10 = worst pain imaginable)?</label>
                <div class="severity-scale">
                    <div class="severity-point">
                        <div class="severity-number" onclick="selectSeverity(1)">1</div>
                        <div class="severity-label">Very Mild</div>
                    </div>
                    <div class="severity-point">
                        <div class="severity-number" onclick="selectSeverity(2)">2</div>
                    </div>
                    <div class="severity-point">
                        <div class="severity-number" onclick="selectSeverity(3)">3</div>
                    </div>
                    <div class="severity-point">
                        <div class="severity-number" onclick="selectSeverity(4)">4</div>
                    </div>
                    <div class="severity-point">
                        <div class="severity-number" onclick="selectSeverity(5)">5</div>
                        <div class="severity-label">Moderate</div>
                    </div>
                    <div class="severity-point">
                        <div class="severity-number" onclick="selectSeverity(6)">6</div>
                    </div>
                    <div class="severity-point">
                        <div class="severity-number" onclick="selectSeverity(7)">7</div>
                    </div>
                    <div class="severity-point">
                        <div class="severity-number" onclick="selectSeverity(8)">8</div>
                    </div>
                    <div class="severity-point">
                        <div class="severity-number" onclick="selectSeverity(9)">9</div>
                    </div>
                    <div class="severity-point">
                        <div class="severity-number" onclick="selectSeverity(10)">10</div>
                        <div class="severity-label">Severe</div>
                    </div>
                </div>
                <input type="hidden" id="pain_severity" name="pain_severity" value="">
            </div>
        </div>

        <!-- Associated Symptoms Screen -->
        <div class="screen" id="screen5">
            <h2>Associated Symptoms</h2>
            <p>Do you have any of these other symptoms? (Check all that apply)</p>
            
            <div class="checkbox-group">
                <div class="checkbox-item">
                    <input type="checkbox" id="fever" name="associated_symptoms" value="fever">
                    <label for="fever">Fever</label>
                </div>
                <div class="checkbox-item hidden" id="fever_details">
                    <label for="fever_temp">Highest temperature (if known):</label>
                    <input type="text" id="fever_temp" name="fever_temp" placeholder="e.g., 101.2°F">
                </div>
                <div class="checkbox-item">
                    <input type="checkbox" id="chills" name="associated_symptoms" value="chills">
                    <label for="chills">Chills or shivering</label>
                </div>
                <div class="checkbox-item">
                    <input type="checkbox" id="cough" name="associated_symptoms" value="cough">
                    <label for="cough">Cough</label>
                </div>
                <div class="checkbox-item">
                    <input type="checkbox" id="runny_nose" name="associated_symptoms" value="runny_nose">
                    <label for="runny_nose">Runny or stuffy nose</label>
                </div>
                <div class="checkbox-item">
                    <input type="checkbox" id="difficult_swallow" name="associated_symptoms" value="difficult_swallow">
                    <label for="difficult_swallow">Difficulty swallowing</label>
                </div>
                <div class="checkbox-item">
                    <input type="checkbox" id="painful_swallow" name="associated_symptoms" value="painful_swallow">
                    <label for="painful_swallow">Painful swallowing</label>
                </div>
                <div class="checkbox-item">
                    <input type="checkbox" id="voice_changes" name="associated_symptoms" value="voice_changes">
                    <label for="voice_changes">Voice changes/hoarseness</label>
                </div>
                <div class="checkbox-item">
                    <input type="checkbox" id="ear_pain" name="associated_symptoms" value="ear_pain">
                    <label for="ear_pain">Ear pain</label>
                </div>
                <div class="checkbox-item">
                    <input type="checkbox" id="headache" name="associated_symptoms" value="headache">
                    <label for="headache">Headache</label>
                </div>
                <div class="checkbox-item">
                    <input type="checkbox" id="fatigue" name="associated_symptoms" value="fatigue">
                    <label for="fatigue">Fatigue/feeling run down</label>
                </div>
                <div class="checkbox-item">
                    <input type="checkbox" id="muscle_aches" name="associated_symptoms" value="muscle_aches">
                    <label for="muscle_aches">Muscle aches</label>
                </div>
                <div class="checkbox-item">
                    <input type="checkbox" id="swollen_nodes" name="associated_symptoms" value="swollen_nodes">
                    <label for="swollen_nodes">Swollen/tender neck glands</label>
                </div>
                <div class="checkbox-item">
                    <input type="checkbox" id="spots_throat" name="associated_symptoms" value="spots_throat">
                    <label for="spots_throat">White or yellow spots in throat/tonsils</label>
                </div>
                <div class="checkbox-item">
                    <input type="checkbox" id="rash" name="associated_symptoms" value="rash">
                    <label for="rash">Rash</label>
                </div>
                <div class="checkbox-item">
                    <input type="checkbox" id="none_associated" name="associated_symptoms" value="none_associated">
                    <label for="none_associated">None of the above</label>
                </div>
            </div>
        </div>

        <!-- Triggers & Relief Screen -->
        <div class="screen" id="screen6">
            <h2>Triggers & Relief</h2>
            
            <div class="question">
                <p>What makes your sore throat worse? (Check all that apply)</p>
                <div class="checkbox-group">
                    <div class="checkbox-item">
                        <input type="checkbox" id="trigger_swallowing" name="triggers" value="swallowing">
                        <label for="trigger_swallowing">Swallowing</label>
                    </div>
                    <div class="checkbox-item">
                        <input type="checkbox" id="trigger_speaking" name="triggers" value="speaking">
                        <label for="trigger_speaking">Speaking/talking</label>
                    </div>
                    <div class="checkbox-item">
                        <input type="checkbox" id="trigger_cold" name="triggers" value="cold_beverages">
                        <label for="trigger_cold">Cold beverages</label>
                    </div>
                    <div class="checkbox-item">
                        <input type="checkbox" id="trigger_hot" name="triggers" value="hot_beverages">
                        <label for="trigger_hot">Hot beverages</label>
                    </div>
                    <div class="checkbox-item">
                        <input type="checkbox" id="trigger_lying" name="triggers" value="lying_down">
                        <label for="trigger_lying">Lying down</label>
                    </div>
                    <div class="checkbox-item">
                        <input type="checkbox" id="trigger_morning" name="triggers" value="morning">
                        <label for="trigger_morning">Morning time</label>
                    </div>
                    <div class="checkbox-item">
                        <input type="checkbox" id="trigger_evening" name="triggers" value="evening">
                        <label for="trigger_evening">Evening/night time</label>
                    </div>
                    <div class="checkbox-item">
                        <input type="checkbox" id="trigger_unknown" name="triggers" value="unknown">
                        <label for="trigger_unknown">Don't know/Nothing specific</label>
                    </div>
                </div>
            </div>
            
            <div class="question">
                <p>What helps relieve your sore throat? (Check all that apply)</p>
                <div class="checkbox-group">
                    <div class="checkbox-item">
                        <input type="checkbox" id="relief_warm" name="relief" value="warm_liquids">
                        <label for="relief_warm">Warm liquids (tea, soup)</label>
                    </div>
                    <div class="checkbox-item">
                        <input type="checkbox" id="relief_cold" name="relief" value="cold_liquids">
                        <label for="relief_cold">Cold liquids or ice</label>
                    </div>
                    <div class="checkbox-item">
                        <input type="checkbox" id="relief_lozenges" name="relief" value="lozenges">
                        <label for="relief_lozenges">Throat lozenges/drops</label>
                    </div>
                    <div class="checkbox-item">
                        <input type="checkbox" id="relief_otc" name="relief" value="otc_pain_meds">
                        <label for="relief_otc">Over-the-counter pain medication</label>
                    </div>
                    <div class="checkbox-item">
                        <input type="checkbox" id="relief_salt" name="relief" value="salt_water">
                        <label for="relief_salt">Gargling salt water</label>
                    </div>
                    <div class="checkbox-item">
                        <input type="checkbox" id="relief_voice_rest" name="relief" value="voice_rest">
                        <label for="relief_voice_rest">Voice rest (not talking)</label>
                    </div>
                    <div class="checkbox-item">
                        <input type="checkbox" id="relief_nothing" name="relief" value="nothing">
                        <label for="relief_nothing">Nothing helps</label>
                    </div>
                </div>
            </div>
        </div>

        <!-- Past History Screen -->
        <div class="screen" id="screen7">
            <h2>Past History</h2>
            
            <div class="question">
                <label for="previous_sore_throats">Have you had frequent sore throats in the past year?</label>
                <div class="option" data-value="none" onclick="selectOption(this, 'previous_sore_throats')">
                    No, this is rare for me
                </div>
                <div class="option" data-value="occasional" onclick="selectOption(this, 'previous_sore_throats')">
                    Occasionally (2-3 per year)
                </div>
                <div class="option" data-value="frequent" onclick="selectOption(this, 'previous_sore_throats')">
                    Yes, frequently (4+ per year)
                </div>
                <input type="hidden" id="previous_sore_throats" name="previous_sore_throats">
            </div>
            
            <div class="question">
                <label for="tonsillectomy">Have you had your tonsils removed?</label>
                <div class="option" data-value="yes" onclick="selectOption(this, 'tonsillectomy')">
                    Yes
                </div>
                <div class="option" data-value="no" onclick="selectOption(this, 'tonsillectomy')">
                    No
                </div>
                <div class="option" data-value="unknown" onclick="selectOption(this, 'tonsillectomy')">
                    I don't know
                </div>
                <input type="hidden" id="tonsillectomy" name="tonsillectomy">
            </div>
            
            <div class="question">
                <label for="medical_conditions">Do you have any ongoing medical conditions?</label>
                <div class="checkbox-group">
                    <div class="checkbox-item">
                        <input type="checkbox" id="condition_none" name="conditions" value="none">
                        <label for="condition_none">None</label>
                    </div>
                    <div class="checkbox-item">
                        <input type="checkbox" id="condition_diabetes" name="conditions" value="diabetes">
                        <label for="condition_diabetes">Diabetes</label>
                    </div>
                    <div class="checkbox-item">
                        <input type="checkbox" id="condition_reflux" name="conditions" value="reflux">
                        <label for="condition_reflux">Acid reflux/GERD</label>
                    </div>
                    <div class="checkbox-item">
                        <input type="checkbox" id="condition_allergies" name="conditions" value="allergies">
                        <label for="condition_allergies">Allergies</label>
                    </div>
                    <div class="checkbox-item">
                        <input type="checkbox" id="condition_asthma" name="conditions" value="asthma">
                        <label for="condition_asthma">Asthma</label>
                    </div>
                    <div class="checkbox-item">
                        <input type="checkbox" id="condition_immune" name="conditions" value="immune_issue">
                        <label for="condition_immune">Immune system condition</label>
                    </div>
                    <div class="checkbox-item">
                        <input type="checkbox" id="condition_other" name="conditions" value="other">
                        <label for="condition_other">Other condition</label>
                    </div>
                </div>
            </div>
            
            <div class="question hidden" id="other_conditions_section">
                <label for="other_conditions">Please specify other conditions:</label>
                <input type="text" id="other_conditions" name="other_conditions" placeholder="Enter other conditions here">
            </div>
        </div>

        <!-- Risk Factors Screen -->
        <div class="screen" id="screen8">
            <h2>Exposure & Risk Factors</h2>
            
            <div class="question">
                <label for="exposed_person">Have you been in close contact with anyone with similar symptoms or confirmed illness?</label>
                <div class="option" data-value="yes" onclick="selectOption(this, 'exposed_person')">
                    Yes
                </div>
                <div class="option" data-value="no" onclick="selectOption(this, 'exposed_person')">
                    No
                </div>
                <div class="option" data-value="unknown" onclick="selectOption(this, 'exposed_person')">
                    Not sure
                </div>
                <input type="hidden" id="exposed_person" name="exposed_person">
            </div>
            
            <div class="question hidden" id="exposure_details_section">
                <label for="exposure_details">Please provide details about the exposure:</label>
                <textarea id="exposure_details" name="exposure_details" rows="3" placeholder="Who was sick, how you were exposed, when it happened"></textarea>
            </div>
            
            <div class="question">
                <label>Do any of these apply to you? (Check all that apply)</label>
                <div class="checkbox-group">
                    <div class="checkbox-item">
                        <input type="checkbox" id="risk_smoking" name="risk_factors" value="smoking">
                        <label for="risk_smoking">Smoking or vaping</label>
                    </div>
                    <div class="checkbox-item">
                        <input type="checkbox" id="risk_alcohol" name="risk_factors" value="alcohol">
                        <label for="risk_alcohol">Regular alcohol consumption</label>
                    </div>
                    <div class="checkbox-item">
                        <input type="checkbox" id="risk_daycare" name="risk_factors" value="daycare_school">
                        <label for="risk_daycare">Daycare/school attendance</label>
                    </div>
                    <div class="checkbox-item">
                        <input type="checkbox" id="risk_crowded" name="risk_factors" value="crowded_living">
                        <label for="risk_crowded">Crowded living conditions</label>
                    </div>
                    <div class="checkbox-item">
                        <input type="checkbox" id="risk_healthcare" name="risk_factors" value="healthcare_worker">
                        <label for="risk_healthcare">Healthcare worker</label>
                    </div>
                    <div class="checkbox-item">
                        <input type="checkbox" id="risk_vocal" name="risk_factors" value="vocal_strain">
                        <label for="risk_vocal">Vocal strain (singing, teaching, etc.)</label>
                    </div>
                    <div class="checkbox-item">
                        <input type="checkbox" id="risk_none" name="risk_factors" value="none">
                        <label for="risk_none">None of the above</label>
                    </div>
                </div>
            </div>
        </div>

        <!-- Current Treatment Screen -->
        <div class="screen" id="screen9">
            <h2>Current Treatment</h2>
            
            <div class="question">
                <label>What have you tried for your sore throat so far? (Check all that apply)</label>
                <div class="checkbox-group">
                    <div class="checkbox-item">
                        <input type="checkbox" id="treatment_nothing" name="treatments" value="nothing">
                        <label for="treatment_nothing">Nothing yet</label>
                    </div>
                    <div class="checkbox-item">
                        <input type="checkbox" id="treatment_otc_pain" name="treatments" value="otc_pain">
                        <label for="treatment_otc_pain">Over-the-counter pain relievers (Tylenol, ibuprofen, etc.)</label>
                    </div>
                    <div class="checkbox-item">
                        <input type="checkbox" id="treatment_lozenges" name="treatments" value="lozenges">
                        <label for="treatment_lozenges">Throat lozenges or sprays</label>
                    </div>
                    <div class="checkbox-item">
                        <input type="checkbox" id="treatment_salt" name="treatments" value="salt">
                        <label for="treatment_salt">Salt water gargles</label>
                    </div>
                    <div class="checkbox-item">
                        <input type="checkbox" id="treatment_honey" name="treatments" value="honey">
                        <label for="treatment_honey">Honey and lemon</label>
                    </div>
                    <div class="checkbox-item">
                        <input type="checkbox" id="treatment_antibiotics" name="treatments" value="antibiotics">
                        <label for="treatment_antibiotics">Antibiotics</label>
                    </div>
                </div>
            </div>
            
            <div class="question hidden" id="antibiotics_section">
                <label for="antibiotics_details">Please provide details about the antibiotics:</label>
                <input type="text" id="antibiotics_details" name="antibiotics_details" placeholder="Name of antibiotic, when started, etc.">
            </div>
            
            <div class="question">
                <label for="treatment_effect">How well have your treatments worked so far?</label>
                <div class="option" data-value="helped" onclick="selectOption(this, 'treatment_effect')">
                    Helped significantly
                </div>
                <div class="option" data-value="some_help" onclick="selectOption(this, 'treatment_effect')">
                    Helped somewhat
                </div>
                <div class="option" data-value="no_help" onclick="selectOption(this, 'treatment_effect')">
                    No improvement
                </div>
                <div class="option" data-value="worse" onclick="selectOption(this, 'treatment_effect')">
                    Symptoms are worse
                </div>
                <div class="option" data-value="not_applicable" onclick="selectOption(this, 'treatment_effect')">
                    Not applicable (haven't tried treatments)
                </div>
                <input type="hidden" id="treatment_effect" name="treatment_effect">
            </div>
        </div>

        <!-- Additional Information Screen -->
        <div class="screen" id="screen10">
            <h2>Additional Information</h2>
            
            <div class="question">
                <label for="additional_info">Is there anything else your healthcare provider should know about your symptoms?</label>
                <textarea id="additional_info" name="additional_info" rows="4" placeholder="Any other details or concerns about your sore throat..."></textarea>
            </div>
            
            <div class="question">
                <label for="medication_allergies">Do you have any medication allergies?</label>
                <div class="option" data-value="no_allergies" onclick="selectOption(this, 'medication_allergies')">
                    No known medication allergies
                </div>
                <div class="option" data-value="yes_allergies" onclick="selectOption(this, 'medication_allergies')">
                    Yes, I have medication allergies
                </div>
                <input type="hidden" id="medication_allergies" name="medication_allergies">
            </div>
            
            <div class="question hidden" id="allergies_section">
                <label for="allergies_details">Please list your medication allergies:</label>
                <input type="text" id="allergies_details" name="allergies_details" placeholder="e.g., Penicillin, Sulfa drugs, etc.">
            </div>
        </div>

        <!-- Summary Screen -->
        <div class="screen" id="screen11">
            <h2>Summary</h2>
            <p>Here's a summary of your responses. Please review and confirm they are correct.</p>
            
            <div id="summaryContent">
                <!-- This will be filled with JavaScript -->
            </div>
            
            <button class="copy-btn" id="copyBtn" onclick="copyResults()">Copy Results</button>
            
            <div class="notification" id="notification">Results copied to clipboard</div>
        </div>

        <div class="navigation">
            <button class="secondary" id="prevBtn" onclick="prevScreen()">Back</button>
            <button class="primary" id="nextBtn" onclick="nextScreen()">Next</button>
        </div>
    </div>

    <script>
        // Track current screen
        let currentScreen = 1;
        const totalScreens = 11;
        let assessmentData = {};
        
        // Initialize
        document.addEventListener('DOMContentLoaded', function() {
            updateProgress();
            
            // Setup alarm feature checkboxes
            const alarmCheckboxes = document.querySelectorAll('input[name="alarmFeatures"]');
            const noneAlarmCheckbox = document.getElementById('none_alarm');
            
            alarmCheckboxes.forEach(checkbox => {
                checkbox.addEventListener('change', function() {
                    if (this.id === 'none_alarm' && this.checked) {
                        // If "None" is checked, uncheck all others
                        alarmCheckboxes.forEach(cb => {
                            if (cb.id !== 'none_alarm') {
                                cb.checked = false;
                            }
                        });
                    } else if (this.checked && this.id !== 'none_alarm') {
                        // If any other is checked, uncheck "None"
                        noneAlarmCheckbox.checked = false;
                    }
                    
                    // Show warning if any alarm feature except "None" is selected
                    const emergencyWarning = document.getElementById('emergencyWarning');
                    const anyAlarmSelected = Array.from(alarmCheckboxes).some(cb => 
                        cb.checked && cb.id !== 'none_alarm');
                    
                    emergencyWarning.classList.toggle('hidden', !anyAlarmSelected);
                });
            });
            
            // Setup associated symptoms
            const feverCheckbox = document.getElementById('fever');
            const feverDetails = document.getElementById('fever_details');
            
            feverCheckbox.addEventListener('change', function() {
                feverDetails.classList.toggle('hidden', !this.checked);
            });
            
            // Setup treatment section
            const antibioticsCheckbox = document.getElementById('treatment_antibiotics');
            const antibioticsSection = document.getElementById('antibiotics_section');
            
            antibioticsCheckbox.addEventListener('change', function() {
                antibioticsSection.classList.toggle('hidden', !this.checked);
            });
            
            // Setup risk factors
            const exposedPersonOptions = document.querySelectorAll('[data-value]');
            const exposureDetailsSection = document.getElementById('exposure_details_section');
            
            exposedPersonOptions.forEach(option => {
                option.addEventListener('click', function() {
                    if (this.dataset.value === 'yes' && this.parentElement.querySelector('label').htmlFor === 'exposed_person') {
                        exposureDetailsSection.classList.remove('hidden');
                    } else if (this.parentElement.querySelector('label').htmlFor === 'exposed_person') {
                        exposureDetailsSection.classList.add('hidden');
                    }
                });
            });
            
            // Setup condition other checkbox
            const conditionOtherCheckbox = document.getElementById('condition_other');
            const otherConditionsSection = document.getElementById('other_conditions_section');
            
            conditionOtherCheckbox.addEventListener('change', function() {
                otherConditionsSection.classList.toggle('hidden', !this.checked);
            });
            
            // Setup medication allergies
            const medicationAllergiesOptions = document.querySelectorAll('[data-value]');
            const allergiesSection = document.getElementById('allergies_section');
            
            medicationAllergiesOptions.forEach(option => {
                option.addEventListener('click', function() {
                    if (this.dataset.value === 'yes_allergies' && this.parentElement.querySelector('label').htmlFor === 'medication_allergies') {
                        allergiesSection.classList.remove('hidden');
                    } else if (this.parentElement.querySelector('label').htmlFor === 'medication_allergies') {
                        allergiesSection.classList.add('hidden');
                    }
                });
            });
        });
        
        // Navigate to next screen
        function nextScreen() {
            if (currentScreen === totalScreens) {
                // Submit form logic would go here
                return;
            }
            
            // Collect data from current screen
            collectDataFromCurrentScreen();
            
            // If on the last screen, populate summary
            if (currentScreen === totalScreens - 1) {
                populateSummary();
                document.getElementById('nextBtn').textContent = 'Done';
            }
            
            document.getElementById('screen' + currentScreen).classList.remove('active');
            currentScreen++;
            document.getElementById('screen' + currentScreen).classList.add('active');
            updateProgress();
        }
        
        // Navigate to previous screen
        function prevScreen() {
            if (currentScreen === 1) {
                return;
            }
            
            // Reset "Done" button text if going back from summary
            if (currentScreen === totalScreens) {
                document.getElementById('nextBtn').textContent = 'Next';
            }
            
            document.getElementById('screen' + currentScreen).classList.remove('active');
            currentScreen--;
            document.getElementById('screen' + currentScreen).classList.add('active');
            updateProgress();
        }
        
        // Update progress bar
        function updateProgress() {
            const progressBar = document.getElementById('progressBar');
            const percentage = ((currentScreen - 1) / (totalScreens - 1)) * 100;
            progressBar.style.width = percentage + '%';
            
            // Disable prev button on first screen
            document.getElementById('prevBtn').disabled = (currentScreen === 1);
        }
        
        // Handle option selection
        function selectOption(option, inputId) {
            // Deselect all siblings
            const options = option.parentElement.querySelectorAll('.option');
            options.forEach(opt => opt.classList.remove('selected'));
            
            // Select clicked option
            option.classList.add('selected');
            
            // Update hidden input
            document.getElementById(inputId).value = option.dataset.value;
        }
        
        // Handle severity selection
        function selectSeverity(value) {
            const severityNumbers = document.querySelectorAll('.severity-number');
            severityNumbers.forEach(num => {
                num.classList.remove('selected');
                if (parseInt(num.textContent) === value) {
                    num.classList.add('selected');
                }
            });
            
            document.getElementById('pain_severity').value = value;
        }
        
        // Collect data from current screen
        function collectDataFromCurrentScreen() {
            switch(currentScreen) {
                case 1:
                    // Welcome screen - no data to collect
                    break;
                case 2:
                    // Alarm features
                    const alarmFeatures = [];
                    document.querySelectorAll('input[name="alarmFeatures"]:checked').forEach(cb => {
                        alarmFeatures.push(cb.value);
                    });
                    assessmentData.alarmFeatures = alarmFeatures;
                    break;
                case 3:
                    // Onset
                    assessmentData.onsetType = document.getElementById('onset_type').value;
                    assessmentData.duration = document.getElementById('duration').value;
                    assessmentData.episodeType = document.getElementById('episode_type').value;
                    break;
                case 4:
                    // Pain characteristics
                    assessmentData.painType = document.getElementById('pain_type').value;
                    assessmentData.painLocation = document.getElementById('pain_location').value;
                    assessmentData.painSeverity = document.getElementById('pain_severity').value;
                    break;
                case 5:
                    // Associated symptoms
                    const symptoms = [];
                    document.querySelectorAll('input[name="associated_symptoms"]:checked').forEach(cb => {
                        symptoms.push(cb.value);
                    });
                    assessmentData.associatedSymptoms = symptoms;
                    assessmentData.feverTemp = document.getElementById('fever_temp').value;
                    break;
                case 6:
                    // Triggers & Relief
                    const triggers = [];
                    document.querySelectorAll('input[name="triggers"]:checked').forEach(cb => {
                        triggers.push(cb.value);
                    });
                    assessmentData.triggers = triggers;
                    
                    const reliefMethods = [];
                    document.querySelectorAll('input[name="relief"]:checked').forEach(cb => {
                        reliefMethods.push(cb.value);
                    });
                    assessmentData.reliefMethods = reliefMethods;
                    break;
                case 7:
                    // Past history
                    assessmentData.previousSoreThroats = document.getElementById('previous_sore_throats').value;
                    assessmentData.tonsillectomy = document.getElementById('tonsillectomy').value;
                    
                    const conditions = [];
                    document.querySelectorAll('input[name="conditions"]:checked').forEach(cb => {
                        conditions.push(cb.value);
                    });
                    assessmentData.conditions = conditions;
                    assessmentData.otherConditions = document.getElementById('other_conditions').value;
                    break;
                case 8:
                    // Risk factors
                    assessmentData.exposedPerson = document.getElementById('exposed_person').value;
                    assessmentData.exposureDetails = document.getElementById('exposure_details').value;
                    
                    const riskFactors = [];
                    document.querySelectorAll('input[name="risk_factors"]:checked').forEach(cb => {
                        riskFactors.push(cb.value);
                    });
                    assessmentData.riskFactors = riskFactors;
                    break;
                case 9:
                    // Current treatment
                    const treatments = [];
                    document.querySelectorAll('input[name="treatments"]:checked').forEach(cb => {
                        treatments.push(cb.value);
                    });
                    assessmentData.treatments = treatments;
                    assessmentData.antibioticsDetails = document.getElementById('antibiotics_details').value;
                    assessmentData.treatmentEffect = document.getElementById('treatment_effect').value;
                    break;
                case 10:
                    // Additional information
                    assessmentData.additionalInfo = document.getElementById('additional_info').value;
                    assessmentData.medicationAllergies = document.getElementById('medication_allergies').value;
                    assessmentData.allergiesDetails = document.getElementById('allergies_details').value;
                    break;
            }
        }
        
        // Create human-readable labels for values
        function getReadableValue(key, value) {
            const valueLabels = {
                // Onset
                onset_type: {
                    sudden: "Sudden onset (within hours)",
                    gradual: "Gradual onset (over days)"
                },
                duration: {
                    less_than_24h: "Less than 24 hours",
                    "1_3_days": "1-3 days",
                    "4_7_days": "4-7 days",
                    "1_2_weeks": "1-2 weeks",
                    more_than_2_weeks: "More than 2 weeks"
                },
                episode_type: {
                    first: "First episode",
                    recurrent: "Recurrent episode"
                },
                // Pain characteristics
                pain_type: {
                    burning: "Burning",
                    raw: "Raw/Scratchy",
                    sharp: "Sharp/Stabbing",
                    dull: "Dull/Achy",
                    foreign_body: "Foreign body sensation"
                },
                pain_location: {
                    one_side: "One side only",
                    both_sides: "Both sides",
                    front: "Front of throat",
                    back: "Back of throat"
                },
                // Past history
                previous_sore_throats: {
                    none: "Rare occurrence",
                    occasional: "Occasional (2-3 per year)",
                    frequent: "Frequent (4+ per year)"
                },
                tonsillectomy: {
                    yes: "Yes",
                    no: "No",
                    unknown: "Unknown"
                },
                // Risk factors
                exposed_person: {
                    yes: "Yes",
                    no: "No",
                    unknown: "Not sure"
                },
                // Current treatment
                treatment_effect: {
                    helped: "Helped significantly",
                    some_help: "Helped somewhat",
                    no_help: "No improvement",
                    worse: "Symptoms are worse",
                    not_applicable: "Not applicable (haven't tried treatments)"
                },
                // Additional information
                medication_allergies: {
                    no_allergies: "No known medication allergies",
                    yes_allergies: "Yes"
                }
            };
            
            if (valueLabels[key] && valueLabels[key][value]) {
                return valueLabels[key][value];
            }
            
            return value;
        }
        
        // Populate summary screen
        function populateSummary() {
            const summaryContent = document.getElementById('summaryContent');
            let summaryHTML = '';
            
            // Alarm Features
            summaryHTML += '<div class="summary-section">';
            summaryHTML += '<h3>Critical Symptoms</h3>';
            if (assessmentData.alarmFeatures && assessmentData.alarmFeatures.includes('none_alarm')) {
                summaryHTML += '<div class="summary-item"><span class="summary-label">Critical symptoms:</span> None reported</div>';
            } else if (assessmentData.alarmFeatures && assessmentData.alarmFeatures.length > 0) {
                summaryHTML += '<div class="summary-item"><span class="summary-label">Critical symptoms:</span> ' + 
                    assessmentData.alarmFeatures.map(feature => {
                        const label = document.querySelector(`label[for="${feature}"]`);
                        return label ? label.textContent : feature;
                    }).join(', ') + '</div>';
            }
            summaryHTML += '</div>';
            
            // Onset
            summaryHTML += '<div class="summary-section">';
            summaryHTML += '<h3>Symptom Onset & Duration</h3>';
            if (assessmentData.onsetType) {
                summaryHTML += '<div class="summary-item"><span class="summary-label">Onset:</span> ' + 
                    getReadableValue('onset_type', assessmentData.onsetType) + '</div>';
            }
            if (assessmentData.duration) {
                summaryHTML += '<div class="summary-item"><span class="summary-label">Duration:</span> ' + 
                    getReadableValue('duration', assessmentData.duration) + '</div>';
            }
            if (assessmentData.episodeType) {
                summaryHTML += '<div class="summary-item"><span class="summary-label">Episode type:</span> ' + 
                    getReadableValue('episode_type', assessmentData.episodeType) + '</div>';
            }
            summaryHTML += '</div>';
            
            // Pain characteristics
            summaryHTML += '<div class="summary-section">';
            summaryHTML += '<h3>Pain Characteristics</h3>';
            if (assessmentData.painType) {
                summaryHTML += '<div class="summary-item"><span class="summary-label">Pain type:</span> ' + 
                    getReadableValue('pain_type', assessmentData.painType) + '</div>';
            }
            if (assessmentData.painLocation) {
                summaryHTML += '<div class="summary-item"><span class="summary-label">Pain location:</span> ' + 
                    getReadableValue('pain_location', assessmentData.painLocation) + '</div>';
            }
            if (assessmentData.painSeverity) {
                summaryHTML += '<div class="summary-item"><span class="summary-label">Pain severity:</span> ' + 
                    assessmentData.painSeverity + '/10</div>';
            }
            summaryHTML += '</div>';
            
            // Associated symptoms
            summaryHTML += '<div class="summary-section">';
            summaryHTML += '<h3>Associated Symptoms</h3>';
            if (assessmentData.associatedSymptoms && assessmentData.associatedSymptoms.includes('none_associated')) {
                summaryHTML += '<div class="summary-item">No associated symptoms reported</div>';
            } else if (assessmentData.associatedSymptoms && assessmentData.associatedSymptoms.length > 0) {
                summaryHTML += '<div class="summary-item">' + 
                    assessmentData.associatedSymptoms.map(symptom => {
                        if (symptom === 'fever' && assessmentData.feverTemp) {
                            return 'Fever (' + assessmentData.feverTemp + ')';
                        }
                        const label = document.querySelector(`label[for="${symptom}"]`);
                        return label ? label.textContent : symptom;
                    }).join(', ') + '</div>';
            }
            summaryHTML += '</div>';
            
            // Triggers & Relief
            summaryHTML += '<div class="summary-section">';
            summaryHTML += '<h3>Triggers & Relief</h3>';
            if (assessmentData.triggers && assessmentData.triggers.length > 0) {
                summaryHTML += '<div class="summary-item"><span class="summary-label">Triggers:</span> ' + 
                    assessmentData.triggers.map(trigger => {
                        const label = document.querySelector(`label[for="trigger_${trigger}"]`);
                        return label ? label.textContent : trigger;
                    }).join(', ') + '</div>';
            }
            if (assessmentData.reliefMethods && assessmentData.reliefMethods.length > 0) {
                summaryHTML += '<div class="summary-item"><span class="summary-label">Relief:</span> ' + 
                    assessmentData.reliefMethods.map(method => {
                        const label = document.querySelector(`label[for="relief_${method}"]`);
                        return label ? label.textContent : method;
                    }).join(', ') + '</div>';
            }
            summaryHTML += '</div>';
            
            // Past history
            summaryHTML += '<div class="summary-section">';
            summaryHTML += '<h3>Past History</h3>';
            if (assessmentData.previousSoreThroats) {
                summaryHTML += '<div class="summary-item"><span class="summary-label">Previous sore throats:</span> ' + 
                    getReadableValue('previous_sore_throats', assessmentData.previousSoreThroats) + '</div>';
            }
            if (assessmentData.tonsillectomy) {
                summaryHTML += '<div class="summary-item"><span class="summary-label">Tonsillectomy:</span> ' + 
                    getReadableValue('tonsillectomy', assessmentData.tonsillectomy) + '</div>';
            }
            if (assessmentData.conditions && assessmentData.conditions.length > 0) {
                if (assessmentData.conditions.includes('none')) {
                    summaryHTML += '<div class="summary-item"><span class="summary-label">Medical conditions:</span> None</div>';
                } else {
                    let conditionsText = assessmentData.conditions.map(condition => {
                        const label = document.querySelector(`label[for="condition_${condition}"]`);
                        return label ? label.textContent : condition;
                    }).join(', ');
                    
                    if (assessmentData.conditions.includes('other') && assessmentData.otherConditions) {
                        conditionsText = conditionsText.replace('Other condition', 'Other: ' + assessmentData.otherConditions);
                    }
                    summaryHTML += '<div class="summary-item"><span class="summary-label">Medical conditions:</span> ' + 
                        conditionsText + '</div>';
                }
            }
            summaryHTML += '</div>';
            
            // Risk factors
            summaryHTML += '<div class="summary-section">';
            summaryHTML += '<h3>Exposure & Risk Factors</h3>';
            if (assessmentData.exposedPerson) {
                let exposedText = getReadableValue('exposed_person', assessmentData.exposedPerson);
                if (assessmentData.exposedPerson === 'yes' && assessmentData.exposureDetails) {
                    exposedText += ' - ' + assessmentData.exposureDetails;
                }
                summaryHTML += '<div class="summary-item"><span class="summary-label">Exposure to illness:</span> ' + 
                    exposedText + '</div>';
            }
            if (assessmentData.riskFactors && assessmentData.riskFactors.length > 0) {
                if (assessmentData.riskFactors.includes('none')) {
                    summaryHTML += '<div class="summary-item"><span class="summary-label">Risk factors:</span> None</div>';
                } else {
                    summaryHTML += '<div class="summary-item"><span class="summary-label">Risk factors:</span> ' + 
                        assessmentData.riskFactors.map(factor => {
                            const label = document.querySelector(`label[for="risk_${factor}"]`);
                            return label ? label.textContent : factor;
                        }).join(', ') + '</div>';
                }
            }
            summaryHTML += '</div>';
            
            // Current treatment
            summaryHTML += '<div class="summary-section">';
            summaryHTML += '<h3>Current Treatment</h3>';
            if (assessmentData.treatments && assessmentData.treatments.length > 0) {
                let treatmentsText = assessmentData.treatments.map(treatment => {
                    const label = document.querySelector(`label[for="treatment_${treatment}"]`);
                    return label ? label.textContent : treatment;
                }).join(', ');
                
                if (assessmentData.treatments.includes('antibiotics') && assessmentData.antibioticsDetails) {
                    treatmentsText = treatmentsText.replace('Antibiotics', 'Antibiotics (' + assessmentData.antibioticsDetails + ')');
                }
                summaryHTML += '<div class="summary-item"><span class="summary-label">Treatments tried:</span> ' + 
                    treatmentsText + '</div>';
            }
            if (assessmentData.treatmentEffect) {
                summaryHTML += '<div class="summary-item"><span class="summary-label">Treatment effect:</span> ' + 
                    getReadableValue('treatment_effect', assessmentData.treatmentEffect) + '</div>';
            }
            summaryHTML += '</div>';
            
            // Additional information
            summaryHTML += '<div class="summary-section">';
            summaryHTML += '<h3>Additional Information</h3>';
            if (assessmentData.medicationAllergies) {
                let allergiesText = getReadableValue('medication_allergies', assessmentData.medicationAllergies);
                if (assessmentData.medicationAllergies === 'yes_allergies' && assessmentData.allergiesDetails) {
                    allergiesText += ': ' + assessmentData.allergiesDetails;
                }
                summaryHTML += '<div class="summary-item"><span class="summary-label">Medication allergies:</span> ' + 
                    allergiesText + '</div>';
            }
            if (assessmentData.additionalInfo) {
                summaryHTML += '<div class="summary-item"><span class="summary-label">Additional notes:</span><br>' + 
                    assessmentData.additionalInfo + '</div>';
            }
            summaryHTML += '</div>';
            
            summaryContent.innerHTML = summaryHTML;
        }
        
        // Function to copy results to clipboard
        function copyResults() {
            const summaryContent = document.getElementById('summaryContent').innerText;
            
            // Create a formatted text version
            const formattedSummary = "SORE THROAT ASSESSMENT\n" + 
                "=======================\n\n" + 
                summaryContent.replace(/\n\n/g, '\n');
            
            navigator.clipboard.writeText(formattedSummary).then(() => {
                // Show notification
                const notification = document.getElementById('notification');
                notification.classList.add('show');
                
                // Hide notification after 2 seconds
                setTimeout(() => {
                    notification.classList.remove('show');
                }, 2000);
            });
        }
    </script>
</body>
</html>