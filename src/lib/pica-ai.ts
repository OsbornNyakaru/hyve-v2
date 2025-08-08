import axios from 'axios';

// Remove API key from client-side code for security
// const PICA_API_KEY = import.meta.env.VITE_PICA_API_KEY;
// const PICA_BASE_URL = 'https://api.pica.ai/v1';

export interface WasteAnalysis {
  wasteType: 'plastic' | 'organic' | 'electronic' | 'hazardous' | 'construction' | 'other';
  confidence: number;
  urgency: 'low' | 'medium' | 'high';
  estimatedVolume: string;
  recyclingRecommendations: string[];
  carbonImpact: number;
  disposalMethod: string;
}

export interface AutomationRule {
  id: string;
  name: string;
  trigger: 'new_report' | 'status_change' | 'high_urgency' | 'location_hotspot';
  conditions: {
    wasteType?: string[];
    urgency?: string[];
    location?: string;
  };
  actions: {
    sendEmail?: boolean;
    notifySlack?: boolean;
    createCalendarEvent?: boolean;
    generateReport?: boolean;
    escalateToAuthorities?: boolean;
  };
  isActive: boolean;
}

class PicaAI {
  // Remove API key and base URL from client-side for security
  // private apiKey: string;
  // private baseURL: string;

  constructor() {
    // this.apiKey = PICA_API_KEY || '';
    // this.baseURL = PICA_BASE_URL;
  }

  async analyzeWasteImage(imageFile: File): Promise<WasteAnalysis> {
    // Use mock analysis for development - in production, this should be handled by a backend API
    console.log('Mock waste analysis for image:', imageFile.name);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return this.mockWasteAnalysis(imageFile);
  }

  async generateAutomatedResponse(reportData: any): Promise<string> {
    // Use mock response for development
    console.log('Mock automated response generation for report:', reportData);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return this.mockAutomatedResponse(reportData);
  }

  async createAutomationWorkflow(rule: Omit<AutomationRule, 'id'>): Promise<AutomationRule> {
    // Use mock workflow creation for development
    console.log('Mock automation workflow creation:', rule);
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      ...rule,
      id: `rule_${Date.now()}`
    };
  }

  async triggerAutomation(trigger: string, data: any): Promise<void> {
    // Use mock automation trigger for development
    console.log('Mock automation trigger:', trigger, data);
    
    await new Promise(resolve => setTimeout(resolve, 200));
    
    this.handleAutomationFallback(trigger, data);
  }

  private mockWasteAnalysis(imageFile: File): WasteAnalysis {
    const wasteTypes = ['plastic', 'organic', 'electronic', 'hazardous', 'construction', 'other'] as const;
    const randomType = wasteTypes[Math.floor(Math.random() * wasteTypes.length)];
    
    return {
      wasteType: randomType,
      confidence: Math.random() * 0.3 + 0.7, // 70-100%
      urgency: randomType === 'hazardous' ? 'high' : Math.random() > 0.5 ? 'medium' : 'low',
      estimatedVolume: `${Math.floor(Math.random() * 50) + 10} kg`,
      recyclingRecommendations: [
        'Sort materials by type',
        'Clean containers before disposal',
        'Use designated recycling bins'
      ],
      carbonImpact: Math.floor(Math.random() * 20) + 5,
      disposalMethod: randomType === 'hazardous' ? 'Specialized facility required' : 'Standard waste collection'
    };
  }

  private mockAutomatedResponse(reportData: any): string {
    return `Thank you for reporting ${reportData.type} waste at ${reportData.location.address}. 
    This issue has been classified as ${reportData.urgency} priority and will be addressed within 
    ${reportData.urgency === 'high' ? '24 hours' : reportData.urgency === 'medium' ? '3 days' : '1 week'}.`;
  }

  private handleAutomationFallback(trigger: string, data: any): void {
    console.log(`Automation fallback for ${trigger}:`, data);
    // Implement local automation logic here
  }
}

export const picaAI = new PicaAI();