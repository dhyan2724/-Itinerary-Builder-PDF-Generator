import { Plus, Trash2 } from 'lucide-react';
import React from 'react';
import { Control, UseFormGetValues, UseFormSetValue, UseFormWatch, useFieldArray } from 'react-hook-form';
import { ActivityData, ItineraryData } from '../types';

interface ActivitiesFormProps {
  control: Control<ItineraryData>;
  setValue: UseFormSetValue<ItineraryData>;
  getValues: UseFormGetValues<ItineraryData>;
  watch: UseFormWatch<ItineraryData>;
}

const ActivitiesForm: React.FC<ActivitiesFormProps> = ({ control, setValue, watch }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'activities'
  });
  const activities = watch('activities') || [];

  const addActivity = () => {
    const newActivity: ActivityData = {
      id: Date.now().toString(),
      title: '',
      description: '',
      city: '',
      type: '',
      timeRequired: '',
    };
    append(newActivity);
  };

  const removeActivity = (index: number) => {
    remove(index);
  };

  const updateActivity = (index: number, field: keyof ActivityData, value: string) => {
    const updatedActivities = [...activities];
    updatedActivities[index] = { ...updatedActivities[index], [field]: value };
    setValue('activities', updatedActivities);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Activity Table</h3>
        <button
          type="button"
          onClick={addActivity}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Activity
        </button>
      </div>

      {activities.map((activity, index) => (
        <div key={activity.id} className="border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-md font-medium text-gray-900">
              Activity {index + 1}
            </h4>
            <button
              type="button"
              onClick={() => removeActivity(index)}
              className="text-red-600 hover:text-red-800"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="form-label">City</label>
              <input
                type="text"
                className="form-input"
                value={activity.city || ''}
                onChange={(e) => updateActivity(index, 'city', e.target.value)}
                placeholder="e.g., Singapore"
              />
            </div>

            <div>
              <label className="form-label">Activity</label>
              <input
                type="text"
                className="form-input"
                value={activity.title}
                onChange={(e) => updateActivity(index, 'title', e.target.value)}
                placeholder="e.g., Gardens by the Bay"
              />
            </div>

            <div>
              <label className="form-label">Type</label>
              <select
                className="form-input"
                value={activity.type || ''}
                onChange={(e) => updateActivity(index, 'type', e.target.value)}
              >
                <option value="">Select Type</option>
                <option value="Sightseeing">Sightseeing</option>
                <option value="Adventure">Adventure</option>
                <option value="Leisure">Leisure</option>
                <option value="Cultural">Cultural</option>
                <option value="Nature">Nature</option>
                <option value="Entertainment">Entertainment</option>
              </select>
            </div>

            <div>
              <label className="form-label">Time Required</label>
              <input
                type="text"
                className="form-input"
                value={activity.timeRequired || ''}
                onChange={(e) => updateActivity(index, 'timeRequired', e.target.value)}
                placeholder="e.g., 3-4 Hours"
              />
            </div>

            <div className="md:col-span-2">
              <label className="form-label">Description</label>
              <textarea
                className="form-input"
                rows={3}
                value={activity.description}
                onChange={(e) => updateActivity(index, 'description', e.target.value)}
                placeholder="Enter activity description"
              />
            </div>
          </div>
        </div>
      ))}

      {activities.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No activities added yet. Click "Add Activity" to add activity details.</p>
        </div>
      )}
    </div>
  );
};

export default ActivitiesForm;
