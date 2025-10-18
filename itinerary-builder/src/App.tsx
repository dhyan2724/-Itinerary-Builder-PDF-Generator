import { useState } from 'react';
import { useForm } from 'react-hook-form';
import ItineraryForm from './components/ItineraryForm';
import PDFPreview from './components/PDFPreview';
import { ItineraryData } from './types';
import { generatePDF } from './utils/pdfGenerator';

function App() {
  const [itineraryData, setItineraryData] = useState<ItineraryData | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const { control, handleSubmit, watch, setValue, getValues } = useForm<ItineraryData>({
    defaultValues: {
      travelerName: '',
      destination: '',
      duration: '',
      departureFrom: '',
      departureTo: '',
      adults: 2,
      children: 0,
      infants: 0,
      totalTravelers: 2,
      days: [],
      flights: [],
      hotels: [],
      totalAmount: 95000,
      currency: 'INR',
      tds: 'Not Applicable',
      installments: [],
      visaType: 'E-Visa',
      visaProcessingDays: '5-7 Days',
      importantNotes: [],
      scopeOfService: [],
      inclusions: [],
      activities: [],
    }
  });

  const onSubmit = (data: ItineraryData) => {
    setItineraryData(data);
    setShowPreview(true);
  };

  const handleGeneratePDF = async () => {
    if (!itineraryData) return;
    
    setIsGeneratingPDF(true);
    try {
      await generatePDF(itineraryData);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleBackToForm = () => {
    setShowPreview(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {!showPreview ? (
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Itinerary Builder
              </h1>
              <p className="text-gray-600">
                Create beautiful travel itineraries and generate professional PDFs
              </p>
            </div>
            
            <ItineraryForm
              control={control}
              handleSubmit={handleSubmit}
              onSubmit={onSubmit}
              setValue={setValue}
              getValues={getValues}
              watch={watch}
            />
          </div>
        </div>
      ) : (
        <PDFPreview
          data={itineraryData!}
          onGeneratePDF={handleGeneratePDF}
          onBackToForm={handleBackToForm}
          isGeneratingPDF={isGeneratingPDF}
        />
      )}
    </div>
  );
}

export default App;
