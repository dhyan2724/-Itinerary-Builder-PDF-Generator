import React from 'react';
import { Control, UseFormGetValues, UseFormHandleSubmit, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { ItineraryData } from '../types';
import ActivitiesForm from './ActivitiesForm';
import BasicInfoForm from './BasicInfoForm';
import DaysForm from './DaysForm';
import FlightsForm from './FlightsForm';
import HotelsForm from './HotelsForm';
import InclusionsForm from './InclusionsForm';
import NotesForm from './NotesForm';
import PaymentForm from './PaymentForm';
import ServicesForm from './ServicesForm';
import VisaForm from './VisaForm';

interface ItineraryFormProps {
  control: Control<ItineraryData>;
  handleSubmit: UseFormHandleSubmit<ItineraryData>;
  onSubmit: (data: ItineraryData) => void;
  setValue: UseFormSetValue<ItineraryData>;
  getValues: UseFormGetValues<ItineraryData>;
  watch: UseFormWatch<ItineraryData>;
}

const ItineraryForm: React.FC<ItineraryFormProps> = ({
  control,
  handleSubmit,
  onSubmit,
  setValue,
  getValues,
  watch,
}) => {
  const [currentStep, setCurrentStep] = React.useState(1);
  const totalSteps = 10;

  const steps = [
    { id: 1, title: 'Basic Information', component: BasicInfoForm },
    { id: 2, title: 'Itinerary Days', component: DaysForm },
    { id: 3, title: 'Flights', component: FlightsForm },
    { id: 4, title: 'Hotels', component: HotelsForm },
    { id: 5, title: 'Payment Plan', component: PaymentForm },
    { id: 6, title: 'Visa Details', component: VisaForm },
    { id: 7, title: 'Important Notes', component: NotesForm },
    { id: 8, title: 'Scope of Service', component: ServicesForm },
    { id: 9, title: 'Inclusions', component: InclusionsForm },
    { id: 10, title: 'Activities', component: ActivitiesForm },
  ];

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const CurrentComponent = steps[currentStep - 1].component;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Step {currentStep} of {totalSteps}
          </span>
          <span className="text-sm text-gray-500">
            {Math.round((currentStep / totalSteps) * 100)}% Complete
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-vigovia-purple h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Title */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {steps[currentStep - 1].title}
        </h2>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <CurrentComponent
          control={control}
          setValue={setValue}
          getValues={getValues}
          watch={watch}
        />

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          {currentStep < totalSteps ? (
            <button
              type="button"
              onClick={nextStep}
              className="btn-primary"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              className="btn-primary"
            >
              Generate Itinerary
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ItineraryForm;
