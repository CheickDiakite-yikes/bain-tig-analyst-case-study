import { useState } from 'react';
import { updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Button } from './ui/Button';
import { Trash2, CheckSquare, Clock, AlertCircle } from 'lucide-react';

export default function TaskBoard({ tasks, dealId }: { tasks: any[], dealId: string }) {
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, status: string) => {
    e.preventDefault();
    if (!draggedTaskId) return;

    const task = tasks.find(t => t.id === draggedTaskId);
    if (task && task.status !== status) {
      try {
        await updateDoc(doc(db, 'tasks', draggedTaskId), {
          status,
          updatedAt: new Date().toISOString()
        });
      } catch (err) {
        console.error("Error updating task status:", err);
      }
    }
    setDraggedTaskId(null);
  };

  const handleDelete = async (taskId: string) => {
    if (confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteDoc(doc(db, 'tasks', taskId));
      } catch (err) {
        console.error("Error deleting task:", err);
      }
    }
  };

  const columns = [
    { id: 'todo', title: 'To Do', icon: <AlertCircle className="w-4 h-4" /> },
    { id: 'in-progress', title: 'In Progress', icon: <Clock className="w-4 h-4" /> },
    { id: 'done', title: 'Done', icon: <CheckSquare className="w-4 h-4" /> }
  ];

  return (
    <div className="flex gap-6 h-full overflow-x-auto pb-4">
      {columns.map(col => (
        <div 
          key={col.id} 
          className="flex-1 min-w-[300px] flex flex-col bg-gray-50 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, col.id)}
        >
          <div className="p-3 border-b-2 border-black bg-white flex items-center gap-2">
            {col.icon}
            <h3 className="font-bold uppercase tracking-wider text-black">{col.title}</h3>
            <span className="ml-auto bg-gray-200 text-black text-xs font-bold px-2 py-1 border-2 border-black">
              {tasks.filter(t => t.status === col.id).length}
            </span>
          </div>
          
          <div className="flex-1 p-3 overflow-y-auto flex flex-col gap-3">
            {tasks.filter(t => t.status === col.id).map(task => (
              <div 
                key={task.id}
                draggable
                onDragStart={(e) => handleDragStart(e, task.id)}
                className="bg-white border-2 border-black p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-move hover:translate-y-[1px] hover:translate-x-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all group flex flex-col"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className={`font-bold text-sm uppercase tracking-wider ${task.status === 'done' ? 'line-through text-gray-500' : 'text-black'}`}>{task.title}</h4>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 text-[#CC0000] hover:bg-red-50 border-2 border-transparent hover:border-[#CC0000]"
                    onClick={() => handleDelete(task.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
                
                {task.description && (
                  <p className="text-xs text-gray-600 font-medium mb-3 line-clamp-2">{task.description}</p>
                )}
                
                <div className="flex items-center justify-between mt-auto pt-2 border-t-2 border-gray-100">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 border-2 border-black ${
                    task.priority === 'high' ? 'bg-red-200 text-red-900' : 
                    task.priority === 'medium' ? 'bg-yellow-200 text-yellow-900' : 
                    'bg-green-200 text-green-900'
                  }`}>
                    {task.priority}
                  </span>
                  
                  {task.assignedTo && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 truncate max-w-[100px]">
                      {task.assignedTo}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
