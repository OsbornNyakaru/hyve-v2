import axios from 'axios';

// Remove the API key from client-side code for security
// const PICAOS_BASE_URL = 'https://app.picaos.com/api/v1';
// const PICAOS_API_KEY = import.meta.env.VITE_PICA_API_KEY;

export interface PicaOSWorkflow {
  id: string;
  name: string;
  trigger: string;
  status: 'active' | 'paused' | 'error';
  lastRun?: string;
  totalRuns: number;
}

export interface WasteClassification {
  type: 'plastic' | 'organic' | 'electronic' | 'hazardous' | 'construction' | 'other';
  confidence: number;
  subCategory: string;
  recyclable: boolean;
  carbonValue: number;
  disposalMethod: string;
  urgency: 'low' | 'medium' | 'high';
  estimatedWeight: number;
  recommendations: string[];
}

export interface CarbonCredit {
  id: string;
  amount: number;
  source: 'waste_report' | 'recycling' | 'cleanup' | 'verification';
  status: 'pending' | 'verified' | 'redeemed';
  metadata: {
    reportId?: string;
    wasteType?: string;
    weight?: number;
    location?: string;
  };
  createdAt: string;
  verifiedAt?: string;
  redeemedAt?: string;
}

export interface HotspotPrediction {
  id: string;
  location: {
    coordinates: [number, number];
    address: string;
  };
  wasteType: string;
  probability: number;
  predictedDate: string;
  severity: 'low' | 'medium' | 'high';
  factors: string[];
}

export interface EmailConnection {
  id: string;
  email: string;
  provider: 'gmail' | 'outlook' | 'other';
  status: 'connected' | 'disconnected' | 'error';
  permissions: string[];
  connectedAt: string;
}

class PicaOSClient {
  // Remove API key and base URL from client-side for security
  // private apiKey: string;
  // private baseURL: string;

  constructor() {
    // this.apiKey = PICAOS_API_KEY || '';
    // this.baseURL = PICAOS_BASE_URL;
  }

  // Mock implementation for development - in production, these should be handled by a backend API
  private async makeRequest(endpoint: string, options: any = {}): Promise<any> {
    // For development, return mock data instead of making actual API calls
    console.log(`Mock PicaOS API call to ${endpoint}`, options);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return appropriate mock data based on endpoint
    switch (endpoint) {
      case '/classify/waste':
        return this.getMockWasteClassification();
      case '/carbon/generate':
        return this.getMockCarbonCredit();
      case '/carbon/user/':
        return this.getMockCarbonCredits();
      case '/predictions/hotspots':
        return this.getMockHotspots();
      case '/workflows':
        return this.getMockWorkflows();
      case '/integrations/email/connect':
        return this.getMockEmailConnection();
      case '/notifications/send':
      case '/workflows/trigger':
        return { success: true, message: 'Mock response' };
      default:
        return { success: true, message: 'Mock response' };
    }
  }

  private getMockWasteClassification(): WasteClassification {
    const types: Array<'plastic' | 'organic' | 'electronic' | 'hazardous' | 'construction' | 'other'> = [
      'plastic', 'organic', 'electronic', 'hazardous', 'construction', 'other'
    ];
    const randomType = types[Math.floor(Math.random() * types.length)];
    
    return {
      type: randomType,
      confidence: 0.85 + Math.random() * 0.15,
      subCategory: `${randomType}_waste`,
      recyclable: randomType === 'plastic' || randomType === 'electronic',
      carbonValue: Math.floor(Math.random() * 50) + 10,
      disposalMethod: randomType === 'hazardous' ? 'special_collection' : 'standard_pickup',
      urgency: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low',
      estimatedWeight: Math.floor(Math.random() * 20) + 1,
      recommendations: [
        'Separate recyclable materials',
        'Use appropriate disposal containers',
        'Follow local waste management guidelines'
      ]
    };
  }

  private getMockCarbonCredit(): CarbonCredit {
    return {
      id: `credit_${Date.now()}`,
      amount: Math.floor(Math.random() * 100) + 10,
      source: 'waste_report',
      status: 'verified',
      metadata: {
        reportId: `report_${Date.now()}`,
        wasteType: 'plastic',
        weight: Math.floor(Math.random() * 20) + 1,
        location: 'Nairobi, Kenya'
      },
      createdAt: new Date().toISOString(),
      verifiedAt: new Date().toISOString()
    };
  }

  private getMockCarbonCredits(): CarbonCredit[] {
    return Array.from({ length: 5 }, (_, i) => ({
      id: `credit_${i + 1}`,
      amount: Math.floor(Math.random() * 100) + 10,
      source: ['waste_report', 'recycling', 'cleanup', 'verification'][Math.floor(Math.random() * 4)] as any,
      status: ['pending', 'verified', 'redeemed'][Math.floor(Math.random() * 3)] as any,
      metadata: {
        reportId: `report_${i + 1}`,
        wasteType: 'plastic',
        weight: Math.floor(Math.random() * 20) + 1,
        location: 'Nairobi, Kenya'
      },
      createdAt: new Date(Date.now() - i * 86400000).toISOString(),
      verifiedAt: i % 2 === 0 ? new Date(Date.now() - i * 86400000).toISOString() : undefined
    }));
  }

  private getMockHotspots(): HotspotPrediction[] {
    return Array.from({ length: 3 }, (_, i) => ({
      id: `hotspot_${i + 1}`,
      location: {
        coordinates: [-1.2921 + (Math.random() - 0.5) * 0.1, 36.8219 + (Math.random() - 0.5) * 0.1] as [number, number],
        address: `Location ${i + 1}, Nairobi`
      },
      wasteType: ['plastic', 'organic', 'electronic'][Math.floor(Math.random() * 3)],
      probability: 0.6 + Math.random() * 0.4,
      predictedDate: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      severity: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as any,
      factors: ['high_traffic', 'commercial_area', 'poor_waste_management']
    }));
  }

  private getMockWorkflows(): PicaOSWorkflow[] {
    return [
      {
        id: 'workflow_1',
        name: 'Automatic Waste Classification',
        trigger: 'new_report',
        status: 'active',
        lastRun: new Date().toISOString(),
        totalRuns: 45
      },
      {
        id: 'workflow_2',
        name: 'Carbon Credit Generation',
        trigger: 'verified_report',
        status: 'active',
        lastRun: new Date(Date.now() - 3600000).toISOString(),
        totalRuns: 23
      },
      {
        id: 'workflow_3',
        name: 'Hotspot Prediction',
        trigger: 'daily',
        status: 'active',
        lastRun: new Date(Date.now() - 86400000).toISOString(),
        totalRuns: 7
      }
    ];
  }

  private getMockEmailConnection(): EmailConnection {
    return {
      id: `email_${Date.now()}`,
      email: 'user@example.com',
      provider: 'gmail',
      status: 'connected',
      permissions: ['read', 'send'],
      connectedAt: new Date().toISOString()
    };
  }

  // Waste Classification
  async classifyWaste(imageFile: File, location?: [number, number]): Promise<WasteClassification> {
    const formData = new FormData();
    formData.append('image', imageFile);
    if (location) {
      formData.append('latitude', location[0].toString());
      formData.append('longitude', location[1].toString());
    }

    return this.makeRequest('/classify/waste', {
      method: 'POST',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }) as Promise<WasteClassification>;
  }

  // Carbon Credit Management
  async generateCarbonCredits(reportId: string, wasteData: any): Promise<CarbonCredit> {
    return this.makeRequest('/carbon/generate', {
      method: 'POST',
      data: {
        reportId,
        wasteType: wasteData.type,
        weight: wasteData.estimatedWeight,
        location: wasteData.location,
        verified: true
      }
    }) as Promise<CarbonCredit>;
  }

  async getCarbonCredits(userId: string): Promise<CarbonCredit[]> {
    return this.makeRequest(`/carbon/user/${userId}`) as Promise<CarbonCredit[]>;
  }

  async redeemCredits(userId: string, amount: number, method: 'cash' | 'donation' | 'marketplace'): Promise<any> {
    return this.makeRequest('/carbon/redeem', {
      method: 'POST',
      data: { userId, amount, method }
    }) as Promise<any>;
  }

  // Hotspot Predictions
  async getPredictedHotspots(bounds: { north: number; south: number; east: number; west: number }): Promise<HotspotPrediction[]> {
    return this.makeRequest('/predictions/hotspots', {
      method: 'POST',
      data: { bounds, timeframe: '7d' }
    }) as Promise<HotspotPrediction[]>;
  }

  // Email Integration
  async connectEmail(email: string, provider: string, authCode: string): Promise<EmailConnection> {
    return this.makeRequest('/integrations/email/connect', {
      method: 'POST',
      data: { email, provider, authCode }
    }) as Promise<EmailConnection>;
  }

  async sendNotification(userId: string, type: string, data: any): Promise<void> {
    return this.makeRequest('/notifications/send', {
      method: 'POST',
      data: { userId, type, data }
    }) as Promise<void>;
  }

  // Workflow Management
  async createWorkflow(name: string, trigger: string, actions: any[]): Promise<PicaOSWorkflow> {
    return this.makeRequest('/workflows/create', {
      method: 'POST',
      data: { name, trigger, actions }
    }) as Promise<PicaOSWorkflow>;
  }

  async triggerWorkflow(workflowId: string, data: any): Promise<void> {
    return this.makeRequest(`/workflows/${workflowId}/trigger`, {
      method: 'POST',
      data
    }) as Promise<void>;
  }

  async getWorkflows(): Promise<PicaOSWorkflow[]> {
    return this.makeRequest('/workflows') as Promise<PicaOSWorkflow[]>;
  }

  // Real-time Updates
  async subscribeToUpdates(userId: string, callback: (data: any) => void): Promise<void> {
    // Mock WebSocket connection for development
    console.log(`Mock WebSocket connection for user ${userId}`);
    
    // Simulate periodic updates
    const interval = setInterval(() => {
      const mockData = {
        type: 'update',
        timestamp: new Date().toISOString(),
        data: {
          newReports: Math.floor(Math.random() * 3),
          carbonCredits: Math.floor(Math.random() * 10),
          hotspots: Math.floor(Math.random() * 2)
        }
      };
      callback(mockData);
    }, 30000); // Update every 30 seconds

    // Clean up interval when component unmounts (this is a simplified approach)
    setTimeout(() => clearInterval(interval), 300000); // Stop after 5 minutes

    return Promise.resolve();
  }
}

export const picaOSClient = new PicaOSClient();