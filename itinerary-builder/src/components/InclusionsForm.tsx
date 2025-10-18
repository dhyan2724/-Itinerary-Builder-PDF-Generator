import { Plus, Trash2 } from 'lucide-react';
import React from 'react';
import { Control, UseFormGetValues, UseFormSetValue, UseFormWatch, useFieldArray } from 'react-hook-form';
import { InclusionData, ItineraryData } from '../types';

interface InclusionsFormProps {
  control: Control<ItineraryData>;
  setValue: UseFormSetValue<ItineraryData>;
  getValues: UseFormGetValues<ItineraryData>;
  watch: UseFormWatch<ItineraryData>;
}

const InclusionsForm: React.FC<InclusionsFormProps> = ({ control, setValue, watch }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'inclusions'
  });
  const inclusions = watch('inclusions') || [];

  const addInclusion = () => {
    const newInclusion: InclusionData = {
      id: Date.now().toString(),
      category: '',
      count: '',
      details: '',
      status: '',
    };
    append(newInclusion);
  };

  const removeInclusion = (index: number) => {
    remove(index);
  };

  const updateInclusion = (index: number, field: keyof InclusionData, value: string) => {
    const updatedInclusions = [...inclusions];
    updatedInclusions[index] = { ...updatedInclusions[index], [field]: value };
    setValue('inclusions', updatedInclusions);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Inclusion Summary</h3>
        <button
          type="button"
          onClick={addInclusion}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Inclusion
        </button>
      </div>

      {inclusions.map((inclusion, index) => (
        <div key={inclusion.id} className="border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-md font-medium text-gray-900">
              Inclusion {index + 1}
            </h4>
            <button
              type="button"
              onClick={() => removeInclusion(index)}
              className="text-red-600 hover:text-red-800"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="form-label">Category</label>
              <input
                type="text"
                className="form-input"
                value={inclusion.category}
                onChange={(e) => updateInclusion(index, 'category', e.target.value)}
                placeholder="e.g., Flights"
              />
            </div>

            <div>
              <label className="form-label">Count</label>
              <input
                type="text"
                className="form-input"
                value={inclusion.count}
                onChange={(e) => updateInclusion(index, 'count', e.target.value)}
                placeholder="e.g., 2"
              />
            </div>

            <div>
              <label className="form-label">Details</label>
              <input
                type="text"
                className="form-input"
                value={inclusion.details}
                onChange={(e) => updateInclusion(index, 'details', e.target.value)}
                placeholder="e.g., Round trip economy class flights"
              />
            </div>

            <div>
              <label className="form-label">Status/Remarks</label>
              <input
                type="text"
                className="form-input"
                value={inclusion.status}
                onChange={(e) => updateInclusion(index, 'status', e.target.value)}
                placeholder="e.g., Confirmed"
              />
            </div>
          </div>
        </div>
      ))}

      {inclusions.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No inclusions added yet. Click "Add Inclusion" to add inclusion details.</p>
        </div>
      )}
    </div>
  );
};

export default InclusionsForm;
