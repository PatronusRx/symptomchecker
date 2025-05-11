import { useState } from 'react';
import { ChevronLeft, ChevronRight, AlertCircle, Copy, Check, Heart, Clock, List, FileText, Home } from 'lucide-react';

export default function SyncopeTrackerApp() {
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [completed, setCompleted] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Screen content based on current state
  const screenContent = {
    welcome: (
      <div className="flex flex-col items-center justify-center space-y-6 p-4 text-center">
        <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center">
          <Heart size={48} className="text-blue-600" />
        </div>
        <h1 className="text-2xl font-bold">Syncope Symptom Tracker</h1>
        <p className="text-gray-600">Track your fainting episodes to share with your healthcare provider</p>
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start text-left">
          <AlertCircle size={24} className="text-yellow-500 mr-2 flex-shrink-0 mt-1" />
          <p className="text-sm">If you're experiencing chest pain, difficulty breathing, or severe headache, call emergency services (911) immediately.</p>
        </div>
        <button 
          onClick={() => setCurrentScreen('episode-timing')} 
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center"
        >
          Start Tracking
          <ChevronRight size={20} className="ml-2" />
        </button>
      </div>
    ),
    
    'episode-timing': (
      <div className="flex flex-col h-full">
        <div className="bg-blue-600 py-4 px-4 text-white">
          <h2 className="text-xl font-semibold">Episode Timing</h2>
          <div className="w-full bg-blue-400 h-2 rounded-full mt-2">
            <div className="bg-white h-2 rounded-full" style={{ width: "10%" }}></div>
          </div>
        </div>
        <div className="flex-grow p-4 space-y-6">
          <div className="space-y-2">
            <label className="font-medium block">When did this episode occur?</label>
            <input type="datetime-local" className="w-full p-3 border border-gray-300 rounded-lg" />
          </div>
          
          <div className="space-y-2">
            <label className="font-medium block">How long were you unconscious?</label>
            <select className="w-full p-3 border border-gray-300 rounded-lg bg-white">
              <option value="">Select duration</option>
              <option>A few seconds</option>
              <option>Less than 1 minute</option>
              <option>1-5 minutes</option>
              <option>More than 5 minutes</option>
              <option>I'm not sure</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="font-medium block">Is this your first fainting episode?</label>
            <div className="grid grid-cols-2 gap-3">
              <button className="p-3 border border-gray-300 rounded-lg">Yes</button>
              <button 
                className="p-3 bg-blue-600 text-white rounded-lg"
                onClick={() => setCurrentScreen('episode-frequency')}
              >No</button>
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t flex justify-between">
          <button 
            onClick={() => setCurrentScreen('welcome')} 
            className="flex items-center text-blue-600"
          >
            <ChevronLeft size={20} className="mr-1" />
            Back
          </button>
          <button 
            onClick={() => setCurrentScreen('alarm-features')} 
            className="bg-blue-600 text-white py-2 px-4 rounded-lg font-medium flex items-center"
          >
            Next
            <ChevronRight size={20} className="ml-1" />
          </button>
        </div>
      </div>
    ),
    
    'episode-frequency': (
      <div className="flex flex-col h-full">
        <div className="bg-blue-600 py-4 px-4 text-white">
          <h2 className="text-xl font-semibold">Previous Episodes</h2>
          <div className="w-full bg-blue-400 h-2 rounded-full mt-2">
            <div className="bg-white h-2 rounded-full" style={{ width: "15%" }}></div>
          </div>
        </div>
        <div className="flex-grow p-4 space-y-6">
          <div className="space-y-2">
            <label className="font-medium block">How many episodes have you had in the past year?</label>
            <select className="w-full p-3 border border-gray-300 rounded-lg bg-white">
              <option value="">Select frequency</option>
              <option>1-2 episodes</option>
              <option>3-5 episodes</option>
              <option>6-10 episodes</option>
              <option>More than 10 episodes</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="font-medium block">Do your episodes follow a pattern?</label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input type="checkbox" className="h-5 w-5 mr-2" />
                Time of day (morning, evening)
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="h-5 w-5 mr-2" />
                After meals
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="h-5 w-5 mr-2" />
                During/after exercise
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="h-5 w-5 mr-2" />
                Related to medication timing
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="h-5 w-5 mr-2" />
                No clear pattern
              </label>
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t flex justify-between">
          <button 
            onClick={() => setCurrentScreen('episode-timing')} 
            className="flex items-center text-blue-600"
          >
            <ChevronLeft size={20} className="mr-1" />
            Back
          </button>
          <button 
            onClick={() => setCurrentScreen('alarm-features')} 
            className="bg-blue-600 text-white py-2 px-4 rounded-lg font-medium flex items-center"
          >
            Next
            <ChevronRight size={20} className="ml-1" />
          </button>
        </div>
      </div>
    ),
    
    'alarm-features': (
      <div className="flex flex-col h-full">
        <div className="bg-red-600 py-4 px-4 text-white">
          <h2 className="text-xl font-semibold">Important Risk Features</h2>
          <div className="w-full bg-red-400 h-2 rounded-full mt-2">
            <div className="bg-white h-2 rounded-full" style={{ width: "20%" }}></div>
          </div>
        </div>
        <div className="flex-grow p-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <div className="flex items-center mb-2">
              <AlertCircle size={20} className="text-red-500 mr-2" />
              <p className="font-semibold">Please check any that apply</p>
            </div>
            <p className="text-sm text-red-800">These symptoms may indicate a more serious condition that requires prompt medical attention.</p>
          </div>
          
          <div className="space-y-2">
            <label className="flex items-center p-2 border border-gray-200 rounded-lg">
              <input type="checkbox" className="h-5 w-5 mr-2" />
              Fainted during physical exercise
            </label>
            
            <label className="flex items-center p-2 border border-gray-200 rounded-lg">
              <input type="checkbox" className="h-5 w-5 mr-2" />
              Fainted while lying down
            </label>
            
            <label className="flex items-center p-2 border border-gray-200 rounded-lg">
              <input type="checkbox" className="h-5 w-5 mr-2" />
              Chest pain before or after fainting
            </label>
            
            <label className="flex items-center p-2 border border-gray-200 rounded-lg">
              <input type="checkbox" className="h-5 w-5 mr-2" />
              Heart racing or palpitations before fainting
            </label>
            
            <label className="flex items-center p-2 border border-gray-200 rounded-lg">
              <input type="checkbox" className="h-5 w-5 mr-2" />
              Family history of sudden death under age 50
            </label>
            
            <label className="flex items-center p-2 border border-gray-200 rounded-lg">
              <input type="checkbox" className="h-5 w-5 mr-2" />
              Known heart disease or heart problems
            </label>
            
            <label className="flex items-center p-2 border border-gray-200 rounded-lg">
              <input type="checkbox" className="h-5 w-5 mr-2" />
              Severe headache with fainting
            </label>
            
            <label className="flex items-center p-2 border border-gray-200 rounded-lg">
              <input type="checkbox" className="h-5 w-5 mr-2" />
              Seizure-like activity (jerking movements)
            </label>
          </div>
        </div>
        
        <div className="p-4 border-t flex justify-between">
          <button 
            onClick={() => setCurrentScreen('episode-timing')} 
            className="flex items-center text-blue-600"
          >
            <ChevronLeft size={20} className="mr-1" />
            Back
          </button>
          <button 
            onClick={() => setCurrentScreen('triggers')} 
            className="bg-blue-600 text-white py-2 px-4 rounded-lg font-medium flex items-center"
          >
            Next
            <ChevronRight size={20} className="ml-1" />
          </button>
        </div>
      </div>
    ),
    
    'triggers': (
      <div className="flex flex-col h-full">
        <div className="bg-blue-600 py-4 px-4 text-white">
          <h2 className="text-xl font-semibold">What Triggered Your Episode?</h2>
          <div className="w-full bg-blue-400 h-2 rounded-full mt-2">
            <div className="bg-white h-2 rounded-full" style={{ width: "35%" }}></div>
          </div>
        </div>
        <div className="flex-grow p-4 space-y-4 overflow-auto">
          <p className="text-gray-600">Select any factors that may have triggered this episode:</p>
          
          <div className="space-y-1">
            <h3 className="font-medium">Position/Movement</h3>
            <div className="grid grid-cols-2 gap-2">
              <label className="flex items-center p-2 border border-gray-200 rounded-lg text-sm">
                <input type="checkbox" className="h-4 w-4 mr-2" />
                Standing up quickly
              </label>
              <label className="flex items-center p-2 border border-gray-200 rounded-lg text-sm">
                <input type="checkbox" className="h-4 w-4 mr-2" />
                Standing for long time
              </label>
              <label className="flex items-center p-2 border border-gray-200 rounded-lg text-sm">
                <input type="checkbox" className="h-4 w-4 mr-2" />
                Getting out of bed
              </label>
              <label className="flex items-center p-2 border border-gray-200 rounded-lg text-sm">
                <input type="checkbox" className="h-4 w-4 mr-2" />
                During exercise
              </label>
              <label className="flex items-center p-2 border border-gray-200 rounded-lg text-sm">
                <input type="checkbox" className="h-4 w-4 mr-2" />
                After exercise
              </label>
              <label className="flex items-center p-2 border border-gray-200 rounded-lg text-sm">
                <input type="checkbox" className="h-4 w-4 mr-2" />
                Turning head/neck
              </label>
            </div>
          </div>
          
          <div className="space-y-1">
            <h3 className="font-medium">Environment</h3>
            <div className="grid grid-cols-2 gap-2">
              <label className="flex items-center p-2 border border-gray-200 rounded-lg text-sm">
                <input type="checkbox" className="h-4 w-4 mr-2" />
                Hot environment
              </label>
              <label className="flex items-center p-2 border border-gray-200 rounded-lg text-sm">
                <input type="checkbox" className="h-4 w-4 mr-2" />
                Crowded space
              </label>
              <label className="flex items-center p-2 border border-gray-200 rounded-lg text-sm">
                <input type="checkbox" className="h-4 w-4 mr-2" />
                Poor ventilation
              </label>
            </div>
          </div>
          
          <div className="space-y-1">
            <h3 className="font-medium">Activities</h3>
            <div className="grid grid-cols-2 gap-2">
              <label className="flex items-center p-2 border border-gray-200 rounded-lg text-sm">
                <input type="checkbox" className="h-4 w-4 mr-2" />
                Urination
              </label>
              <label className="flex items-center p-2 border border-gray-200 rounded-lg text-sm">
                <input type="checkbox" className="h-4 w-4 mr-2" />
                Bowel movement
              </label>
              <label className="flex items-center p-2 border border-gray-200 rounded-lg text-sm">
                <input type="checkbox" className="h-4 w-4 mr-2" />
                Coughing
              </label>
              <label className="flex items-center p-2 border border-gray-200 rounded-lg text-sm">
                <input type="checkbox" className="h-4 w-4 mr-2" />
                Swallowing
              </label>
              <label className="flex items-center p-2 border border-gray-200 rounded-lg text-sm">
                <input type="checkbox" className="h-4 w-4 mr-2" />
                During stress
              </label>
              <label className="flex items-center p-2 border border-gray-200 rounded-lg text-sm">
                <input type="checkbox" className="h-4 w-4 mr-2" />
                After stress
              </label>
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t flex justify-between">
          <button 
            onClick={() => setCurrentScreen('alarm-features')} 
            className="flex items-center text-blue-600"
          >
            <ChevronLeft size={20} className="mr-1" />
            Back
          </button>
          <button 
            onClick={() => setCurrentScreen('symptoms-before')} 
            className="bg-blue-600 text-white py-2 px-4 rounded-lg font-medium flex items-center"
          >
            Next
            <ChevronRight size={20} className="ml-1" />
          </button>
        </div>
      </div>
    ),
    
    'symptoms-before': (
      <div className="flex flex-col h-full">
        <div className="bg-blue-600 py-4 px-4 text-white">
          <h2 className="text-xl font-semibold">Symptoms Before Fainting</h2>
          <div className="w-full bg-blue-400 h-2 rounded-full mt-2">
            <div className="bg-white h-2 rounded-full" style={{ width: "50%" }}></div>
          </div>
        </div>
        <div className="flex-grow p-4 space-y-4 overflow-auto">
          <p className="text-gray-600">Did you experience any of these symptoms before fainting?</p>
          
          <div className="space-y-2">
            <label className="flex items-center p-2 border border-gray-200 rounded-lg">
              <input type="checkbox" className="h-5 w-5 mr-2" />
              Lightheadedness or dizziness
            </label>
            
            <label className="flex items-center p-2 border border-gray-200 rounded-lg">
              <input type="checkbox" className="h-5 w-5 mr-2" />
              Room spinning (vertigo)
            </label>
            
            <label className="flex items-center p-2 border border-gray-200 rounded-lg">
              <input type="checkbox" className="h-5 w-5 mr-2" />
              Vision changes (blurring, tunnel vision)
            </label>
            
            <label className="flex items-center p-2 border border-gray-200 rounded-lg">
              <input type="checkbox" className="h-5 w-5 mr-2" />
              Nausea
            </label>
            
            <label className="flex items-center p-2 border border-gray-200 rounded-lg">
              <input type="checkbox" className="h-5 w-5 mr-2" />
              Sweating
            </label>
            
            <label className="flex items-center p-2 border border-gray-200 rounded-lg">
              <input type="checkbox" className="h-5 w-5 mr-2" />
              Paleness
            </label>
            
            <label className="flex items-center p-2 border border-gray-200 rounded-lg">
              <input type="checkbox" className="h-5 w-5 mr-2" />
              Feeling warm
            </label>
            
            <label className="flex items-center p-2 border border-gray-200 rounded-lg">
              <input type="checkbox" className="h-5 w-5 mr-2" />
              Heart racing or palpitations
            </label>
            
            <label className="flex items-center p-2 border border-gray-200 rounded-lg">
              <input type="checkbox" className="h-5 w-5 mr-2" />
              No warning symptoms at all
            </label>
          </div>
        </div>
        
        <div className="p-4 border-t flex justify-between">
          <button 
            onClick={() => setCurrentScreen('triggers')} 
            className="flex items-center text-blue-600"
          >
            <ChevronLeft size={20} className="mr-1" />
            Back
          </button>
          <button 
            onClick={() => setCurrentScreen('symptoms-during')} 
            className="bg-blue-600 text-white py-2 px-4 rounded-lg font-medium flex items-center"
          >
            Next
            <ChevronRight size={20} className="ml-1" />
          </button>
        </div>
      </div>
    ),
    
    'symptoms-during': (
      <div className="flex flex-col h-full">
        <div className="bg-blue-600 py-4 px-4 text-white">
          <h2 className="text-xl font-semibold">During & After Fainting</h2>
          <div className="w-full bg-blue-400 h-2 rounded-full mt-2">
            <div className="bg-white h-2 rounded-full" style={{ width: "65%" }}></div>
          </div>
        </div>
        <div className="flex-grow p-4 space-y-4 overflow-auto">
          <p className="text-gray-600">Select what happened during or after your episode:</p>
          
          <div className="space-y-1">
            <h3 className="font-medium">During Episode</h3>
            <div className="space-y-2">
              <label className="flex items-center p-2 border border-gray-200 rounded-lg text-sm">
                <input type="checkbox" className="h-4 w-4 mr-2" />
                Complete loss of consciousness
              </label>
              <label className="flex items-center p-2 border border-gray-200 rounded-lg text-sm">
                <input type="checkbox" className="h-4 w-4 mr-2" />
                Partial consciousness
              </label>
              <label className="flex items-center p-2 border border-gray-200 rounded-lg text-sm">
                <input type="checkbox" className="h-4 w-4 mr-2" />
                Jerking movements
              </label>
              <label className="flex items-center p-2 border border-gray-200 rounded-lg text-sm">
                <input type="checkbox" className="h-4 w-4 mr-2" />
                Bit tongue
              </label>
              <label className="flex items-center p-2 border border-gray-200 rounded-lg text-sm">
                <input type="checkbox" className="h-4 w-4 mr-2" />
                Lost bladder control
              </label>
            </div>
          </div>
          
          <div className="space-y-1">
            <h3 className="font-medium">After Episode</h3>
            <div className="space-y-2">
              <label className="flex items-center p-2 border border-gray-200 rounded-lg text-sm">
                <input type="checkbox" className="h-4 w-4 mr-2" />
                Confusion
              </label>
              <label className="flex items-center p-2 border border-gray-200 rounded-lg text-sm">
                <input type="checkbox" className="h-4 w-4 mr-2" />
                Fatigue
              </label>
              <label className="flex items-center p-2 border border-gray-200 rounded-lg text-sm">
                <input type="checkbox" className="h-4 w-4 mr-2" />
                Headache
              </label>
              <label className="flex items-center p-2 border border-gray-200 rounded-lg text-sm">
                <input type="checkbox" className="h-4 w-4 mr-2" />
                Muscle aches
              </label>
              <label className="flex items-center p-2 border border-gray-200 rounded-lg text-sm">
                <input type="checkbox" className="h-4 w-4 mr-2" />
                Nausea
              </label>
              <label className="flex items-center p-2 border border-gray-200 rounded-lg text-sm">
                <input type="checkbox" className="h-4 w-4 mr-2" />
                Long recovery (>1 hour)
              </label>
            </div>
          </div>
          
          <div className="space-y-1">
            <h3 className="font-medium">Injuries</h3>
            <div className="space-y-2">
              <label className="flex items-center p-2 border border-gray-200 rounded-lg text-sm">
                <input type="checkbox" className="h-4 w-4 mr-2" />
                Fell to ground
              </label>
              <label className="flex items-center p-2 border border-gray-200 rounded-lg text-sm">
                <input type="checkbox" className="h-4 w-4 mr-2" />
                Someone caught me
              </label>
              <label className="flex items-center p-2 border border-gray-200 rounded-lg text-sm">
                <input type="checkbox" className="h-4 w-4 mr-2" />
                Was already seated/lying down
              </label>
              <label className="flex items-center p-2 border border-gray-200 rounded-lg text-sm">
                <input type="checkbox" className="h-4 w-4 mr-2" />
                Injured during fall
              </label>
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t flex justify-between">
          <button 
            onClick={() => setCurrentScreen('symptoms-before')} 
            className="flex items-center text-blue-600"
          >
            <ChevronLeft size={20} className="mr-1" />
            Back
          </button>
          <button 
            onClick={() => setCurrentScreen('medications')} 
            className="bg-blue-600 text-white py-2 px-4 rounded-lg font-medium flex items-center"
          >
            Next
            <ChevronRight size={20} className="ml-1" />
          </button>
        </div>
      </div>
    ),
    
    'medications': (
      <div className="flex flex-col h-full">
        <div className="bg-blue-600 py-4 px-4 text-white">
          <h2 className="text-xl font-semibold">Medications</h2>
          <div className="w-full bg-blue-400 h-2 rounded-full mt-2">
            <div className="bg-white h-2 rounded-full" style={{ width: "80%" }}></div>
          </div>
        </div>
        <div className="flex-grow p-4 space-y-4 overflow-auto">
          <p className="text-gray-600">Please list any medications you're taking:</p>
          
          <div className="space-y-4">
            <div className="p-3 border border-gray-200 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">Blood Pressure Medications</h3>
                <button className="text-blue-600 text-sm">Add</button>
              </div>
              <div className="p-2 bg-gray-50 rounded flex items-center justify-between">
                <div>
                  <p className="font-medium">Lisinopril</p>
                  <p className="text-sm text-gray-500">10mg, once daily</p>
                </div>
                <button className="text-red-500 text-sm">Remove</button>
              </div>
            </div>
            
            <div className="p-3 border border-gray-200 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">Heart Medications</h3>
                <button className="text-blue-600 text-sm">Add</button>
              </div>
              <p className="text-sm text-gray-500 italic">None added</p>
            </div>
            
            <div className="p-3 border border-gray-200 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">Other Medications</h3>
                <button className="text-blue-600 text-sm">Add</button>
              </div>
              <div className="p-2 bg-gray-50 rounded flex items-center justify-between mb-2">
                <div>
                  <p className="font-medium">Atorvastatin</p>
                  <p className="text-sm text-gray-500">20mg, once daily</p>
                </div>
                <button className="text-red-500 text-sm">Remove</button>
              </div>
              <div className="p-2 bg-gray-50 rounded flex items-center justify-between">
                <div>
                  <p className="font-medium">Multivitamin</p>
                  <p className="text-sm text-gray-500">Once daily</p>
                </div>
                <button className="text-red-500 text-sm">Remove</button>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="font-medium block">Any recent medication changes?</label>
              <select className="w-full p-3 border border-gray-300 rounded-lg bg-white">
                <option value="">Select</option>
                <option>No changes</option>
                <option>New medication added</option>
                <option>Medication discontinued</option>
                <option>Dose increased</option>
                <option>Dose decreased</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t flex justify-between">
          <button 
            onClick={() => setCurrentScreen('symptoms-during')} 
            className="flex items-center text-blue-600"
          >
            <ChevronLeft size={20} className="mr-1" />
            Back
          </button>
          <button 
            onClick={() => setCurrentScreen('witness-account')} 
            className="bg-blue-600 text-white py-2 px-4 rounded-lg font-medium flex items-center"
          >
            Next
            <ChevronRight size={20} className="ml-1" />
          </button>
        </div>
      </div>
    ),
    
    'witness-account': (
      <div className="flex flex-col h-full">
        <div className="bg-blue-600 py-4 px-4 text-white">
          <h2 className="text-xl font-semibold">Witness Information</h2>
          <div className="w-full bg-blue-400 h-2 rounded-full mt-2">
            <div className="bg-white h-2 rounded-full" style={{ width: "90%" }}></div>
          </div>
        </div>
        <div className="flex-grow p-4 space-y-4 overflow-auto">
          <p className="text-gray-600">Was someone with you when you fainted?</p>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="font-medium block">Did anyone witness your episode?</label>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  className="p-3 bg-blue-600 text-white rounded-lg"
                  onClick={() => setCurrentScreen('witness-details')}
                >Yes</button>
                <button 
                  className="p-3 border border-gray-300 rounded-lg"
                  onClick={() => setCurrentScreen('summary')}
                >No</button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t flex justify-between">
          <button 
            onClick={() => setCurrentScreen('medications')} 
            className="flex items-center text-blue-600"
          >
            <ChevronLeft size={20} className="mr-1" />
            Back
          </button>
          <button 
            onClick={() => setCurrentScreen('summary')} 
            className="bg-blue-600 text-white py-2 px-4 rounded-lg font-medium flex items-center"
          >
            Next
            <ChevronRight size={20} className="ml-1" />
          </button>
        </div>
      </div>
    ),
    
    'witness-details': (
      <div className="flex flex-col h-full">
        <div className="bg-blue-600 py-4 px-4 text-white">
          <h2 className="text-xl font-semibold">Witness Observations</h2>
          <div className="w-full bg-blue-400 h-2 rounded-full mt-2">
            <div className="bg-white h-2 rounded-full" style={{ width: "95%" }}></div>
          </div>
        </div>
        <div className="flex-grow p-4 space-y-4 overflow-auto">
          <p className="text-gray-600">What did the witness observe?</p>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="font-medium block">Witness name (optional)</label>
              <input type="text" className="w-full p-3 border border-gray-300 rounded-lg" placeholder="Name" />
            </div>
            
            <div className="space-y-2">
              <label className="font-medium block">What did the witness say about:</label>
              
              <div className="p-3 border border-gray-200 rounded-lg space-y-3">
                <p className="font-medium text-sm">Your appearance</p>
                <div className="space-y-1">
                  <label className="flex items-center text-sm">
                    <input type="checkbox" className="h-4 w-4 mr-2" />
                    Pale
                  </label>
                  <label className="flex items-center text-sm">
                    <input type="checkbox" className="h-4 w-4 mr-2" />
                    Blue (cyanotic)
                  </label>
                  <label className="flex items-center text-sm">
                    <input type="checkbox" className="h-4 w-4 mr-2" />
                    Flushed/red
                  </label>
                  <label className="flex items-center text-sm">
                    <input type="checkbox" className="h-4 w-4 mr-2" />
                    Sweating
                  </label>
                </div>
              </div>
              
              <div className="p-3 border border-gray-200 rounded-lg space-y-3">
                <p className="font-medium text-sm">Your movements</p>
                <div className="space-y-1">
                  <label className="flex items-center text-sm">
                    <input type="checkbox" className="h-4 w-4 mr-2" />
                    No movements
                  </label>
                  <label className="flex items-center text-sm">
                    <input type="checkbox" className="h-4 w-4 mr-2" />
                    Stiffening
                  </label>
                  <label className="flex items-center text-sm">
                    <input type="checkbox" className="h-4 w-4 mr-2" />
                    Jerking movements
                  </label>
                  <label className="flex items-center text-sm">
                    <input type="checkbox" className="h-4 w-4 mr-2" />
                    Twitching
                  </label>
                </div>
              </div>
              
              <div className="p-3 border border-gray-200 rounded-lg space-y-3">
                <p className="font-medium text-sm">After the episode</p>
                <div className="space-y-1">
                  <label className="flex items-center text-sm">
                    <input type="checkbox" className="h-4 w-4 mr-2" />
                    Confused
                  </label>
                  <label className="flex items-center text-sm">
                    <input type="checkbox" className="h-4 w-4 mr-2" />
                    Alert
                  </label>
                  <label className="flex items-center text-sm">
                    <input type="checkbox" className="h-4 w-4 mr-2" />
                    Drowsy
                  </label>
                  <label className="flex items-center text-sm">
                    <input type="checkbox" className="h-4 w-4 mr-2" />
                    Slow to recover
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t flex justify-between">
          <button 
            onClick={() => setCurrentScreen('witness-account')} 
            className="flex items-center text-blue-600"
          >
            <ChevronLeft size={20} className="mr-1" />
            Back
          </button>
          <button 
            onClick={() => setCurrentScreen('summary')} 
            className="bg-blue-600 text-white py-2 px-4 rounded-lg font-medium flex items-center"
          >
            Next
            <ChevronRight size={20} className="ml-1" />
          </button>
        </div>
      </div>
    ),
    
    'summary': (
      <div className="flex flex-col h-full">
        <div className="bg-green-600 py-4 px-4 text-white">
          <h2 className="text-xl font-semibold">Summary</h2>
          <div className="w-full bg-green-400 h-2 rounded-full mt-2">
            <div className="bg-white h-2 rounded-full w-full"></div>
          </div>
        </div>
        <div className="flex-grow p-4 space-y-4 overflow-auto">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
            <div className="flex items-start">
              <AlertCircle size={20} className="text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold">Medical Alert</p>
                <p className="text-sm">Some of your responses indicate potential concerns that should be evaluated by a healthcare provider soon.</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 p-3 font-medium flex items-center">
                <Clock size={18} className="text-gray-600 mr-2" />
                Episode Timing
              </div>
              <div className="p-3 space-y-2 text-sm">
                <p><span className="text-gray-600">Date/Time:</span> April 20, 2025, 2:30 PM</p>
                <p><span className="text-gray-600">Duration:</span> Less than 1 minute</p>
                <p><span className="text-gray-600">First episode?</span> No</p>
                <p><span className="text-gray-600">Frequency:</span> 3-5 episodes in past year</p>
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-red-50 p-3 font-medium flex items-center text-red-700">
                <AlertCircle size={18} className="text-red-500 mr-2" />
                Risk Features
              </div>
              <div className="p-3 space-y-1 text-sm">
                <p>• Fainted during physical exercise</p>
                <p>• Heart racing or palpitations before fainting</p>
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 p-3 font-medium flex items-center">
                <List size={18} className="text-gray-600 mr-2" />
                Symptoms & Triggers
              </div>
              <div className="p-3 space-y-1 text-sm">
                <p>• Standing up quickly</p>
                <p>• Hot environment</p>
                <p>• Lightheadedness before fainting</p>
                <p>• Vision changes before fainting</p>
                <p>• Sweating before fainting</p>
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 p-3 font-medium flex items-center">
                <FileText size={18} className="text-gray-600 mr-2" />
                Other Information
              </div>
              <div className="p-3 space-y-1 text-sm">
                <p>• Medications: Lisinopril 10mg, Atorvastatin 20mg</p>
                <p>• Witness reported paleness and no movements</p>
                <p>• Confusion after the episode</p>
              </div>
            </div>
          </div>
          
          <div className="p-3 border border-blue-200 bg-blue-50 rounded-lg">
            <p className="text-sm">Share this information with your healthcare provider at your next appointment, or seek medical attention sooner if recommended above.</p>
          </div>
          
          <div className="flex flex-col">
            <button 
              onClick={() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
                setCompleted(true);
              }} 
              className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg p-3"
            >
              {copied ? (
                <>
                  <Check size={18} className="text-green-600 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy size={18} className="text-gray-600 mr-2" />
                  Copy to clipboard
                </>
              )}
            </button>
          </div>
        </div>
        
        <div className="p-4 border-t flex justify-between">
          <button 
            onClick={() => completed ? setCurrentScreen('welcome') : setCurrentScreen('witness-details')} 
            className="flex items-center text-blue-600"
          >
            {completed ? (
              <>
                <Home size={20} className="mr-1" />
                Start new tracker
              </>
            ) : (
              <>
                <ChevronLeft size={20} className="mr-1" />
                Back
              </>
            )}
          </button>
          {!completed && (
            <button 
              onClick={() => setCompleted(true)} 
              className="bg-green-600 text-white py-2 px-4 rounded-lg font-medium flex items-center"
            >
              Complete
              <Check size={20} className="ml-1" />
            </button>
          )}
        </div>
      </div>
    )
  };

  return (
    <div className="w-full h-full max-w-md mx-auto bg-white flex flex-col overflow-hidden shadow-lg rounded-lg border border-gray-200">
      {screenContent[currentScreen]}
    </div>
  );
}