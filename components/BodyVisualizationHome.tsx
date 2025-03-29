import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Heart,
  Thermometer,
  Zap,
  AudioWaveform,
  BadgeAlert,
  Shield,
  Brain,
  Bone,
  Layers,
  Ear,
  Eye,
  Circle,
  Baby,
  Skull,
  PieChart,
  Activity,
  LucideIcon,
} from 'lucide-react';
import SearchBox from '@/components/SearchBox';

// Define interfaces for the data structure
interface SymptomResult {
  system: string;
  symptom: string;
}

interface SymptomData {
  [symptom: string]: string[]; // symptom name -> related conditions
}

interface MedicalData {
  [system: string]: SymptomData; // system name -> symptoms
}

interface SearchResults {
  systems: string[];
  symptoms: SymptomResult[];
}

interface SystemColorStyle {
  bg: string;
  border: string;
  hover: string;
}

// --- Other interfaces (RegionStyle, SystemArea, SidePanel, HumanBodySVGProps) ---
// (Keep these as they were)
interface RegionStyle {
  fillOpacity: number;
  hoverFillOpacity: number;
  fill: string;
  stroke: string;
}

interface SystemArea {
  id: string;
  shape: 'circle' | 'rect' | 'multiple';
  coords?: {
    cx?: number;
    cy?: number;
    r?: number;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
  };
  paths?: string[];
  text: {
    x: number;
    y: number;
    label: string;
    rotate?: boolean;
  };
  icon: {
    x: number;
    y: number;
  };
}

interface SidePanel {
  id: string;
  x: number;
  y: number;
  label: string[];
}

interface HumanBodySVGProps {
  onSystemClick: (system: string) => void;
  renderSystemIcon: (
    system: string,
    size?: number,
    color?: string
  ) => React.ReactNode;
}

// Map system names to their corresponding icons
const systemIcons: Record<string, LucideIcon> = {
  'General/Constitutional': Thermometer,
  'Pain-Related': Zap,
  Respiratory: AudioWaveform,
  Cardiovascular: Heart,
  Gastrointestinal: Activity,
  Genitourinary: Activity,
  Neurological: Brain,
  'Musculoskeletal/Trauma': Bone,
  'Skin/Soft Tissue': Layers,
  Allergic: BadgeAlert,
  Immunologic: Shield,
  ENT: Ear,
  Eye: Eye,
  Psychiatric: Brain,
  'Endocrine/Metabolic': PieChart,
  'Toxicologic/Environmental': Skull,
  'Infectious Disease': Circle,
  'Obstetric/Gynecologic': Baby,
};

type ViewState = 'body' | 'system' | 'symptom' | 'search';

export default function BodyVisualizationHome() {
  const [selectedSystem, setSelectedSystem] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchResults, setSearchResults] = useState<SearchResults>({
    systems: [],
    symptoms: [],
  });
  const [view, setView] = useState<ViewState>('body');
  const [medicalData, setMedicalData] = useState<MedicalData>({});
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  // Fetch symptom data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/symptoms');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setMedicalData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching symptom data:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handle search functionality
  useEffect(() => {
    if (searchTerm.length >= 2 && Object.keys(medicalData).length > 0) {
      const lowerSearchTerm = searchTerm.toLowerCase();

      // Search for systems (chapters)
      const systems = Object.keys(medicalData).filter((system) =>
        system.toLowerCase().includes(lowerSearchTerm)
      );

      // Search for symptoms
      const symptoms: SymptomResult[] = [];
      Object.entries(medicalData).forEach(([system, systemSymptoms]) => {
        if (typeof systemSymptoms === 'object' && systemSymptoms !== null) {
          Object.entries(systemSymptoms).forEach(([symptom]) => {
            if (symptom.toLowerCase().includes(lowerSearchTerm)) {
              symptoms.push({ system, symptom });
            }
          });
        }
      });

      setSearchResults({ systems, symptoms });

      // Set view to search if we have results or if search term exists
      if (systems.length > 0 || symptoms.length > 0 || searchTerm.length >= 2) {
        setView('search');
      }
    } else if (searchTerm.length < 2) {
      setView('body');
      setSearchResults({ systems: [], symptoms: [] });
    }
  }, [searchTerm, medicalData]);

  // ****** START OF FIX ****** (Previous fix maintained)
  // Correctly define handleSystemClick
  const handleSystemClick = (system: string) => {
    setSelectedSystem(system);
    setView('system');
  }; // <-- Ensure this closing brace exists and is correct

  // Correctly define handleSymptomClick (now properly scoped after handleSystemClick)
  const handleSymptomClick = (symptom: string) => {
    if (typeof window !== 'undefined' && selectedSystem) {
      sessionStorage.setItem('currentSystem', selectedSystem);
      sessionStorage.setItem('currentSymptom', symptom);
    }
    const slugifiedSymptom = symptom
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-');
    router.push(`/symptoms/${slugifiedSymptom}`);
  }; // <-- Ensure this closing brace exists and is correct

  // Correctly define handleBackClick (now properly scoped after handleSymptomClick)
  const handleBackClick = () => {
    // NO duplicate definition inside
    if (view === 'system' || view === 'symptom') {
      // Group conditions that lead back to a previous step
      // If coming back from symptom view, go to system view
      if (view === 'symptom') {
        setView('system');
        // Keep selectedSystem as is
      }
      // If coming back from system view OR search view, go to body view
      else {
        // view === 'system'
        setView('body');
        setSelectedSystem(null);
        setSearchTerm(''); // Clear search term when going back to body
        setSearchResults({ systems: [], symptoms: [] }); // Clear results
      }
    } else if (view === 'search') {
      // Specifically handle back from search
      setView('body');
      setSelectedSystem(null);
      setSearchTerm(''); // Clear search term
      setSearchResults({ systems: [], symptoms: [] }); // Clear results
    }
    // If view is 'body', clicking back does nothing (or could have other logic)
  }; // <-- Ensure this closing brace exists and is correct

  // Correctly define getSystemColor (now properly scoped after handleBackClick)
  const getSystemColor = (system: string): SystemColorStyle => {
    const colorMap: Record<string, SystemColorStyle> = {
      'General/Constitutional': {
        bg: '#e0f7fa',
        border: '#00bcd4',
        hover: 'hover:bg-cyan-100',
      },
      'Pain-Related': {
        bg: '#ffebee',
        border: '#f44336',
        hover: 'hover:bg-red-100',
      },
      Respiratory: {
        bg: '#e8f5e9',
        border: '#4caf50',
        hover: 'hover:bg-green-100',
      },
      Cardiovascular: {
        bg: '#ffebee',
        border: '#f44336',
        hover: 'hover:bg-red-100',
      },
      Gastrointestinal: {
        bg: '#fff3e0',
        border: '#ff9800',
        hover: 'hover:bg-orange-100',
      },
      Genitourinary: {
        bg: '#e8eaf6',
        border: '#3f51b5',
        hover: 'hover:bg-indigo-100',
      },
      Neurological: {
        bg: '#e3f2fd',
        border: '#2196f3',
        hover: 'hover:bg-blue-100',
      },
      'Musculoskeletal/Trauma': {
        bg: '#efebe9',
        border: '#795548',
        hover: 'hover:bg-amber-50',
      },
      'Skin/Soft Tissue': {
        bg: '#f3e5f5',
        border: '#9c27b0',
        hover: 'hover:bg-purple-100',
      },
      Allergic: {
        bg: '#f1f8e9',
        border: '#8bc34a',
        hover: 'hover:bg-lime-100',
      },
      Immunologic: {
        bg: '#f1f8e9',
        border: '#8bc34a',
        hover: 'hover:bg-lime-100',
      },
      ENT: { bg: '#e1f5fe', border: '#03a9f4', hover: 'hover:bg-sky-100' },
      Eye: { bg: '#e1f5fe', border: '#03a9f4', hover: 'hover:bg-sky-100' },
      Psychiatric: {
        bg: '#f3e5f5',
        border: '#9c27b0',
        hover: 'hover:bg-purple-100',
      },
      'Endocrine/Metabolic': {
        bg: '#fffde7',
        border: '#ffeb3b',
        hover: 'hover:bg-yellow-100',
      },
      'Toxicologic/Environmental': {
        bg: '#eceff1',
        border: '#607d8b',
        hover: 'hover:bg-gray-100',
      },
      'Infectious Disease': {
        bg: '#fff8e1',
        border: '#ffc107',
        hover: 'hover:bg-amber-100',
      },
      'Obstetric/Gynecologic': {
        bg: '#fce4ec',
        border: '#e91e63',
        hover: 'hover:bg-pink-100',
      },
    };
    return (
      colorMap[system] || {
        bg: '#f5f5f5',
        border: '#9e9e9e',
        hover: 'hover:bg-gray-100',
      }
    );
  }; // <-- Ensure this closing brace exists and is correct

  // Correctly define renderSystemIcon (now properly scoped after getSystemColor)
  const renderSystemIcon = (system: string, size = 18, color?: string) => {
    const IconComponent = systemIcons[system];
    // Check if selectedSystem exists for border color fallback
    const fallbackColor = selectedSystem
      ? getSystemColor(selectedSystem).border
      : '#9e9e9e';
    return IconComponent ? (
      <IconComponent
        size={size}
        // Ensure color fallback works even if system is not in colorMap directly
        color={
          color ||
          (systemIcons[system] ? getSystemColor(system).border : fallbackColor)
        }
      />
    ) : null;
  }; // <-- Ensure this closing brace exists and is correct

  // ****** END OF FIX ****** (Previous fix maintained)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
            Loading medical data...
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 min-h-screen">
      <div className="container mx-auto px-4 py-6">
        {/* Header Section */}
        <div className="max-w-3xl mx-auto mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 text-center">
            Medical Symptom Checker
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 text-center">
            Identify potential causes for your symptoms by selecting a body
            system or searching
          </p>
          <div className="mb-8">
            <SearchBox
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search systems or symptoms..."
            />
          </div>
        </div>

        {/* Back Button (Conditional) */}
        {(view === 'system' || view === 'search' || view === 'symptom') && (
          <div className="max-w-4xl mx-auto mb-4">
            <button
              onClick={handleBackClick}
              className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              {/* Icon can be added here if desired */}← Back
            </button>
          </div>
        )}

        {/* Main Content Area */}
        <div className="max-w-6xl mx-auto">
          {/* Body View */}
          {view === 'body' && (
            <div className="flex flex-col items-center">
              <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">
                Select a body system
              </h2>
              <div className="w-full max-w-md mb-8">
                {/* Ensure HumanBodySVG component is defined or imported correctly */}
                <HumanBodySVG
                  onSystemClick={handleSystemClick}
                  renderSystemIcon={renderSystemIcon}
                />
              </div>
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-5xl">
                {Object.keys(medicalData).map((system) => {
                  const { border, hover } = getSystemColor(system);
                  return (
                    <button
                      key={system}
                      className={`bg-white dark:bg-gray-800 p-4 rounded-lg shadow hover:shadow-md transition-shadow border-l-4 ${hover} flex items-center text-left dark:border-gray-700`}
                      style={{ borderColor: border }}
                      onClick={() => handleSystemClick(system)}
                    >
                      <div className="mr-3 flex-shrink-0">
                        {renderSystemIcon(system, 22)}
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-medium text-gray-800 dark:text-gray-200">
                          {system}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {Object.keys(medicalData[system] || {}).length}{' '}
                          symptoms
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Search View */}
          {view === 'search' && (
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
                Search Results for &quot;{searchTerm}&quot;
              </h2>
              {searchResults.systems.length === 0 &&
              searchResults.symptoms.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">
                    No systems or symptoms found matching &quot;{searchTerm}
                    &quot;
                  </p>
                </div>
              ) : (
                <>
                  {searchResults.systems.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-xl font-medium mb-4 text-gray-700 dark:text-gray-300 border-b pb-2 dark:border-gray-700">
                        Matching Body Systems
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {searchResults.systems.map((system) => {
                          const { border, hover } = getSystemColor(system);
                          return (
                            <button
                              key={system}
                              className={`bg-white dark:bg-gray-800 p-4 rounded-lg shadow hover:shadow-md transition-shadow border-l-4 ${hover} flex items-center text-left dark:border-gray-700`}
                              style={{ borderColor: border }}
                              onClick={() => handleSystemClick(system)}
                            >
                              <div className="mr-3 flex-shrink-0">
                                {renderSystemIcon(system, 20)}
                              </div>
                              <div className="flex-grow">
                                <h4 className="font-medium text-gray-800 dark:text-gray-200">
                                  {system}
                                </h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                  {
                                    Object.keys(medicalData[system] || {})
                                      .length
                                  }{' '}
                                  symptoms
                                </p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  {searchResults.symptoms.length > 0 && (
                    <div>
                      <h3 className="text-xl font-medium mb-4 text-gray-700 dark:text-gray-300 border-b pb-2 dark:border-gray-700">
                        Matching Symptoms
                      </h3>
                      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700">
                        {searchResults.symptoms.map(({ system, symptom }) => {
                          const { border } = getSystemColor(system);
                          return (
                            <div
                              key={`${system}-${symptom}`}
                              className="p-4 hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer transition-colors flex items-center"
                              onClick={() => {
                                setSelectedSystem(system);
                                handleSymptomClick(symptom);
                              }}
                            >
                              <div
                                className="w-1 mr-3 self-stretch rounded-full"
                                style={{ backgroundColor: border }}
                              ></div>
                              <div className="mr-4 flex-shrink-0">
                                {renderSystemIcon(system, 18)}
                              </div>
                              <div className="flex-grow">
                                <h4 className="font-medium text-gray-800 dark:text-gray-200">
                                  {symptom}
                                </h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  System: {system}
                                </p>
                              </div>
                              <div className="text-blue-500 dark:text-blue-400 ml-2">
                                →
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* System View */}
          {view === 'system' && selectedSystem && (
            <div className="max-w-4xl mx-auto">
              {/* Back button moved above content area */}
              <div className="flex items-center mb-6">
                <div className="mr-3">
                  {renderSystemIcon(selectedSystem, 28)}{' '}
                  {/* Slightly larger icon */}
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {selectedSystem} Symptoms
                </h2>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700">
                {Object.keys(medicalData[selectedSystem] || {}).length > 0 ? (
                  Object.keys(medicalData[selectedSystem])
                    .sort()
                    .map(
                      // Sort symptoms alphabetically
                      (symptom) => {
                        const { border } = getSystemColor(selectedSystem);
                        const relatedConditionsCount =
                          medicalData[selectedSystem][symptom]?.length || 0;
                        return (
                          <div
                            key={symptom}
                            className="p-4 hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer transition-colors flex items-center"
                            onClick={() => handleSymptomClick(symptom)}
                          >
                            <div
                              className="w-1 mr-3 self-stretch rounded-full"
                              style={{ backgroundColor: border }}
                            ></div>
                            <div className="flex-1">
                              <h3 className="font-medium text-gray-800 dark:text-gray-200">
                                {symptom}
                              </h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {relatedConditionsCount} related condition
                                {relatedConditionsCount !== 1 ? 's' : ''}
                              </p>
                            </div>
                            <div className="text-blue-500 dark:text-blue-400 ml-2">
                              →
                            </div>
                          </div>
                        );
                      }
                    )
                ) : (
                  <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                    No specific symptoms listed for this system.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Symptom View Placeholder (if needed, or handled by navigation) */}
          {view === 'symptom' && (
            <div className="max-w-4xl mx-auto">
              {/* Content for the symptom view would go here if not navigating away */}
              {/* Usually, you navigate away, so this might just show a loading state */}
              <p>Loading symptom details...</p>
            </div>
          )}
        </div>

        {/* Disclaimer */}
        <div className="mt-16 text-center">
          <div className="inline-block p-4 bg-blue-100 dark:bg-gray-700 text-blue-800 dark:text-blue-300 rounded-lg max-w-2xl mx-auto shadow">
            <p className="text-sm">
              <strong>Disclaimer:</strong> This tool is for informational
              purposes only and does not constitute medical advice. It is not a
              substitute for professional medical evaluation, diagnosis, or
              treatment. Always consult with a qualified healthcare provider for
              any health concerns.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} // <-- This is the final closing brace for BodyVisualizationHome

// --- HumanBodySVG Component ---
// (Keep this component as it was, it doesn't seem to have the parsing errors)
function HumanBodySVG({ onSystemClick, renderSystemIcon }: HumanBodySVGProps) {
  // Create hover state for each region
  const [hoverRegion, setHoverRegion] = useState<string | null>(null);

  const getRegionStyle = (region: string): React.CSSProperties => {
    const baseStyles: Record<string, RegionStyle> = {
      Neurological: {
        fillOpacity: 0.3,
        hoverFillOpacity: 0.6,
        fill: '#2196f3',
        stroke: '#2196f3',
      },
      Respiratory: {
        fillOpacity: 0.3,
        hoverFillOpacity: 0.6,
        fill: '#4caf50',
        stroke: '#4caf50',
      },
      Cardiovascular: {
        fillOpacity: 0.3,
        hoverFillOpacity: 0.6,
        fill: '#f44336',
        stroke: '#f44336',
      },
      Gastrointestinal: {
        fillOpacity: 0.3,
        hoverFillOpacity: 0.6,
        fill: '#ff9800',
        stroke: '#ff9800',
      },
      Genitourinary: {
        fillOpacity: 0.3,
        hoverFillOpacity: 0.6,
        fill: '#3f51b5',
        stroke: '#3f51b5',
      },
      'Musculoskeletal/Trauma': {
        fillOpacity: 0.3,
        hoverFillOpacity: 0.6,
        fill: '#795548',
        stroke: '#795548',
      },
      'Skin/Soft Tissue': {
        fillOpacity: 0.3,
        hoverFillOpacity: 0.6,
        fill: '#9c27b0',
        stroke: '#9c27b0',
      },
      ENT: {
        fillOpacity: 0.3,
        hoverFillOpacity: 0.6,
        fill: '#03a9f4',
        stroke: '#03a9f4',
      },
      Eye: {
        fillOpacity: 0.3,
        hoverFillOpacity: 0.6,
        fill: '#03a9f4',
        stroke: '#03a9f4',
      },
    };
    const style = baseStyles[region] || {
      fillOpacity: 0.3,
      hoverFillOpacity: 0.6,
      fill: '#9e9e9e',
      stroke: '#9e9e9e',
    };
    const isHovered = hoverRegion === region;
    return {
      fillOpacity: isHovered ? style.hoverFillOpacity : style.fillOpacity,
      fill: style.fill,
      stroke: style.stroke,
      strokeWidth: 1,
      cursor: 'pointer',
      transition: 'fill-opacity 0.2s ease',
    };
  };

  // Clickable areas for systems
  const systemAreas: SystemArea[] = [
    {
      id: 'Neurological',
      shape: 'circle',
      coords: { cx: 200, cy: 47, r: 40 },
      text: { x: 200, y: 47, label: 'Brain' },
      icon: { x: 175, y: 47 },
    },
    {
      id: 'Respiratory',
      shape: 'rect',
      coords: { x: 160, y: 105, width: 80, height: 65 },
      text: { x: 200, y: 138, label: 'Lungs' },
      icon: { x: 175, y: 125 },
    },
    {
      id: 'Cardiovascular',
      shape: 'circle',
      coords: { cx: 200, cy: 120, r: 20 },
      text: { x: 200, y: 120, label: 'Heart' },
      icon: { x: 200, y: 120 },
    },
    {
      id: 'Gastrointestinal',
      shape: 'rect',
      coords: { x: 175, y: 175, width: 50, height: 60 },
      text: { x: 200, y: 205, label: 'Digestive' },
      icon: { x: 185, y: 205 },
    },
    {
      id: 'Genitourinary',
      shape: 'rect',
      coords: { x: 180, y: 240, width: 40, height: 35 },
      text: { x: 200, y: 255, label: 'GU' },
      icon: { x: 185, y: 255 },
    },
    {
      id: 'Musculoskeletal/Trauma',
      shape: 'multiple',
      paths: [
        'M160,95 L140,95 L140,200 L160,200 Z',
        'M240,95 L260,95 L260,200 L240,200 Z',
        'M180,275 L160,350 L180,350 L200,275 Z',
        'M220,275 L240,350 L220,350 L200,275 Z',
      ],
      text: { x: 150, y: 145, label: 'MSK' },
      icon: { x: 150, y: 125 },
    },
    {
      id: 'Skin/Soft Tissue',
      shape: 'rect',
      coords: { x: 125, y: 95, width: 15, height: 140 },
      text: { x: 132, y: 165, label: 'Skin', rotate: true },
      icon: { x: 132, y: 135 },
    },
    {
      id: 'ENT',
      shape: 'circle',
      coords: { cx: 160, cy: 35, r: 12 },
      text: { x: 160, y: 35, label: 'ENT' },
      icon: { x: 160, y: 35 },
    },
    {
      id: 'Eye',
      shape: 'circle',
      coords: { cx: 220, cy: 35, r: 12 },
      text: { x: 220, y: 35, label: 'Eye' },
      icon: { x: 220, y: 35 },
    },
  ];

  // Side panels configuration with icons
  const sidePanels: SidePanel[] = [
    {
      id: 'General/Constitutional',
      x: 20,
      y: 30,
      label: ['General', 'Constitutional'],
    },
    { id: 'Allergic', x: 310, y: 30, label: ['Allergic'] },
    { id: 'Pain-Related', x: 20, y: 90, label: ['Pain-Related'] },
    { id: 'Immunologic', x: 310, y: 90, label: ['Immunologic'] },
    {
      id: 'Endocrine/Metabolic',
      x: 20,
      y: 150,
      label: ['Endocrine', 'Metabolic'],
    },
    { id: 'Psychiatric', x: 310, y: 150, label: ['Psychiatric'] },
    {
      id: 'Infectious Disease',
      x: 20,
      y: 210,
      label: ['Infectious', 'Disease'],
    },
    {
      id: 'Toxicologic/Environmental',
      x: 310,
      y: 210,
      label: ['Toxicologic', 'Environmental'],
    },
    { id: 'Obstetric/Gynecologic', x: 310, y: 270, label: ['OB/GYN'] },
  ];

  return (
    <div className="relative">
      <div
        className="relative mx-auto"
        style={{ width: '400px', height: '500px' }}
      >
        <svg
          viewBox="0 0 400 500"
          style={{ position: 'absolute', width: '100%', height: '100%' }}
        >
          {/* Anatomical Diagram Image */}
          <image
            href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACAAQMAAAD58POIAAAABlBMVEUAAAD///+l2Z/dAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEcklEQVRIx32VTYtUVxSAn3PuuVW37tTtTJuO0+1IfpCQyWIWQZhZ6CKQZcBsQ0Y3rkSIuNGVi+y6yfgHbJBAEPyBIBLHRYwgJhhxYVzELAJZZoht30233a567923cN1ypsZqF+d+vOe959xzzvuCYXDiUBDqvUtuT6OWkx9vuL/oe2BzMYrDVe0c++Avc/Fqz+0UYBo88o+hDrWEu/7NbvE6BXAHqcGR3ZsAc3/l990G2Cy/IYCWP5oLT8HcRV7sBmBztQDt/d10KQRzJ5ZXU/8PYF+4nQOt5UqjAOafTbybAPuJ2gUwn/OsUwDz5/p/AZbLDgbIw8P+BrCPHfsAzJOuAZT1u1oG8/Dg1QDsvgMTEB7jdAkM2/v5GsyrR7eA/egdmAF5RpcA3cYpT2YgvNzfAoYPxwBkwZcbYO4Z3QbzMnc3gUFXAlCCf2CAfcWzBpi7lQKYR+MRYJiWBeCKugLm9YJfB4abwwZgkRc+mMdF7mcwXK34AugcTQHy+LMAc+fYS2DercxGYLi+VgAz+jTAfDc9C+bFhV4BDDslAaQDXwWYJz0DzOvDrFUAeVh2BdCpvhTAvJ7xCmCudx3QfP7wJZgH1f0C6BQ/AWCQNwFDLi1bYF5etwUwTJ8VQKpeCnCHEKFo4Y/NRwXQaT8FoHl3KvSlsIeJTpvY3NN9WQDD5e8FECm9UQCdOSRCvgB4rfouAYaLv1QBcEfdAvOLu34K5ud2XwGGpX/KADO6+Slo9u0E1JcHpwKjm/8AML8xBsxjIUaFQzp7CzRv/VoBINdoAZg7OoaoKXbWKY8C82JXqwr8/J8ZmK9sBHMnTWF/Dqv31O0xMC/21KoAq36VAebeTi4Bc/8EB3NEuFHtA/Nsbw3QvJh2YF4MoYvXX5FKUXNbcgxo3vtDAeT3xoE5wwY45IGW3jOAebN7vQLYvW2AeXsLmD2ZlEWKn/Xm0mGg+exWAdTXDxnMmbgBJ8mV9MCwdbFVAG0ufATmidYG8w1RsClmj9FuaUBz5+UK4KTe3ACzlrDtJGUkVHQRdE+VqAD67skRmCtF4lxcCwC1JPbpwWfAYNusC9A76QBCz+aQJ8GS4OaXbBXotH9TASRj9T6Y54kNyZpMisScTmZLQHP+aAXQbpXGwaWY2V0MlZJgdFBfHYPmbHMQ0PTaNTBfMRaLpTYKjiGOumAYd4yqAlKD1hGYN1Tk9kSj4iK2kdjYfhOo38kqANs6PQ7mbZFgC4pWXHRQwbLOXAGG0x8OMKxXYDY2TpDFKjuZKI6F2CbGW0CnYfMKYNNAJ8G8kDKWYpGZjFb0OBnHJNCZOjKoADbWww6Ys8oKaIklplnJFCurFVC/emYwCcq7DfPAZ3U1XjXKCodJC9qC6aJ+fnJQAQLUug7mC2lNVapxmqTFqqwm3wSaS/UBLMtHt8GcqR6nRmWLKllVWm2fB5qfniwmyb7QAzC3bI2fQvXrKh1+MZkpgE5tbyoAVjh1E9rnY/sX8sTuhsQxQSYAAAAASUVORK5CYII="
            x="145"
            y="0"
            width="110"
            height="400"
          />

          {/* Clickable areas for body systems */}
          {systemAreas.map((area) => {
            // Circle rendering
            if (
              area.shape === 'circle' &&
              area.coords?.cx &&
              area.coords?.cy &&
              area.coords?.r
            ) {
              return (
                <g
                  key={area.id}
                  className="cursor-pointer"
                  onClick={() => onSystemClick(area.id)}
                  onMouseEnter={() => setHoverRegion(area.id)}
                  onMouseLeave={() => setHoverRegion(null)}
                >
                  <circle
                    cx={area.coords.cx}
                    cy={area.coords.cy}
                    r={area.coords.r}
                    style={getRegionStyle(area.id)}
                  />
                  <foreignObject
                    x={area.icon.x}
                    y={area.icon.y - 8}
                    width="16"
                    height="16"
                    className="pointer-events-none"
                  >
                    <div className="h-full w-full flex items-center justify-center">
                      {renderSystemIcon(area.id, 16, '#fff')}
                    </div>
                  </foreignObject>
                  <text
                    x={area.text.x}
                    y={area.text.y + 10}
                    textAnchor="middle"
                    alignmentBaseline="middle"
                    fontSize="10"
                    fill="#fff"
                    fontWeight="600"
                    className="select-none pointer-events-none"
                  >
                    {area.text.label}
                  </text>
                </g>
              );
            }
            // Rect rendering
            else if (
              area.shape === 'rect' &&
              area.coords?.x !== undefined &&
              area.coords?.y !== undefined &&
              area.coords?.width !== undefined &&
              area.coords?.height !== undefined
            ) {
              return (
                <g
                  key={area.id}
                  className="cursor-pointer"
                  onClick={() => onSystemClick(area.id)}
                  onMouseEnter={() => setHoverRegion(area.id)}
                  onMouseLeave={() => setHoverRegion(null)}
                >
                  <rect
                    x={area.coords.x}
                    y={area.coords.y}
                    width={area.coords.width}
                    height={area.coords.height}
                    style={getRegionStyle(area.id)}
                  />
                  <foreignObject
                    x={area.icon.x}
                    y={area.icon.y - 8}
                    width="16"
                    height="16"
                    className="pointer-events-none"
                  >
                    <div className="h-full w-full flex items-center justify-center">
                      {renderSystemIcon(area.id, 16, '#fff')}
                    </div>
                  </foreignObject>
                  {area.text.rotate ? (
                    <text
                      x={area.text.x}
                      y={area.text.y}
                      textAnchor="middle"
                      alignmentBaseline="middle"
                      fontSize="10"
                      fill="#fff"
                      fontWeight="600"
                      className="select-none pointer-events-none"
                      transform={`rotate(90,${area.text.x},${area.text.y})`}
                    >
                      {area.text.label}
                    </text>
                  ) : (
                    <text
                      x={area.text.x}
                      y={area.text.y + 10}
                      textAnchor="middle"
                      alignmentBaseline="middle"
                      fontSize="10"
                      fill="#fff"
                      fontWeight="600"
                      className="select-none pointer-events-none"
                    >
                      {area.text.label}
                    </text>
                  )}
                </g>
              );
            }
            // Multiple path rendering
            else if (area.shape === 'multiple' && area.paths) {
              return (
                <g
                  key={area.id}
                  className="cursor-pointer"
                  onClick={() => onSystemClick(area.id)}
                  onMouseEnter={() => setHoverRegion(area.id)}
                  onMouseLeave={() => setHoverRegion(null)}
                >
                  {area.paths.map((path, index) => (
                    <path
                      key={index}
                      d={path}
                      style={getRegionStyle(area.id)}
                    />
                  ))}
                  <foreignObject
                    x={area.icon.x}
                    y={area.icon.y - 8}
                    width="16"
                    height="16"
                    className="pointer-events-none"
                  >
                    <div className="h-full w-full flex items-center justify-center">
                      {renderSystemIcon(area.id, 16, '#fff')}
                    </div>
                  </foreignObject>
                  <text
                    x={area.text.x}
                    y={area.text.y + 10}
                    textAnchor="middle"
                    alignmentBaseline="middle"
                    fontSize="10"
                    fill="#fff"
                    fontWeight="600"
                    className="select-none pointer-events-none"
                  >
                    {area.text.label}
                  </text>
                </g>
              );
            }
            return null;
          })}

          {/* Side panel buttons with icons */}
          {sidePanels.map((panel) => {
            const isHovered = hoverRegion === panel.id;
            const style = {
              fill: isHovered ? '#f0f0f0' : '#ffffff', // Lighter gray on hover
              stroke: '#cccccc',
              strokeWidth: 1,
              cursor: 'pointer',
              filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.15))',
              transition: 'fill 0.2s ease',
            };
            return (
              <g
                key={panel.id}
                onClick={() => onSystemClick(panel.id)}
                onMouseEnter={() => setHoverRegion(panel.id)}
                onMouseLeave={() => setHoverRegion(null)}
              >
                <rect
                  x={panel.x}
                  y={panel.y}
                  width="70"
                  height="40"
                  rx="3"
                  ry="3"
                  style={style}
                />
                <foreignObject
                  x={panel.x + 5}
                  y={panel.y + (panel.label.length === 1 ? 12 : 5)}
                  width="16"
                  height="16"
                  className="pointer-events-none"
                >
                  <div className="h-full w-full flex items-center justify-center">
                    {renderSystemIcon(panel.id, 16)}
                  </div>
                </foreignObject>
                {panel.label.map((line, lineIndex) => (
                  <text
                    key={lineIndex}
                    x={panel.x + 42}
                    y={
                      panel.y +
                      (panel.label.length === 1 ? 25 : 15 + lineIndex * 18)
                    }
                    textAnchor="middle"
                    fontSize="8"
                    fill="#333"
                    fontWeight="600"
                    className="select-none pointer-events-none"
                  >
                    {line}
                  </text>
                ))}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
