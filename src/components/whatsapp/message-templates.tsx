import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { 
  MessageSquare, 
  Edit, 
  Save, 
  X, 
  Plus, 
  Globe,
  Eye,
  Copy,
  Send
} from 'lucide-react';
import { MessageTemplate, whatsappAutomation } from '../../lib/whatsapp-automation';
import { motion } from 'framer-motion';

export function MessageTemplates() {
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [editingTemplate, setEditingTemplate] = useState<string | null>(null);
  const [newTemplate, setNewTemplate] = useState<Partial<MessageTemplate>>({
    name: '',
    category: 'welcome',
    content: { en: '', sw: '', mixed: '' },
    variables: []
  });
  const [previewLanguage, setPreviewLanguage] = useState<'en' | 'sw' | 'mixed'>('en');
  const [isCreating, setIsCreating] = useState(false);

  const categories = [
    { value: 'welcome', label: 'Welcome Messages', color: 'bg-green-100 text-green-800' },
    { value: 'confirmation', label: 'Confirmations', color: 'bg-blue-100 text-blue-800' },
    { value: 'reminder', label: 'Reminders', color: 'bg-orange-100 text-orange-800' },
    { value: 'achievement', label: 'Achievements', color: 'bg-purple-100 text-purple-800' },
    { value: 'challenge', label: 'Challenges', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'event', label: 'Events', color: 'bg-pink-100 text-pink-800' }
  ];

  const sampleTemplates: MessageTemplate[] = [
    {
      id: 'template-001',
      name: 'Group Welcome',
      category: 'welcome',
      content: {
        en: `🌱 Welcome to Hyve, {{groupName}}! Your community is now connected to our waste management platform. Send "help" for commands.`,
        sw: `🌱 Karibu Hyve, {{groupName}}! Jumuiya yenu sasa imeunganishwa na mfumo wetu wa usimamizi wa taka. Tuma "msaada" kwa maagizo.`,
        mixed: `🌱 Welcome to Hyve, {{groupName}}! Jumuiya yenu is now connected. Send "help" au "msaada" for commands.`
      },
      variables: ['groupName']
    },
    {
      id: 'template-002',
      name: 'Report Confirmation',
      category: 'confirmation',
      content: {
        en: `✅ Waste report received! Type: {{wasteType}}, Credits: +{{credits}}. Group total: {{totalCredits}} credits.`,
        sw: `✅ Ripoti ya taka imepokewa! Aina: {{wasteType}}, Pointi: +{{credits}}. Jumla ya kikundi: {{totalCredits}} pointi.`,
        mixed: `✅ Report received! Aina: {{wasteType}}, Credits: +{{credits}}. Group total: {{totalCredits}} credits.`
      },
      variables: ['wasteType', 'credits', 'totalCredits']
    }
  ];

  const getCategoryColor = (category: string) => {
    return categories.find(c => c.value === category)?.color || 'bg-gray-100 text-gray-800';
  };

  const extractVariables = (content: string): string[] => {
    const matches = content.match(/{{(\w+)}}/g);
    return matches ? matches.map(match => match.slice(2, -2)) : [];
  };

  const previewTemplate = (template: MessageTemplate, language: 'en' | 'sw' | 'mixed') => {
    let content = template.content[language];
    
    // Replace variables with sample data
    const sampleData: Record<string, string> = {
      groupName: 'Kilimani Green Club',
      wasteType: 'plastic',
      credits: '25',
      totalCredits: '450',
      location: 'Yaya Centre Area',
      challengeTitle: 'Plastic Collection Drive',
      progress: '320',
      target: '500',
      unit: 'kg',
      percentage: '64',
      eventTitle: 'Community Cleanup Day',
      time: '8:00 AM',
      confirmedCount: '15'
    };

    template.variables.forEach(variable => {
      const value = sampleData[variable] || `[${variable}]`;
      content = content.replace(new RegExp(`{{${variable}}}`, 'g'), value);
    });

    return content;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-primary dark:text-white">
            WhatsApp Message Templates
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Manage automated messages for community groups
          </p>
        </div>
        <Button onClick={() => setIsCreating(true)} className="bg-accent hover:bg-accent/90">
          <Plus className="w-4 h-4 mr-2" />
          New Template
        </Button>
      </div>

      {/* Template Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <MessageSquare className="w-6 h-6 text-accent mx-auto mb-2" />
          <div className="text-2xl font-bold text-primary dark:text-white">{sampleTemplates.length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Templates</div>
        </Card>
        
        <Card className="p-4 text-center">
          <Send className="w-6 h-6 text-blue-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-primary dark:text-white">1,247</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Messages Sent</div>
        </Card>
        
        <Card className="p-4 text-center">
          <Globe className="w-6 h-6 text-purple-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-primary dark:text-white">3</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Languages</div>
        </Card>
        
        <Card className="p-4 text-center">
          <Eye className="w-6 h-6 text-green-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-primary dark:text-white">94%</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Open Rate</div>
        </Card>
      </div>

      {/* Templates List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sampleTemplates.map((template) => (
          <motion.div
            key={template.id}
            whileHover={{ scale: 1.01 }}
          >
            <Card className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-primary dark:text-white mb-1">
                    {template.name}
                  </h3>
                  <Badge className={`text-xs ${getCategoryColor(template.category)}`}>
                    {template.category}
                  </Badge>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              {/* Language Selector */}
              <div className="mb-4">
                <Select value={previewLanguage} onValueChange={(value: any) => setPreviewLanguage(value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">🇬🇧 English</SelectItem>
                    <SelectItem value="sw">🇰🇪 Kiswahili</SelectItem>
                    <SelectItem value="mixed">🌍 Mixed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Template Preview */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mb-4">
                <div className="text-xs text-gray-500 mb-2">Preview ({previewLanguage})</div>
                <div className="text-sm whitespace-pre-wrap">
                  {previewTemplate(template, previewLanguage)}
                </div>
              </div>

              {/* Variables */}
              <div className="mb-4">
                <div className="text-xs text-gray-500 mb-2">Variables</div>
                <div className="flex flex-wrap gap-1">
                  {template.variables.map(variable => (
                    <Badge key={variable} variant="secondary" className="text-xs">
                      {variable}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Usage Stats */}
              <div className="text-xs text-gray-500 border-t border-gray-200 dark:border-gray-700 pt-3">
                Used 45 times this week • 98% delivery rate
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Create New Template Modal */}
      {isCreating && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-primary dark:text-white">
                  Create New Template
                </h2>
                <Button
                  variant="outline"
                  onClick={() => setIsCreating(false)}
                  size="sm"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="Template name"
                    value={newTemplate.name}
                    onChange={(e) => setNewTemplate(prev => ({ ...prev, name: e.target.value }))}
                  />
                  <Select 
                    value={newTemplate.category} 
                    onValueChange={(value: any) => setNewTemplate(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-primary dark:text-white mb-2">
                      English Content
                    </label>
                    <Textarea
                      placeholder="Enter English message template..."
                      value={newTemplate.content?.en}
                      onChange={(e) => setNewTemplate(prev => ({
                        ...prev,
                        content: { ...prev.content!, en: e.target.value }
                      }))}
                      rows={4}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-primary dark:text-white mb-2">
                      Kiswahili Content
                    </label>
                    <Textarea
                      placeholder="Ingiza ujumbe wa template kwa Kiswahili..."
                      value={newTemplate.content?.sw}
                      onChange={(e) => setNewTemplate(prev => ({
                        ...prev,
                        content: { ...prev.content!, sw: e.target.value }
                      }))}
                      rows={4}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-primary dark:text-white mb-2">
                      Mixed Language Content
                    </label>
                    <Textarea
                      placeholder="Enter mixed language template..."
                      value={newTemplate.content?.mixed}
                      onChange={(e) => setNewTemplate(prev => ({
                        ...prev,
                        content: { ...prev.content!, mixed: e.target.value }
                      }))}
                      rows={4}
                    />
                  </div>
                </div>

                <div className="text-xs text-gray-500">
                  Use {{variableName}} for dynamic content. Variables will be automatically detected.
                </div>

                <div className="flex space-x-3">
                  <Button
                    onClick={() => {
                      // Save template logic here
                      setIsCreating(false);
                    }}
                    className="bg-accent hover:bg-accent/90"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Template
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsCreating(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}