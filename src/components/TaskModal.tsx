import { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase';
import { Button } from './ui/Button';
import { X } from 'lucide-react';

import { User } from 'firebase/auth';

export default function TaskModal({ dealId, user, onClose }: { dealId: string, user: User, onClose: () => void }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [assignedTo, setAssignedTo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'tasks'), {
        dealId,
        title: title.trim(),
        description: description.trim(),
        status: 'todo',
        priority,
        assignedTo: assignedTo.trim() || 'Unassigned',
        createdBy: user.uid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      onClose();
    } catch (err) {
      console.error("Error creating task:", err);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-md w-full p-6 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
        
        <h2 className="text-2xl font-bold uppercase tracking-wider text-black mb-6 border-b-2 border-black pb-2">Create Task</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold uppercase tracking-wider text-black mb-1">Title *</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border-2 border-black p-2 focus:outline-none focus:ring-2 focus:ring-[#CC0000]"
              required
              placeholder="e.g., Review Q3 Financials"
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold uppercase tracking-wider text-black mb-1">Description</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border-2 border-black p-2 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-[#CC0000]"
              placeholder="Add details about the task..."
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold uppercase tracking-wider text-black mb-1">Priority</label>
              <select 
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full border-2 border-black p-2 focus:outline-none focus:ring-2 focus:ring-[#CC0000] bg-white"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-bold uppercase tracking-wider text-black mb-1">Assignee</label>
              <input 
                type="text" 
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="w-full border-2 border-black p-2 focus:outline-none focus:ring-2 focus:ring-[#CC0000]"
                placeholder="e.g., AI Analyst"
              />
            </div>
          </div>
          
          <div className="pt-4 flex flex-col sm:flex-row justify-end gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || !title.trim()}
              className="bg-[#CC0000] text-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] transition-all w-full sm:w-auto"
            >
              {isSubmitting ? 'Creating...' : 'Create Task'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
