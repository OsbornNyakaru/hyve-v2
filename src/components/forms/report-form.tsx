import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card } from '../ui/card';
import { MapPin, Camera, Upload, CheckCircle, AlertCircle, Brain, Loader2 } from 'lucide-react';
import { useAppStore } from '../../lib/store';
import { picaOSClient } from '../../lib/picaos-client';
import { motion } from 'framer-motion';

export function ReportForm() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { addReport } = useAppStore();
  const [formData, setFormData] = useState({
    location: '',
    address: '',
    wasteType: '',
    description: '',
    urgency: '',
    images: [] as File[]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [classification, setClassification] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleLocationDetect = () => {
    setLocationError('');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData(prev => ({
            ...prev,
            location: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
            address: `GPS Location: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
          }));
        },
        (error) => {
          setLocationError('Unable to get location. Please enter manually.');
        }
      );
    } else {
      setLocationError('Geolocation not supported by this browser.');
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...files]
      }));

      // Classify first image with PicaOS
      if (files.length > 0) {
        setIsAnalyzing(true);
        try {
          const coords = formData.location.includes(',') 
            ? formData.location.split(',').map(c => parseFloat(c.trim())) as [number, number]
            : [-1.2921, 36.8219] as [number, number];
            
          const classification = await picaOSClient.classifyWaste(files[0], coords);
          setClassification(classification);
          
          // Auto-fill form based on PicaOS classification
          setFormData(prev => ({
            ...prev,
            wasteType: classification.type,
            urgency: classification.urgency,
            description: prev.description || `${classification.type} waste detected. Estimated weight: ${classification.estimatedWeight}kg. ${classification.disposalMethod}. Recyclable: ${classification.recyclable ? 'Yes' : 'No'}.`
          }));
        } catch (error) {
          console.error('PicaOS classification failed:', error);
        } finally {
          setIsAnalyzing(false);
        }
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      navigate('/login');
      return;
    }

    if (!formData.location || !formData.wasteType || !formData.description || !formData.urgency) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Parse coordinates
      const coords = formData.location.includes(',') 
        ? formData.location.split(',').map(c => parseFloat(c.trim()))
        : [-1.2921, 36.8219]; // Default to Kilimani center

      const reportData = {
        type: formData.wasteType as any,
        location: {
          address: formData.address || formData.location,
          coordinates: [coords[0], coords[1]] as [number, number]
        },
        description: formData.description,
        urgency: formData.urgency as any,
        status: 'pending' as const,
        images: formData.images.map(file => URL.createObjectURL(file)),
        userId: user.id,
        aiAnalysis: classification
      };

      await addReport(reportData);
      
      setIsSubmitting(false);
      setSubmitted(true);
    } catch (error) {
      setIsSubmitting(false);
      alert('Error submitting report. Please try again.');
    }
  };

  const handleNewReport = () => {
    setSubmitted(false);
    setClassification(null);
    setFormData({
      location: '',
      address: '',
      wasteType: '',
      description: '',
      urgency: '',
      images: []
    });
  };

  if (submitted) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-8 md:py-12"
      >
        <CheckCircle className="w-12 md:w-16 h-12 md:h-16 text-accent mx-auto mb-4" />
        <h3 className="text-xl md:text-2xl font-bold text-primary dark:text-white mb-2">
          Report Submitted Successfully!
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm md:text-base px-4">
          Thank you for helping keep Kilimani clean. You've earned <span className="font-bold text-accent">+{classification?.carbonValue || 15} carbon credits</span>!
        </p>
        
        {classification && (
          <div className="bg-accent/10 border border-accent/20 rounded-xl p-4 max-w-md mx-auto mb-6">
            <div className="flex items-center space-x-2 mb-2">
              <Brain className="w-4 h-4 text-accent" />
              <span className="font-medium text-accent">PicaOS Classification</span>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <div>Type: {classification.type} ({Math.round(classification.confidence * 100)}% confidence)</div>
              <div>Weight: {classification.estimatedWeight}kg</div>
              <div>Carbon Value: +{classification.carbonValue} credits</div>
              <div>Recyclable: {classification.recyclable ? 'Yes' : 'No'}</div>
            </div>
          </div>
        )}
        
        <div className="bg-accent/5 border border-accent/20 rounded-xl p-4 max-w-md mx-auto mb-6">
          <div className="font-semibold text-accent mb-1">Report #{`KLM-${String(Date.now()).slice(-6)}`}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            PicaOS workflow triggered • Pickup scheduled automatically
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-3 justify-center px-4">
          <Button onClick={handleNewReport} className="w-full md:w-auto">
            Submit Another Report
          </Button>
          <Button variant="outline" onClick={() => navigate('/dashboard')} className="w-full md:w-auto">
            View Dashboard
          </Button>
        </div>
      </motion.div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-8 md:py-12">
        <AlertCircle className="w-12 md:w-16 h-12 md:h-16 text-orange-500 mx-auto mb-4" />
        <h3 className="text-xl md:text-2xl font-bold text-primary dark:text-white mb-2">
          Sign In Required
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm md:text-base px-4">
          Please sign in to submit waste reports and earn carbon credits.
        </p>
        <Button onClick={() => navigate('/login')} className="w-full md:w-auto">
          Go to Sign In
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* PicaOS Classification Display */}
      {classification && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-200 dark:border-purple-800 p-4">
            <div className="flex items-start space-x-3">
              <Brain className="w-5 h-5 text-purple-600 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-primary dark:text-white mb-2">
                  PicaOS Classification Complete
                </h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Type:</span>
                    <span className="ml-2 font-medium text-purple-600">
                      {classification.type} ({Math.round(classification.confidence * 100)}%)
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Weight:</span>
                    <span className="ml-2 font-medium">{classification.estimatedWeight}kg</span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Urgency:</span>
                    <span className="ml-2 font-medium">{classification.urgency}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Credits:</span>
                    <span className="ml-2 font-medium text-accent">+{classification.carbonValue}</span>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Recyclable:</span>
                    <span className="ml-2 font-medium">{classification.recyclable ? 'Yes' : 'No'}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Method:</span>
                    <span className="ml-2 font-medium">{classification.disposalMethod}</span>
                  </div>
                </div>
                {classification.recommendations && (
                  <div className="mt-3">
                    <span className="text-gray-600 dark:text-gray-400 text-sm">Recommendations:</span>
                    <ul className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      {classification.recommendations.slice(0, 2).map((rec: string, index: number) => (
                        <li key={index} className="flex items-center space-x-2">
                          <span className="w-1 h-1 bg-purple-600 rounded-full" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Location */}
      <div>
        <label className="block text-sm font-medium text-primary dark:text-white mb-2">
          Location *
        </label>
        <div className="flex gap-3">
          <Input
            placeholder="Enter address or GPS coordinates"
            value={formData.location}
            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
            className="flex-1"
            required
          />
          <Button
            type="button"
            variant="outline"
            onClick={handleLocationDetect}
            className="px-4 flex-shrink-0"
          >
            <MapPin className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Click the pin icon to auto-detect your current location
        </p>
        {locationError && (
          <p className="text-xs text-red-500 mt-1">{locationError}</p>
        )}
      </div>

      {/* Address (if different from coordinates) */}
      {formData.location && !formData.location.includes('Current Location') && (
        <div>
          <label className="block text-sm font-medium text-primary dark:text-white mb-2">
            Address Description (Optional)
          </label>
          <Input
            placeholder="e.g., Near Yaya Centre, Behind KFC"
            value={formData.address}
            onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
          />
        </div>
      )}

      {/* Image Upload - Mobile First */}
      <div>
        <label className="block text-sm font-medium text-primary dark:text-white mb-2">
          Upload Images *
        </label>
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-4 md:p-6 text-center hover:border-accent transition-colors duration-200">
          <input
            type="file"
            id="images"
            multiple
            accept="image/*"
            capture="environment"
            onChange={handleImageUpload}
            className="hidden"
          />
          <label htmlFor="images" className="cursor-pointer">
            {isAnalyzing ? (
              <div className="flex flex-col items-center">
                <Loader2 className="w-6 md:w-8 h-6 md:h-8 text-accent animate-spin mb-2" />
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  PicaOS analyzing image...
                </p>
              </div>
            ) : (
              <>
                <Upload className="w-6 md:w-8 h-6 md:h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
                  Take photo or upload from gallery
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PNG, JPG up to 10MB each • PicaOS will classify automatically
                </p>
              </>
            )}
          </label>
        </div>
        {formData.images.length > 0 && (
          <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
            {formData.images.length} image(s) selected
          </div>
        )}
      </div>

      {/* Waste Type */}
      <div>
        <label className="block text-sm font-medium text-primary dark:text-white mb-2">
          Waste Type *
        </label>
        <Select 
          value={formData.wasteType}
          onValueChange={(value) => setFormData(prev => ({ ...prev, wasteType: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select waste type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="plastic">🔵 Plastic Waste</SelectItem>
            <SelectItem value="organic">🟢 Organic Waste</SelectItem>
            <SelectItem value="electronic">🟣 E-Waste</SelectItem>
            <SelectItem value="construction">🟠 Construction Debris</SelectItem>
            <SelectItem value="hazardous">🔴 Hazardous Materials</SelectItem>
            <SelectItem value="other">⚪ Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Urgency */}
      <div>
        <label className="block text-sm font-medium text-primary dark:text-white mb-2">
          Urgency Level *
        </label>
        <Select 
          value={formData.urgency}
          onValueChange={(value) => setFormData(prev => ({ ...prev, urgency: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select urgency level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">🟢 Low - Minor issue</SelectItem>
            <SelectItem value="medium">🟡 Medium - Needs attention</SelectItem>
            <SelectItem value="high">🔴 High - Urgent cleanup needed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-primary dark:text-white mb-2">
          Description *
        </label>
        <Textarea
          placeholder="Describe the waste issue in detail..."
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={4}
          className="resize-none"
        />
      </div>

      {/* PicaOS Recommendations */}
      {classification && classification.recommendations && (
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 p-4">
          <div className="flex items-start space-x-3">
            <Brain className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-primary dark:text-white mb-2">
                PicaOS Disposal Recommendations
              </h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                {classification.recommendations.map((rec: string, index: number) => (
                  <li key={index} className="flex items-center space-x-2">
                    <span className="w-1 h-1 bg-blue-600 rounded-full" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      )}

      {/* Submit */}
      <Button
        type="submit"
        disabled={isSubmitting || isAnalyzing || !formData.location || !formData.wasteType || !formData.description || !formData.urgency}
        className="w-full bg-accent hover:bg-accent/90 h-12"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Submitting to PicaOS...
          </>
        ) : (
          <>
            <Camera className="w-4 h-4 mr-2" />
            Submit Report
          </>
        )}
      </Button>
    </form>
  );
}