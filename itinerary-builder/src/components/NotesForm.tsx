import { Plus, Trash2 } from 'lucide-react';
import React from 'react';
import { Control, UseFormGetValues, UseFormSetValue, UseFormWatch, useFieldArray } from 'react-hook-form';
import { ItineraryData, NoteData } from '../types';

interface NotesFormProps {
  control: Control<ItineraryData>;
  setValue: UseFormSetValue<ItineraryData>;
  getValues: UseFormGetValues<ItineraryData>;
  watch: UseFormWatch<ItineraryData>;
}

const NotesForm: React.FC<NotesFormProps> = ({ control, setValue, watch }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'importantNotes'
  });
  const notes = watch('importantNotes') || [];

  const addNote = () => {
    const newNote: NoteData = {
      id: Date.now().toString(),
      point: '',
      details: '',
    };
    append(newNote);
  };

  const removeNote = (index: number) => {
    remove(index);
  };

  const updateNote = (index: number, field: keyof NoteData, value: string) => {
    const updatedNotes = [...notes];
    updatedNotes[index] = { ...updatedNotes[index], [field]: value };
    setValue('importantNotes', updatedNotes);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Important Notes</h3>
        <button
          type="button"
          onClick={addNote}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Note
        </button>
      </div>

      {notes.map((note, index) => (
        <div key={note.id} className="border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-md font-medium text-gray-900">
              Note {index + 1}
            </h4>
            <button
              type="button"
              onClick={() => removeNote(index)}
              className="text-red-600 hover:text-red-800"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Point</label>
              <input
                type="text"
                className="form-input"
                value={note.point}
                onChange={(e) => updateNote(index, 'point', e.target.value)}
                placeholder="e.g., Cancellation Policy"
              />
            </div>

            <div>
              <label className="form-label">Details</label>
              <textarea
                className="form-input"
                rows={3}
                value={note.details}
                onChange={(e) => updateNote(index, 'details', e.target.value)}
                placeholder="Enter details for this point"
              />
            </div>
          </div>
        </div>
      ))}

      {notes.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No notes added yet. Click "Add Note" to add important notes.</p>
        </div>
      )}
    </div>
  );
};

export default NotesForm;
