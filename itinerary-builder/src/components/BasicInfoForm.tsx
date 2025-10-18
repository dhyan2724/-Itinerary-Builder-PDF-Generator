import React from 'react';
import { Control, UseFormGetValues, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { ItineraryData } from '../types';

interface BasicInfoFormProps {
  control: Control<ItineraryData>;
  setValue: UseFormSetValue<ItineraryData>;
  getValues: UseFormGetValues<ItineraryData>;
  watch: UseFormWatch<ItineraryData>;
}

const BasicInfoForm: React.FC<BasicInfoFormProps> = ({ control, setValue, watch }) => {
  const adults = watch('adults') || 0;
  const children = watch('children') || 0;
  const infants = watch('infants') || 0;

  React.useEffect(() => {
    setValue('totalTravelers', adults + children + infants);
  }, [adults, children, infants, setValue]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="form-label">Traveler Name</label>
          <input
            type="text"
            className="form-input"
            {...control.register('travelerName', { required: 'Traveler name is required' })}
            placeholder="Enter traveler name"
          />
        </div>

        <div>
          <label className="form-label">Destination</label>
          <input
            type="text"
            className="form-input"
            {...control.register('destination', { required: 'Destination is required' })}
            placeholder="e.g., Singapore"
          />
        </div>

        <div>
          <label className="form-label">Duration</label>
          <input
            type="text"
            className="form-input"
            {...control.register('duration', { required: 'Duration is required' })}
            placeholder="e.g., 4 Days 3 Nights"
          />
        </div>

        <div>
          <label className="form-label">Departure From</label>
          <input
            type="text"
            className="form-input"
            {...control.register('departureFrom', { required: 'Departure location is required' })}
            placeholder="e.g., DELHI"
          />
        </div>

        <div>
          <label className="form-label">Departure To</label>
          <input
            type="text"
            className="form-input"
            {...control.register('departureTo', { required: 'Arrival location is required' })}
            placeholder="e.g., SINGAPORE"
          />
        </div>

        <div>
          <label className="form-label">Total Travelers</label>
          <input
            type="number"
            className="form-input"
            value={adults + children + infants}
            readOnly
          />
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Traveler Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="form-label">Adults</label>
            <input
              type="number"
              min="0"
              className="form-input"
              {...control.register('adults', { 
                required: 'Number of adults is required',
                min: { value: 1, message: 'At least 1 adult is required' }
              })}
            />
          </div>

          <div>
            <label className="form-label">Children</label>
            <input
              type="number"
              min="0"
              className="form-input"
              {...control.register('children')}
            />
          </div>

          <div>
            <label className="form-label">Infants</label>
            <input
              type="number"
              min="0"
              className="form-input"
              {...control.register('infants')}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicInfoForm;
