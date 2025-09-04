import { WizardStep } from '../types/assessment'

export const wizardSteps: WizardStep[] = [
  {
    id: 'welcome',
    title: 'Welcome & Company Information',
    subtitle: 'Tell us about your cultivation operation',
    sections: [
      {
        id: 'basic-info',
        title: 'Basic Information',
        description: 'Help us understand your business foundation',
        progress: 0,
        questions: [
          {
            id: 'facility_documentation',
            type: 'file',
            label: 'Facility Documentation',
            tooltip: 'Upload any relevant facility blueprints, permits, or certifications.',
            required: false
          },
          {
            id: 'company_name',
            type: 'text',
            label: 'Company Name',
            placeholder: 'Enter your company name',
            required: true,
            disableContext: true
          },
          {
            id: 'stakeholder_email',
            type: 'email',
            label: 'Email Address',
            placeholder: 'your.email@company.com',
            required: true,
            disableContext: true
          },
          {
            id: 'role',
            type: 'select',
            label: 'Your Role',
            options: ['Owner/Founder', 'Operations Manager', 'Master Grower', 'Compliance Officer', 'Investor', 'Other'],
            required: true,
            disableContext: true
          },
          {
            id: 'facility_location',
            type: 'multiselect',
            label: 'Facility Location',
            options: [
              'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 
              'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 
              'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 
              'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 
              'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 
              'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 
              'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming', 'Washington DC', 'Puerto Rico', 'Other'
            ],
            required: true,
            disableContext: true
          },
          {
            id: 'years_operation',
            type: 'slider',
            label: 'Years in Operation',
            min: 0,
            max: 15,
            step: 1,
            tooltip: 'How many years has your facility been operational?',
            required: true
          },
          {
            id: 'business_model',
            type: 'multiselect',
            label: 'Primary Business Model',
            options: ['Cultivation Only', 'Vertically Integrated', 'Contract Growing', 'R&D/Breeding'],
            required: true
          }
        ]
      }
    ]
  },
  {
    id: 'infrastructure',
    title: 'Facility Infrastructure Design',
    subtitle: 'Details about your facility layout and construction',
    sections: [
      {
        id: 'layout-design',
        title: 'Facility Layout & Design',
        description: 'Tell us about your physical facility setup',
        progress: 15,
        questions: [
          {
            id: 'total_square_footage',
            type: 'slider',
            label: 'Total Facility Square Footage',
            min: 500,
            max: 50000,
            step: 500
          },
          {
            id: 'canopy_square_footage',
            type: 'slider',
            label: 'Licensed Canopy Square Footage',
            min: 100,
            max: 30000,
            step: 100
          },
          {
            id: 'ceiling_height',
            type: 'slider',
            label: 'Average Ceiling Height (feet)',
            min: 8,
            max: 25,
            step: 1,
            tooltip: 'Higher ceilings allow for better air circulation and larger plant canopies'
          },
          {
            id: 'num_rooms',
            type: 'slider',
            label: 'How many rooms are in your facility?',
            min: 1,
            max: 20,
            step: 1,
            tooltip: 'Specify the total number of distinct cultivation or processing rooms.',
            required: true
          },
          {
            id: 'layout_context',
            type: 'textarea',
            label: 'Unique Layout Considerations',
            placeholder: 'Describe any unique aspects of your facility layout or design challenges...'
          }
        ]
      },
      {
        id: 'contamination-control',
        title: 'Contamination Control',
        description: 'Your contamination prevention infrastructure',
        progress: 20,
        questions: [
          {
            id: 'contamination_controls',
            type: 'multiselect',
            label: 'Contamination Control Features',
            options: ['Airlocks', 'Positive Pressure Rooms', 'Separate HVAC Zones', 'Staff Protocols', 'UV Sterilization', 'HEPA Filtration']
          },
          {
            id: 'clean_dirty_separation',
            type: 'radio',
            label: 'Clean/Dirty Area Separation',
            options: ['Clearly Defined', 'Somewhat Defined', 'Minimal Separation', 'No Formal Separation']
          },
          {
            id: 'contamination_challenges',
            type: 'textarea',
            label: 'Contamination Challenges',
            placeholder: 'What specific contamination challenges have you faced?'
          }
        ]
      }
    ]
  },
  {
    id: 'environmental',
    title: 'Environmental Systems',
    subtitle: 'Climate control and environmental management',
    sections: [
      {
        id: 'lighting-systems',
        title: 'Lighting Systems',
        description: 'Your lighting setup and automation',
        progress: 30,
        questions: [
          {
            id: 'lighting_type',
            type: 'radio',
            label: 'Primary Lighting Type',
            options: ['LED Full Spectrum', 'LED + HPS Hybrid', 'HPS Only', 'CMH/LEC', 'Other']
          },
          {
            id: 'watts_per_sqft',
            type: 'slider',
            label: 'Watts per Square Foot',
            min: 25,
            max: 60,
            step: 5
          },
          {
            id: 'automation_level',
            type: 'slider',
            label: 'Lighting Automation Level',
            min: 1,
            max: 10,
            step: 1,
            tooltip: '1 = Manual timers, 10 = Fully automated with sensors'
          },
          {
            id: 'lighting_challenges',
            type: 'textarea',
            label: 'Lighting Challenges',
            placeholder: 'What lighting challenges have you encountered?'
          }
        ]
      },
      {
        id: 'hvac-climate',
        title: 'HVAC & Climate Control',
        description: 'Environmental control systems and targets',
        progress: 35,
        questions: [
          {
            id: 'hvac_type',
            type: 'select',
            label: 'HVAC System Type',
            options: ['Central Air Handling Units', 'Mini-Split Systems', 'Package Units', 'Custom/Hybrid']
          },
          {
            id: 'temp_range_veg',
            type: 'text',
            label: 'Vegetation Temperature Range (°F)',
            placeholder: 'e.g., 75-80'
          },
          {
            id: 'temp_range_flower',
            type: 'text',
            label: 'Flowering Temperature Range (°F)',
            placeholder: 'e.g., 65-75'
          },
          {
            id: 'humidity_control',
            type: 'radio',
            label: 'Humidity Control Method',
            options: ['Dehumidifiers Only', 'Humidifiers + Dehumidifiers', 'HVAC Integrated', 'Minimal Control']
          },
          {
            id: 'environmental_challenges',
            type: 'textarea',
            label: 'Environmental Control Challenges',
            placeholder: 'Describe your biggest environmental control challenges'
          }
        ]
      }
    ]
  },
  {
    id: 'operations',
    title: 'Operations & Scheduling',
    subtitle: 'Growing cycles and operational workflows',
    sections: [
      {
        id: 'growing-cycles',
        title: 'Growing Cycles',
        description: 'Your cultivation scheduling and cycle management',
        progress: 45,
        questions: [
          {
            id: 'veg_cycle_length',
            type: 'slider',
            label: 'Vegetation Cycle Length (weeks)',
            min: 2,
            max: 12,
            step: 1
          },
          {
            id: 'flower_cycle_length',
            type: 'slider',
            label: 'Flowering Cycle Length (weeks)',
            min: 6,
            max: 14,
            step: 1
          },
          {
            id: 'harvests_per_year',
            type: 'slider',
            label: 'Harvests per Year',
            min: 2,
            max: 8,
            step: 1
          },
          {
            id: 'staggering_strategy',
            type: 'radio',
            label: 'Harvest Staggering Strategy',
            options: ['Weekly Stagger', 'Bi-weekly Stagger', 'Monthly Stagger', 'Seasonal Batches']
          },
          {
            id: 'harvest_optimization',
            type: 'textarea',
            label: 'Harvest Consistency Optimization',
            placeholder: 'How do you optimize harvest consistency and timing?'
          }
        ]
      },
      {
        id: 'sanitation',
        title: 'Sanitation Protocols',
        description: 'Cleaning and sanitation procedures',
        progress: 50,
        questions: [
          {
            id: 'cleaning_frequency',
            type: 'multiselect',
            label: 'Daily Cleaning Tasks',
            options: ['Floor Mopping', 'Equipment Sanitization', 'Air Filter Changes', 'Waste Removal', 'Tool Sterilization']
          },
          {
            id: 'sanitization_products',
            type: 'multiselect',
            label: 'Sanitization Products Used',
            options: ['Hydrogen Peroxide', 'Isopropyl Alcohol', 'Quaternary Ammonium', 'Bleach Solutions', 'Ozone', 'UV-C Light']
          },
          {
            id: 'sanitation_challenges',
            type: 'textarea',
            label: 'Sanitation Challenges',
            placeholder: 'What sanitation challenges are most costly or time-consuming?'
          }
        ]
      }
    ]
  },
  {
    id: 'quality-compliance',
    title: 'Quality & Compliance',
    subtitle: 'Quality control and regulatory compliance',
    sections: [
      {
        id: 'contamination-prevention',
        title: 'Contamination Prevention',
        description: 'Your strategies for preventing contamination',
        progress: 60,
        questions: [
          {
            id: 'primary_contamination_risks',
            type: 'multiselect',
            label: 'Primary Contamination Risks',
            options: ['Powdery Mildew', 'Botrytis/Bud Rot', 'Spider Mites', 'Aphids', 'Thrips', 'Bacterial Infections', 'Cross-contamination']
          },
          {
            id: 'ipm_strategies',
            type: 'multiselect',
            label: 'IPM Strategies Used',
            options: ['Beneficial Insects', 'Organic Sprays', 'UV Treatment', 'Quarantine Procedures', 'Regular Monitoring', 'Environmental Controls']
          },
          {
            id: 'monitoring_technology',
            type: 'multiselect',
            label: 'Monitoring Technology',
            options: ['Environmental Sensors', 'Security Cameras', 'Automated Alerts', 'Lab Testing', 'Visual Inspections Only']
          },
          {
            id: 'prevention_strategies',
            type: 'textarea',
            label: 'Most Effective Prevention Strategies',
            placeholder: 'Describe your most effective contamination prevention strategies'
          }
        ]
      },
      {
        id: 'financial-impact',
        title: 'Financial Impact Assessment',
        description: 'Understanding the cost of quality issues',
        progress: 65,
        questions: [
          {
            id: 'loss_percentage',
            type: 'text',
            label: 'Average Crop Loss Percentage',
            tooltip: 'What percentage of crops are typically lost to contamination or quality issues?',
            validation: {
              pattern: '^(?:[0-9]|[1-4][0-9]|50)(?:\\.\\d{1,2})?$',
              message: 'Please enter a number between 0 and 50, with up to two decimal places.'
            }
          },
          {
            id: 'major_loss_sources',
            type: 'multiselect',
            label: 'Major Sources of Loss',
            options: ['Contamination', 'Environmental Issues', 'Pest Problems', 'Equipment Failure', 'Human Error', 'Compliance Issues']
          },
          {
            id: 'unexpected_losses',
            type: 'textarea',
            label: 'Unexpected Loss Sources',
            placeholder: "What's your biggest source of unexpected losses?"
          }
        ]
      }
    ]
  },
  {
    id: 'financial-performance',
    title: 'Financial Performance & Benchmarks',
    subtitle: 'Key metrics and financial performance',
    sections: [
      {
        id: 'kpis',
        title: 'Key Performance Indicators',
        description: 'Your facility performance metrics',
        progress: 75,
        questions: [
          {
            id: 'financial_documentation',
            type: 'file',
            label: 'Financials Documentation',
            tooltip: 'Upload any relevant financial statements or cost analyses.',
            required: false
          },
          {
            id: 'yield_per_sqft',
            type: 'slider',
            label: 'Yield per Square Foot (grams)',
            min: 10,
            max: 80,
            step: 5
          },
          {
            id: 'yield_per_watt',
            type: 'slider',
            label: 'Yield per Watt (grams)',
            min: 0.5,
            max: 3.0,
            step: 0.1
          },
          {
            id: 'cost_per_gram',
            type: 'slider',
            label: 'Production Cost per Gram ($)',
            min: 0.50,
            max: 5.00,
            step: 0.25
          },
          {
            id: 'tracking_improvements',
            type: 'textarea',
            label: 'KPI Tracking Improvements',
            placeholder: 'What KPIs do you wish you tracked better?'
          }
        ]
      },
      {
        id: 'remediation-economics',
        title: 'Remediation Economics',
        description: 'Cost analysis of remediation vs prevention',
        progress: 80,
        questions: [
          {
            id: 'remediation_methods',
            type: 'multiselect',
            label: 'Remediation Methods Used',
            options: ['Disposal/Destruction', 'Extraction Processing', 'Washing/Treatment', 'Partial Salvage', 'Full Loss Write-off']
          },
          {
            id: 'remediation_cost_impact',
            type: 'slider',
            label: 'Remediation Cost Impact (%)',
            min: 1,
            max: 50,
            step: 1,
            tooltip: 'What percentage of your costs go to remediation vs prevention?'
          },
          {
            id: 'pricing_strategy_impact',
            type: 'textarea',
            label: 'Pricing Strategy Impact',
            placeholder: 'How has remediation impacted your pricing strategy?'
          }
        ]
      }
    ]
  },
  {
    id: 'technology',
    title: 'Technology Stack',
    subtitle: 'Software and technology infrastructure',
    sections: [
      {
        id: 'compliance-software',
        title: 'Compliance Software',
        description: 'Your compliance and tracking systems',
        progress: 90,
        questions: [
          {
            id: 'compliance_platform',
            type: 'select',
            label: 'Primary Compliance Platform',
            options: ['METRC', 'LeafData', 'BioTrackTHC', 'Trakkit', 'CCTT', 'Other', 'None']
          },
          {
            id: 'integration_complexity',
            type: 'slider',
            label: 'Integration Complexity Rating',
            min: 1,
            max: 10,
            step: 1,
            tooltip: '1 = Very simple, 10 = Extremely complex'
          },
          {
            id: 'compliance_satisfaction',
            type: 'slider',
            label: 'Software Satisfaction Rating',
            min: 1,
            max: 10,
            step: 1
          },
          {
            id: 'missing_features',
            type: 'textarea',
            label: 'Missing Software Features',
            placeholder: 'What compliance software features are missing from current solutions?'
          }
        ]
      },
      {
        id: 'operational-software',
        title: 'Operational Software',
        description: 'ERP and operational management systems',
        progress: 95,
        questions: [
          {
            id: 'erp_platform',
            type: 'select',
            label: 'ERP/Operations Platform',
            options: ['Cannabis-specific ERP', 'Custom Solution', 'Excel/Spreadsheets', 'QuickBooks', 'Other', 'None']
          },
          {
            id: 'operational_inefficiencies',
            type: 'textarea',
            label: 'Operational Inefficiencies',
            placeholder: 'What operational inefficiencies could software solve?'
          }
        ]
      }
    ]
  },
  {
    id: 'review',
    title: 'Review & Submit',
    subtitle: 'Review your responses and submit the assessment',
    sections: [
      {
        id: 'final-review',
        title: 'Final Review',
        description: 'Confirm your responses and complete the assessment',
        progress: 100,
        questions: [
          {
            id: 'additional_comments',
            type: 'textarea',
            label: 'Additional Comments',
            placeholder: 'Any additional insights or comments about your cultivation operation?'
          },
          {
            id: 'follow_up_consent',
            type: 'checkbox',
            label: 'Communication Preferences',
            options: ['I consent to follow-up communications', 'I would like to receive industry insights', 'I\'m interested in consultation services']
          }
        ]
      }
    ]
  }
]