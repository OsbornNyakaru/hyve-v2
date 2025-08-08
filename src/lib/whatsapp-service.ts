import axios from 'axios';
import { db } from './database';
import { picaOSClient } from './picaos-client';

export interface CommunityGroup {
  id: string;
  name: string;
  whatsappGroupId: string;
  adminPhone: string;
  adminName: string;
  memberCount: number;
  totalCredits: number;
  weeklyTarget: number;
  language: 'en' | 'sw' | 'mixed';
  location: {
    area: string;
    coordinates: [number, number];
  };
  isActive: boolean;
  joinedAt: string;
  lastActivity: string;
}

export interface WhatsAppMessage {
  id: string;
  from: string;
  to: string;
  body: string;
  type: 'text' | 'image' | 'location' | 'audio';
  timestamp: string;
  groupId?: string;
  mediaUrl?: string;
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
}

export interface CommunityChallenge {
  id: string;
  title: string;
  description: string;
  target: number;
  unit: string;
  startDate: string;
  endDate: string;
  participants: string[];
  progress: number;
  rewards: {
    credits: number;
    badges: string[];
  };
  isActive: boolean;
}

export interface EventCoordination {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  organizer: string;
  maxParticipants?: number;
  rsvpList: Array<{
    phone: string;
    name: string;
    status: 'yes' | 'no' | 'maybe';
    timestamp: string;
  }>;
  remindersSent: number;
}

class WhatsAppService {
  private apiKey: string;
  private baseUrl: string;
  private webhookUrl: string;

  constructor() {
    this.apiKey = import.meta.env.VITE_WHATSAPP_API_KEY || '';
    this.baseUrl = 'https://api.twilio.com/2010-04-01/Accounts';
    this.webhookUrl = import.meta.env.VITE_WEBHOOK_URL || '';
  }

  // Group Management
  async registerCommunityGroup(
    adminPhone: string, 
    groupName: string, 
    area: string,
    language: 'en' | 'sw' | 'mixed' = 'en'
  ): Promise<CommunityGroup | null> {
    try {
      const groupData: Omit<CommunityGroup, 'id'> = {
        name: groupName,
        whatsappGroupId: `group_${Date.now()}`,
        adminPhone,
        adminName: '',
        memberCount: 1,
        totalCredits: 0,
        weeklyTarget: 100,
        language,
        location: {
          area,
          coordinates: [-1.2921, 36.8219] // Default to Kilimani center
        },
        isActive: true,
        joinedAt: new Date().toISOString(),
        lastActivity: new Date().toISOString()
      };

      // Save to database
      const savedGroup = await this.saveCommunityGroup(groupData);
      
      if (savedGroup) {
        // Send welcome message
        await this.sendWelcomeMessage(adminPhone, groupName, language);
        return savedGroup;
      }
      
      return null;
    } catch (error) {
      console.error('Error registering community group:', error);
      return null;
    }
  }

  // Message Processing
  async processIncomingMessage(message: WhatsAppMessage): Promise<void> {
    try {
      const group = await this.getGroupByPhone(message.from);
      
      if (!group) {
        await this.handleNewUserMessage(message);
        return;
      }

      // Use PicaOS to classify the message intent
      const intent = await this.classifyMessageIntent(message);
      
      switch (intent.type) {
        case 'waste_report':
          await this.handleWasteReport(message, group, intent);
          break;
        case 'challenge_update':
          await this.sendChallengeUpdate(group.id, intent.challengeId || 'challenge-001');
          break;
        case 'event_rsvp':
          await this.handleEventRSVP(message, group, intent);
          break;
        case 'credits_inquiry':
          await this.handleCreditsInquiry(message, group);
          break;
        case 'help_request':
          await this.sendHelpMessage(message.from, group.language);
          break;
        default:
          await this.handleGeneralMessage(message, group);
      }
    } catch (error) {
      console.error('Error processing WhatsApp message:', error);
    }
  }

  // Waste Reporting via WhatsApp
  async handleWasteReport(message: WhatsAppMessage, group: CommunityGroup, intent: any): Promise<void> {
    try {
      let wasteData: any = {
        type: intent.wasteType || 'other',
        description: message.body,
        urgency: intent.urgency || 'medium',
        groupId: group.id,
        reporterPhone: message.from
      };

      // Handle location
      if (message.location) {
        wasteData.location = {
          address: message.location.address || `${group.location.area} area`,
          coordinates: [message.location.latitude, message.location.longitude]
        };
      } else {
        wasteData.location = group.location;
      }

      // Handle image classification
      if (message.type === 'image' && message.mediaUrl) {
        try {
          const classification = await this.classifyWasteImage(message.mediaUrl, wasteData.location.coordinates);
          wasteData = { ...wasteData, ...classification };
        } catch (error) {
          console.error('Image classification failed:', error);
        }
      }

      // Create waste report
      const report = await db.createWasteReport({
        ...wasteData,
        userId: group.adminPhone,
        status: 'pending' as const,
        images: message.mediaUrl ? [message.mediaUrl] : [],
        credits: this.calculateCredits(wasteData.type, wasteData.urgency)
      });

      if (report) {
        // Update group credits
        await this.updateGroupCredits(group.id, report.credits);
        
        // Send confirmation
        await this.sendReportConfirmation(message.from, report, group.language);
        
        // Notify group about the report
        await this.notifyGroupAboutReport(group, report);
      }
    } catch (error) {
      console.error('Error handling waste report:', error);
      await this.sendErrorMessage(message.from, group.language);
    }
  }

  // Community Challenges
  async createCommunityChallenge(
    groupId: string, 
    title: string, 
    target: number, 
    unit: string,
    duration: number = 7
  ): Promise<CommunityChallenge | null> {
    try {
      const challenge: Omit<CommunityChallenge, 'id'> = {
        title,
        description: `Collect ${target} ${unit} in ${duration} days`,
        target,
        unit,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + duration * 24 * 60 * 60 * 1000).toISOString(),
        participants: [],
        progress: 0,
        rewards: {
          credits: Math.floor(target * 0.1),
          badges: ['🏆', '♻️', '🌱']
        },
        isActive: true
      };

      const savedChallenge = await this.saveCommunityChallenge(challenge);
      
      if (savedChallenge) {
        const group = await this.getGroupById(groupId);
        if (group) {
          await this.announceChallengeToGroup(group, savedChallenge);
        }
      }
      
      return savedChallenge;
    } catch (error) {
      console.error('Error creating community challenge:', error);
      return null;
    }
  }

  // Event Coordination
  async createCommunityEvent(
    groupId: string,
    title: string,
    description: string,
    date: string,
    location: string
  ): Promise<EventCoordination | null> {
    try {
      const event: Omit<EventCoordination, 'id'> = {
        title,
        description,
        date,
        location,
        organizer: groupId,
        rsvpList: [],
        remindersSent: 0
      };

      const savedEvent = await this.saveEvent(event);
      
      if (savedEvent) {
        const group = await this.getGroupById(groupId);
        if (group) {
          await this.announceEventToGroup(group, savedEvent);
        }
      }
      
      return savedEvent;
    } catch (error) {
      console.error('Error creating community event:', error);
      return null;
    }
  }

  // Message Sending
  async sendMessage(to: string, message: string, mediaUrl?: string): Promise<boolean> {
    try {
      // Mock implementation for development
      console.log(`Sending WhatsApp message to ${to}:`, message);
      if (mediaUrl) console.log('Media URL:', mediaUrl);
      
      // In production, use Twilio WhatsApp API
      /*
      const response = await axios.post(`${this.baseUrl}/Messages.json`, {
        From: 'whatsapp:+14155238886', // Twilio sandbox number
        To: `whatsapp:${to}`,
        Body: message,
        MediaUrl: mediaUrl
      }, {
        auth: {
          username: this.apiKey,
          password: this.authToken
        }
      });
      
      return response.status === 201;
      */
      
      return true;
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
      return false;
    }
  }

  async sendBulkMessage(phones: string[], message: string): Promise<number> {
    let successCount = 0;
    
    for (const phone of phones) {
      const success = await this.sendMessage(phone, message);
      if (success) successCount++;
      
      // Rate limiting - wait 1 second between messages
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    return successCount;
  }

  // AI Message Classification
  private async classifyMessageIntent(message: WhatsAppMessage): Promise<any> {
    try {
      // Use PicaOS to classify message intent
      const classification = await picaOSClient.classifyWaste(
        new File([message.body], 'message.txt', { type: 'text/plain' }),
        [-1.2921, 36.8219]
      );
      
      return {
        type: 'waste_report',
        wasteType: classification.type,
        urgency: classification.urgency,
        confidence: classification.confidence
      };
    } catch (error) {
      // Fallback to simple keyword matching
      const body = message.body.toLowerCase();
      
      if (body.includes('waste') || body.includes('trash') || body.includes('garbage')) {
        return { type: 'waste_report', wasteType: 'other', urgency: 'medium' };
      }
      if (body.includes('credit') || body.includes('points') || body.includes('score')) {
        return { type: 'credits_inquiry' };
      }
      if (body.includes('event') || body.includes('cleanup') || body.includes('rsvp')) {
        return { type: 'event_rsvp' };
      }
      if (body.includes('help') || body.includes('msaada')) {
        return { type: 'help_request' };
      }
      
      return { type: 'general', confidence: 0.5 };
    }
  }

  // Localized Messages
  private getLocalizedMessage(key: string, language: 'en' | 'sw' | 'mixed', params: any = {}): string {
    const messages = {
      welcome: {
        en: `🌱 Welcome to Hyve, ${params.groupName}! Your community is now connected to our waste management platform. Send "help" for commands.`,
        sw: `🌱 Karibu Hyve, ${params.groupName}! Jumuiya yenu sasa imeunganishwa na mfumo wetu wa usimamizi wa taka. Tuma "msaada" kwa maagizo.`,
        mixed: `🌱 Welcome to Hyve, ${params.groupName}! Jumuiya yenu is now connected. Send "help" au "msaada" for commands.`
      },
      report_confirmed: {
        en: `✅ Waste report received! Type: ${params.type}, Credits: +${params.credits}. Your group total: ${params.totalCredits} credits.`,
        sw: `✅ Ripoti ya taka imepokewa! Aina: ${params.type}, Pointi: +${params.credits}. Jumla ya kikundi: ${params.totalCredits} pointi.`,
        mixed: `✅ Report received! Aina: ${params.type}, Credits: +${params.credits}. Group total: ${params.totalCredits} credits.`
      },
      weekly_summary: {
        en: `📊 Weekly Summary for ${params.groupName}:\n🗑️ Reports: ${params.reports}\n♻️ Credits earned: +${params.credits}\n🏆 Rank: #${params.rank}\n\nKeep up the great work! 🌱`,
        sw: `📊 Muhtasari wa Wiki kwa ${params.groupName}:\n🗑️ Ripoti: ${params.reports}\n♻️ Pointi zilizopata: +${params.credits}\n🏆 Nafasi: #${params.rank}\n\nEndelezeni kazi nzuri! 🌱`,
        mixed: `📊 Weekly Summary ya ${params.groupName}:\n🗑️ Reports: ${params.reports}\n♻️ Credits earned: +${params.credits}\n🏆 Rank: #${params.rank}\n\nKeep up the good work! 🌱`
      },
      challenge_announcement: {
        en: `🎯 NEW CHALLENGE: ${params.title}\n📝 Goal: ${params.target} ${params.unit}\n⏰ Deadline: ${params.deadline}\n🏆 Reward: ${params.credits} credits\n\nLet's do this together! 💪`,
        sw: `🎯 CHANGAMOTO MPYA: ${params.title}\n📝 Lengo: ${params.target} ${params.unit}\n⏰ Muda: ${params.deadline}\n🏆 Tuzo: ${params.credits} pointi\n\nTufanye hii pamoja! 💪`,
        mixed: `🎯 NEW CHALLENGE: ${params.title}\n📝 Target: ${params.target} ${params.unit}\n⏰ Deadline: ${params.deadline}\n🏆 Reward: ${params.credits} credits\n\nLet's do this pamoja! 💪`
      },
      event_invitation: {
        en: `📅 EVENT INVITATION\n🌱 ${params.title}\n📍 Location: ${params.location}\n🕐 Date: ${params.date}\n\nReply "YES" to join, "NO" to decline. See you there! 🤝`,
        sw: `📅 MWALIKO WA HAFLA\n🌱 ${params.title}\n📍 Mahali: ${params.location}\n🕐 Tarehe: ${params.date}\n\nJibu "NDIO" kujiunga, "HAPANA" kukataa. Tutaonana! 🤝`,
        mixed: `📅 EVENT INVITATION\n🌱 ${params.title}\n📍 Location: ${params.location}\n🕐 Date: ${params.date}\n\nReply "YES" au "NDIO" to join. Tutaonana! 🤝`
      },
      help_menu: {
        en: `🆘 HYVE HELP MENU\n\n📸 Send photo + location to report waste\n💰 "credits" - Check your credits\n🏆 "challenge" - Current challenges\n📅 "events" - Upcoming events\n📊 "summary" - Weekly summary\n\nNeed more help? Contact support.`,
        sw: `🆘 MENYU YA MSAADA\n\n📸 Tuma picha + mahali kuripoti taka\n💰 "pointi" - Angalia pointi zako\n🏆 "changamoto" - Changamoto za sasa\n📅 "hafla" - Hafla zinazokuja\n📊 "muhtasari" - Muhtasari wa wiki\n\nUnahitaji msaada zaidi? Wasiliana na msaada.`,
        mixed: `🆘 HELP MENU\n\n📸 Send photo + location kuripoti waste\n💰 "credits" - Check pointi zako\n🏆 "challenge" - Current changamoto\n📅 "events" - Upcoming hafla\n📊 "summary" - Weekly muhtasari\n\nNeed more msaada? Contact support.`
      }
    };

    return messages[key]?.[language] || messages[key]?.en || 'Message not found';
  }

  // Automated Updates
  async sendWeeklySummary(groupId: string): Promise<void> {
    try {
      const group = await this.getGroupById(groupId);
      if (!group) return;

      const weeklyStats = await this.getWeeklyStats(groupId);
      const message = this.getLocalizedMessage('weekly_summary', group.language, {
        groupName: group.name,
        reports: weeklyStats.reports,
        credits: weeklyStats.credits,
        rank: weeklyStats.rank
      });

      await this.sendMessage(group.adminPhone, message);
    } catch (error) {
      console.error('Error sending weekly summary:', error);
    }
  }

  async sendChallengeUpdate(groupId: string, challengeId: string): Promise<void> {
    try {
      const group = await this.getGroupById(groupId);
      const challenge = await this.getChallengeById(challengeId);
      
      if (!group || !challenge) return;

      const progressPercent = Math.round((challenge.progress / challenge.target) * 100);
      const message = group.language === 'sw' 
        ? `🎯 ${challenge.title}\n📊 Maendeleo: ${challenge.progress}/${challenge.target} ${challenge.unit} (${progressPercent}%)\n\n${progressPercent >= 100 ? '🎉 Hongera! Mmefanikiwa!' : 'Endelezeni!'}`
        : `🎯 ${challenge.title}\n📊 Progress: ${challenge.progress}/${challenge.target} ${challenge.unit} (${progressPercent}%)\n\n${progressPercent >= 100 ? '🎉 Congratulations! Challenge completed!' : 'Keep going!'}`;

      await this.sendMessage(group.adminPhone, message);
    } catch (error) {
      console.error('Error sending challenge update:', error);
    }
  }

  // Event Management
  async handleEventRSVP(message: WhatsAppMessage, group: CommunityGroup, intent: any): Promise<void> {
    try {
      const response = message.body.toLowerCase();
      let status: 'yes' | 'no' | 'maybe' = 'maybe';
      
      if (response.includes('yes') || response.includes('ndio') || response.includes('sawa')) {
        status = 'yes';
      } else if (response.includes('no') || response.includes('hapana') || response.includes('siezi')) {
        status = 'no';
      }

      // Update RSVP in database
      await this.updateEventRSVP(intent.eventId, message.from, status);
      
      const confirmMessage = group.language === 'sw'
        ? `✅ RSVP yako imepokewa: ${status === 'yes' ? 'Utahudhuria' : status === 'no' ? 'Hutahudhuria' : 'Bado haujakakamua'}`
        : `✅ RSVP received: ${status === 'yes' ? 'You will attend' : status === 'no' ? 'You will not attend' : 'Maybe attending'}`;
      
      await this.sendMessage(message.from, confirmMessage);
    } catch (error) {
      console.error('Error handling event RSVP:', error);
    }
  }

  // Credits Management
  async handleCreditsInquiry(message: WhatsAppMessage, group: CommunityGroup): Promise<void> {
    try {
      const groupStats = await this.getGroupStats(group.id);
      const message_text = this.getLocalizedMessage('credits_summary', group.language, {
        groupName: group.name,
        totalCredits: groupStats.totalCredits,
        weeklyCredits: groupStats.weeklyCredits,
        rank: groupStats.rank,
        nextTarget: groupStats.nextTarget
      });

      await this.sendMessage(message.from, message_text);
    } catch (error) {
      console.error('Error handling credits inquiry:', error);
    }
  }

  // Utility Methods
  private async classifyWasteImage(imageUrl: string, coordinates: [number, number]): Promise<any> {
    try {
      // Create a mock file from URL for PicaOS classification
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const file = new File([blob], 'waste-image.jpg', { type: 'image/jpeg' });
      
      return await picaOSClient.classifyWaste(file, coordinates);
    } catch (error) {
      console.error('Error classifying waste image:', error);
      return { type: 'other', urgency: 'medium', confidence: 0.5 };
    }
  }

  private calculateCredits(wasteType: string, urgency: string): number {
    let credits = 10; // Base credits
    
    if (urgency === 'high') credits += 10;
    if (wasteType === 'hazardous') credits += 15;
    if (wasteType === 'electronic') credits += 12;
    
    return credits;
  }

  // Database Operations (Mock implementations)
  private async saveCommunityGroup(groupData: Omit<CommunityGroup, 'id'>): Promise<CommunityGroup | null> {
    // In production, save to Supabase
    return { ...groupData, id: `group_${Date.now()}` };
  }

  private async getGroupByPhone(phone: string): Promise<CommunityGroup | null> {
    // Mock implementation
    return null;
  }

  private async getGroupById(groupId: string): Promise<CommunityGroup | null> {
    // Mock implementation
    return null;
  }

  private async updateGroupCredits(groupId: string, credits: number): Promise<void> {
    // Mock implementation
    console.log(`Updating group ${groupId} with ${credits} credits`);
  }

  private async getWeeklyStats(groupId: string): Promise<any> {
    return {
      reports: 12,
      credits: 150,
      rank: 3
    };
  }

  private async getGroupStats(groupId: string): Promise<any> {
    return {
      totalCredits: 450,
      weeklyCredits: 150,
      rank: 3,
      nextTarget: 500
    };
  }

  private async saveCommunityChallenge(challenge: Omit<CommunityChallenge, 'id'>): Promise<CommunityChallenge | null> {
    return { ...challenge, id: `challenge_${Date.now()}` };
  }

  private async getChallengeById(challengeId: string): Promise<CommunityChallenge | null> {
    return null;
  }

  private async saveEvent(event: Omit<EventCoordination, 'id'>): Promise<EventCoordination | null> {
    return { ...event, id: `event_${Date.now()}` };
  }

  private async updateEventRSVP(eventId: string, phone: string, status: 'yes' | 'no' | 'maybe'): Promise<void> {
    console.log(`RSVP update: ${phone} -> ${status} for event ${eventId}`);
  }

  // Message Handlers
  private async handleNewUserMessage(message: WhatsAppMessage): Promise<void> {
    const body = message.body.toLowerCase();
    
    if (body.includes('join') || body.includes('jiunge')) {
      await this.startGroupRegistration(message.from);
    } else {
      await this.sendMessage(message.from, 
        'Welcome to Hyve! 🌱 Send "join" to register your community group for waste management and carbon credits.'
      );
    }
  }

  private async startGroupRegistration(phone: string): Promise<void> {
    const message = `🌱 Welcome to Hyve Community Registration!

Please provide your group details:
1. Group name
2. Area/Location
3. Preferred language (English/Swahili/Mixed)

Example: "Kilimani Green Club, Yaya Centre Area, English"`;

    await this.sendMessage(phone, message);
  }

  private async sendWelcomeMessage(phone: string, groupName: string, language: 'en' | 'sw' | 'mixed'): Promise<void> {
    const message = this.getLocalizedMessage('welcome', language, { groupName });
    await this.sendMessage(phone, message);
  }

  private async sendReportConfirmation(phone: string, report: any, language: 'en' | 'sw' | 'mixed'): Promise<void> {
    const message = this.getLocalizedMessage('report_confirmed', language, {
      type: report.type,
      credits: report.credits,
      totalCredits: 450 // This would come from database
    });
    await this.sendMessage(phone, message);
  }

  private async notifyGroupAboutReport(group: CommunityGroup, report: any): Promise<void> {
    const message = group.language === 'sw'
      ? `🌱 Ripoti mpya ya taka imetumwa na mwanachama! Aina: ${report.type}, Mahali: ${report.location.address}. Pointi: +${report.credits}`
      : `🌱 New waste report submitted by a member! Type: ${report.type}, Location: ${report.location.address}. Credits: +${report.credits}`;
    
    await this.sendMessage(group.adminPhone, message);
  }

  private async announceChallengeToGroup(group: CommunityGroup, challenge: CommunityChallenge): Promise<void> {
    const deadline = new Date(challenge.endDate).toLocaleDateString();
    const message = this.getLocalizedMessage('challenge_announcement', group.language, {
      title: challenge.title,
      target: challenge.target,
      unit: challenge.unit,
      deadline,
      credits: challenge.rewards.credits
    });
    
    await this.sendMessage(group.adminPhone, message);
  }

  private async announceEventToGroup(group: CommunityGroup, event: EventCoordination): Promise<void> {
    const eventDate = new Date(event.date).toLocaleDateString();
    const message = this.getLocalizedMessage('event_invitation', group.language, {
      title: event.title,
      location: event.location,
      date: eventDate
    });
    
    await this.sendMessage(group.adminPhone, message);
  }

  private async sendHelpMessage(phone: string, language: 'en' | 'sw' | 'mixed'): Promise<void> {
    const message = this.getLocalizedMessage('help_menu', language);
    await this.sendMessage(phone, message);
  }

  private async handleGeneralMessage(message: WhatsAppMessage, group: CommunityGroup): Promise<void> {
    const response = group.language === 'sw'
      ? `Asante kwa ujumbe wako! Tuma "msaada" kwa maagizo au picha ya taka kuripoti.`
      : `Thanks for your message! Send "help" for commands or a photo of waste to report.`;
    
    await this.sendMessage(message.from, response);
  }

  private async sendErrorMessage(phone: string, language: 'en' | 'sw' | 'mixed'): Promise<void> {
    const message = language === 'sw'
      ? `😔 Samahani, hitilafu imetokea. Jaribu tena au tuma "msaada" kwa msaada.`
      : `😔 Sorry, an error occurred. Please try again or send "help" for assistance.`;
    
    await this.sendMessage(phone, message);
  }
}

export const whatsappService = new WhatsAppService();