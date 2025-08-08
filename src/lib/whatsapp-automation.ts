import { whatsappService } from './whatsapp-service';
import { picaOSClient } from './picaos-client';
import { db } from './database';

export interface WhatsAppAutomation {
  id: string;
  name: string;
  trigger: 'new_message' | 'scheduled' | 'event_based' | 'threshold_reached';
  conditions: {
    keywords?: string[];
    messageType?: 'text' | 'image' | 'location';
    groupIds?: string[];
    timeOfDay?: string;
    dayOfWeek?: number[];
  };
  actions: {
    sendMessage?: {
      template: string;
      recipients: 'sender' | 'group' | 'all_groups';
    };
    createReport?: boolean;
    updateCredits?: boolean;
    triggerWorkflow?: string;
  };
  isActive: boolean;
  language: 'en' | 'sw' | 'mixed';
}

export interface MessageTemplate {
  id: string;
  name: string;
  category: 'welcome' | 'confirmation' | 'reminder' | 'achievement' | 'challenge' | 'event';
  content: {
    en: string;
    sw: string;
    mixed: string;
  };
  variables: string[];
}

class WhatsAppAutomationService {
  private automations: WhatsAppAutomation[] = [];
  private templates: MessageTemplate[] = [];

  constructor() {
    this.initializeDefaultAutomations();
    this.initializeMessageTemplates();
  }

  private initializeDefaultAutomations(): void {
    this.automations = [
      {
        id: 'auto-001',
        name: 'Welcome New Groups',
        trigger: 'new_message',
        conditions: {
          keywords: ['join', 'jiunge', 'register']
        },
        actions: {
          sendMessage: {
            template: 'welcome_group',
            recipients: 'sender'
          }
        },
        isActive: true,
        language: 'mixed'
      },
      {
        id: 'auto-002',
        name: 'Weekly Credit Summary',
        trigger: 'scheduled',
        conditions: {
          dayOfWeek: [0], // Sunday
          timeOfDay: '18:00'
        },
        actions: {
          sendMessage: {
            template: 'weekly_summary',
            recipients: 'all_groups'
          }
        },
        isActive: true,
        language: 'mixed'
      },
      {
        id: 'auto-003',
        name: 'Waste Report Processing',
        trigger: 'new_message',
        conditions: {
          messageType: 'image'
        },
        actions: {
          createReport: true,
          updateCredits: true,
          sendMessage: {
            template: 'report_confirmation',
            recipients: 'sender'
          }
        },
        isActive: true,
        language: 'mixed'
      },
      {
        id: 'auto-004',
        name: 'Achievement Celebrations',
        trigger: 'threshold_reached',
        conditions: {},
        actions: {
          sendMessage: {
            template: 'achievement_unlock',
            recipients: 'group'
          }
        },
        isActive: true,
        language: 'mixed'
      }
    ];
  }

  private initializeMessageTemplates(): void {
    this.templates = [
      {
        id: 'welcome_group',
        name: 'Group Welcome Message',
        category: 'welcome',
        content: {
          en: `🌱 Welcome to Hyve, {{groupName}}! Your community is now connected to our waste management platform.

📱 How to use:
• Send photos of waste to report issues
• Type "credits" to check your group's carbon credits
• Type "help" for more commands

Let's make {{area}} cleaner together! 💚`,
          sw: `🌱 Karibu Hyve, {{groupName}}! Jumuiya yenu sasa imeunganishwa na mfumo wetu wa usimamizi wa taka.

📱 Jinsi ya kutumia:
• Tuma picha za taka kuripoti matatizo
• Andika "pointi" kuangalia pointi za kikundi chako
• Andika "msaada" kwa maagizo zaidi

Tufanye {{area}} isafi pamoja! 💚`,
          mixed: `🌱 Welcome to Hyve, {{groupName}}! Jumuiya yenu is now connected to our waste management platform.

📱 How to use:
• Send picha za waste kuripoti issues
• Type "credits" kucheck pointi za group
• Type "help" au "msaada" for more commands

Let's make {{area}} cleaner pamoja! 💚`
        },
        variables: ['groupName', 'area']
      },
      {
        id: 'report_confirmation',
        name: 'Waste Report Confirmation',
        category: 'confirmation',
        content: {
          en: `✅ Waste report received and processed!

📊 Report Details:
• Type: {{wasteType}}
• Location: {{location}}
• Credits earned: +{{credits}}
• Group total: {{totalCredits}} credits

Thank you for keeping our community clean! 🌱`,
          sw: `✅ Ripoti ya taka imepokewa na kuchakatwa!

📊 Maelezo ya Ripoti:
• Aina: {{wasteType}}
• Mahali: {{location}}
• Pointi zilizopata: +{{credits}}
• Jumla ya kikundi: {{totalCredits}} pointi

Asante kwa kuweka jumuiya yetu safi! 🌱`,
          mixed: `✅ Waste report received na processed!

📊 Report Details:
• Type: {{wasteType}}
• Location: {{location}}
• Credits earned: +{{credits}}
• Group total: {{totalCredits}} credits

Asante for keeping our community clean! 🌱`
        },
        variables: ['wasteType', 'location', 'credits', 'totalCredits']
      },
      {
        id: 'weekly_summary',
        name: 'Weekly Group Summary',
        category: 'reminder',
        content: {
          en: `📊 WEEKLY SUMMARY - {{groupName}}

🗑️ Waste reports: {{reports}}
♻️ Credits earned: +{{weeklyCredits}}
🏆 Community rank: #{{rank}}
🎯 Target progress: {{targetProgress}}%

{{motivationalMessage}}

Keep up the amazing work! 🌟`,
          sw: `📊 MUHTASARI WA WIKI - {{groupName}}

🗑️ Ripoti za taka: {{reports}}
♻️ Pointi zilizopata: +{{weeklyCredits}}
🏆 Nafasi ya jumuiya: #{{rank}}
🎯 Maendeleo ya lengo: {{targetProgress}}%

{{motivationalMessage}}

Endelezeni kazi nzuri! 🌟`,
          mixed: `📊 WEEKLY SUMMARY - {{groupName}}

🗑️ Waste reports: {{reports}}
♻️ Credits earned: +{{weeklyCredits}}
🏆 Community rank: #{{rank}}
🎯 Target progress: {{targetProgress}}%

{{motivationalMessage}}

Keep up the amazing work! 🌟`
        },
        variables: ['groupName', 'reports', 'weeklyCredits', 'rank', 'targetProgress', 'motivationalMessage']
      },
      {
        id: 'challenge_progress',
        name: 'Challenge Progress Update',
        category: 'challenge',
        content: {
          en: `🎯 CHALLENGE UPDATE: {{challengeTitle}}

📊 Progress: {{progress}}/{{target}} {{unit}} ({{percentage}}%)
⏰ Time left: {{timeLeft}}
🏆 Reward: {{rewardCredits}} credits

{{encouragementMessage}}

Let's reach our goal together! 💪`,
          sw: `🎯 MAENDELEO YA CHANGAMOTO: {{challengeTitle}}

📊 Maendeleo: {{progress}}/{{target}} {{unit}} ({{percentage}}%)
⏰ Muda uliosalia: {{timeLeft}}
🏆 Tuzo: {{rewardCredits}} pointi

{{encouragementMessage}}

Tufike lengo letu pamoja! 💪`,
          mixed: `🎯 CHALLENGE UPDATE: {{challengeTitle}}

📊 Progress: {{progress}}/{{target}} {{unit}} ({{percentage}}%)
⏰ Time left: {{timeLeft}}
🏆 Reward: {{rewardCredits}} credits

{{encouragementMessage}}

Let's reach our goal pamoja! 💪`
        },
        variables: ['challengeTitle', 'progress', 'target', 'unit', 'percentage', 'timeLeft', 'rewardCredits', 'encouragementMessage']
      },
      {
        id: 'event_reminder',
        name: 'Event Reminder',
        category: 'event',
        content: {
          en: `📅 EVENT REMINDER: {{eventTitle}}

🕐 Tomorrow at {{time}}
📍 Location: {{location}}
👥 {{confirmedCount}} people confirmed

Don't forget to bring:
• Gloves and bags
• Water bottle
• Positive energy! 

See you there! 🤝`,
          sw: `📅 UKUMBUSHO WA HAFLA: {{eventTitle}}

🕐 Kesho saa {{time}}
📍 Mahali: {{location}}
👥 Watu {{confirmedCount}} wamethibitisha

Usisahau kuleta:
• Glavu na mifuko
• Chupa ya maji
• Nguvu nzuri!

Tutaonana! 🤝`,
          mixed: `📅 EVENT REMINDER: {{eventTitle}}

🕐 Tomorrow saa {{time}}
📍 Location: {{location}}
👥 {{confirmedCount}} people confirmed

Don't forget kuleta:
• Gloves na bags
• Water bottle
• Positive energy!

Tutaonana there! 🤝`
        },
        variables: ['eventTitle', 'time', 'location', 'confirmedCount']
      }
    ];
  }

  // Process incoming WhatsApp messages
  async processMessage(messageData: any): Promise<void> {
    try {
      // Find matching automations
      const matchingAutomations = this.automations.filter(automation => 
        automation.isActive && this.matchesConditions(messageData, automation.conditions)
      );

      for (const automation of matchingAutomations) {
        await this.executeAutomation(automation, messageData);
      }
    } catch (error) {
      console.error('Error processing WhatsApp automation:', error);
    }
  }

  private matchesConditions(messageData: any, conditions: any): boolean {
    // Check keywords
    if (conditions.keywords) {
      const messageText = messageData.body.toLowerCase();
      const hasKeyword = conditions.keywords.some((keyword: string) => 
        messageText.includes(keyword.toLowerCase())
      );
      if (!hasKeyword) return false;
    }

    // Check message type
    if (conditions.messageType && messageData.type !== conditions.messageType) {
      return false;
    }

    // Check time conditions
    if (conditions.timeOfDay || conditions.dayOfWeek) {
      const now = new Date();
      
      if (conditions.dayOfWeek && !conditions.dayOfWeek.includes(now.getDay())) {
        return false;
      }
      
      if (conditions.timeOfDay) {
        const currentTime = now.toTimeString().slice(0, 5);
        if (currentTime !== conditions.timeOfDay) {
          return false;
        }
      }
    }

    return true;
  }

  private async executeAutomation(automation: WhatsAppAutomation, messageData: any): Promise<void> {
    try {
      // Send message action
      if (automation.actions.sendMessage) {
        const template = this.templates.find(t => t.id === automation.actions.sendMessage!.template);
        if (template) {
          const message = this.renderTemplate(template, automation.language, messageData);
          
          switch (automation.actions.sendMessage.recipients) {
            case 'sender':
              await whatsappService.sendMessage(messageData.from, message);
              break;
            case 'group':
              // Send to group admin
              break;
            case 'all_groups':
              // Send to all active groups
              break;
          }
        }
      }

      // Create report action
      if (automation.actions.createReport && messageData.type === 'image') {
        await this.createReportFromMessage(messageData);
      }

      // Update credits action
      if (automation.actions.updateCredits) {
        await this.updateCreditsFromMessage(messageData);
      }

      // Trigger PicaOS workflow
      if (automation.actions.triggerWorkflow) {
        await picaOSClient.triggerWorkflow(automation.actions.triggerWorkflow, messageData);
      }
    } catch (error) {
      console.error('Error executing automation:', error);
    }
  }

  private renderTemplate(template: MessageTemplate, language: 'en' | 'sw' | 'mixed', data: any): string {
    let content = template.content[language] || template.content.en;
    
    // Replace variables
    template.variables.forEach(variable => {
      const value = data[variable] || `{{${variable}}}`;
      content = content.replace(new RegExp(`{{${variable}}}`, 'g'), value);
    });
    
    return content;
  }

  private async createReportFromMessage(messageData: any): Promise<void> {
    try {
      // Use PicaOS to classify the image
      if (messageData.mediaUrl) {
        const response = await fetch(messageData.mediaUrl);
        const blob = await response.blob();
        const file = new File([blob], 'waste-image.jpg', { type: 'image/jpeg' });
        
        const classification = await picaOSClient.classifyWaste(file, [-1.2921, 36.8219]);
        
        // Create waste report
        await db.createWasteReport({
          type: classification.type,
          location: {
            address: 'WhatsApp Report - Kilimani',
            coordinates: [-1.2921, 36.8219]
          },
          description: `WhatsApp report: ${classification.type} waste detected`,
          urgency: classification.urgency,
          status: 'pending',
          images: [messageData.mediaUrl],
          userId: messageData.from,
          credits: classification.carbonValue,
          aiAnalysis: classification
        });
      }
    } catch (error) {
      console.error('Error creating report from WhatsApp message:', error);
    }
  }

  private async updateCreditsFromMessage(messageData: any): Promise<void> {
    // Update user credits based on the message content
    console.log('Updating credits for WhatsApp message:', messageData);
  }

  // Scheduled automation runner
  async runScheduledAutomations(): Promise<void> {
    const now = new Date();
    const currentDay = now.getDay();
    const currentTime = now.toTimeString().slice(0, 5);

    const scheduledAutomations = this.automations.filter(automation => 
      automation.isActive && 
      automation.trigger === 'scheduled' &&
      automation.conditions.dayOfWeek?.includes(currentDay) &&
      automation.conditions.timeOfDay === currentTime
    );

    for (const automation of scheduledAutomations) {
      await this.executeAutomation(automation, {});
    }
  }

  // Community engagement features
  async sendMotivationalMessage(groupId: string, language: 'en' | 'sw' | 'mixed'): Promise<void> {
    const motivationalMessages = {
      en: [
        "🌟 Every small action creates big change! Keep reporting waste and earning credits!",
        "💚 Your community efforts are making Kilimani cleaner every day!",
        "🏆 Together we're building a sustainable future for our neighborhood!",
        "♻️ Your waste reports are turning into real environmental impact!"
      ],
      sw: [
        "🌟 Kila kitendo kidogo kinaunda mabadiliko makubwa! Endeleza kuripoti taka na kupata pointi!",
        "💚 Juhudi za jumuiya yenu zinafanya Kilimani kuwa safi kila siku!",
        "🏆 Pamoja tunajenga mustakabali endelevu kwa mtaa wetu!",
        "♻️ Ripoti zenu za taka zinageuka kuwa athari halisi za mazingira!"
      ],
      mixed: [
        "🌟 Every small action creates big change! Keep reporting waste na earning credits!",
        "💚 Your community efforts zinafanya Kilimani cleaner every day!",
        "🏆 Together we're building sustainable future kwa neighborhood yetu!",
        "♻️ Your waste reports zinageuka real environmental impact!"
      ]
    };

    const messages = motivationalMessages[language];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    
    // Get group admin phone and send message
    // This would be implemented with actual group data
    console.log(`Sending motivational message to group ${groupId}: ${randomMessage}`);
  }

  async createCommunityChallenge(
    groupIds: string[],
    title: string,
    target: number,
    unit: string,
    duration: number,
    language: 'en' | 'sw' | 'mixed'
  ): Promise<void> {
    const challenge = {
      title,
      target,
      unit,
      duration,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + duration * 24 * 60 * 60 * 1000).toISOString()
    };

    const template = this.templates.find(t => t.id === 'challenge_announcement');
    if (template) {
      const message = this.renderTemplate(template, language, {
        challengeTitle: title,
        target,
        unit,
        timeLeft: `${duration} days`,
        rewardCredits: Math.floor(target * 0.1)
      });

      // Send to all participating groups
      for (const groupId of groupIds) {
        // Get group admin phone and send message
        console.log(`Sending challenge announcement to group ${groupId}: ${message}`);
      }
    }
  }

  // Analytics and reporting
  getAutomationStats(): any {
    return {
      totalAutomations: this.automations.length,
      activeAutomations: this.automations.filter(a => a.isActive).length,
      messagesSentToday: 247, // Mock data
      groupsReached: 15,
      averageResponseTime: '2.3s',
      successRate: '98.5%'
    };
  }

  getTemplateUsageStats(): any {
    return this.templates.map(template => ({
      id: template.id,
      name: template.name,
      category: template.category,
      usageCount: Math.floor(Math.random() * 100) + 10,
      lastUsed: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
    }));
  }
}

export const whatsappAutomation = new WhatsAppAutomationService();

// Initialize scheduled automation runner
if (typeof window !== 'undefined') {
  setInterval(() => {
    whatsappAutomation.runScheduledAutomations();
  }, 60000); // Check every minute
}