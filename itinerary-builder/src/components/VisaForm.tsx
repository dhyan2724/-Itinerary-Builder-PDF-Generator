import React from 'react';
import { Control, UseFormGetValues, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { ItineraryData } from '../types';

interface VisaFormProps {
  control: Control<ItineraryData>;
  setValue: UseFormSetValue<ItineraryData>;
  getValues: UseFormGetValues<ItineraryData>;
  watch: UseFormWatch<ItineraryData>;
}

const VisaForm: React.FC<VisaFormProps> = ({ control, watch }) => {
  const adults = watch('adults') || 0;

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Visa Details</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="form-label">Visa Type</label>
          <select
            className="form-input"
            {...control.register('visaType')}
          >
            <option value="E-Visa">E-Visa</option>
            <option value="Tourist Visa">Tourist Visa</option>
            <option value="Business Visa">Business Visa</option>
            <option value="Transit Visa">Transit Visa</option>
          </select>
        </div>

        <div>
          <label className="form-label">Pax Adult</label>
          <input
            type="text"
            className="form-input"
            value={`${adults} Pax`}
            readOnly
          />
        </div>

        <div>
          <label className="form-label">Processing Days</label>
          <input
            type="text"
            className="form-input"
            {...control.register('visaProcessingDays')}
            placeholder="e.g., 5-7 Days"
          />
        </div>
      </div>
    </div>
  );
};

export default VisaForm;
