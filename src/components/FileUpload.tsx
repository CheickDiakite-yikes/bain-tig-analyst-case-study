import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { collection, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase';
import { User } from 'firebase/auth';
import { FileText, UploadCloud, File, FileSpreadsheet, FileImage, Trash2, Download } from 'lucide-react';
import { Button } from './ui/Button';

export default function FileUpload({ dealId, user, files }: { dealId: string, user: User, files: any[] }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [fileToDelete, setFileToDelete] = useState<any>(null);

  const confirmDelete = async () => {
    if (!fileToDelete) return;
    const file = fileToDelete;
    setFileToDelete(null);
    
    try {
      // 1. Delete from Firestore
      await deleteDoc(doc(db, 'files', file.id));
      
      // 2. Delete from Storage (if it's not a simulated URL)
      if (file.url && !file.url.startsWith('simulated-url')) {
        try {
          const storageRef = ref(storage, `deals/${dealId}/${file.name}`);
          await deleteObject(storageRef);
        } catch (storageErr: any) {
          // If the file doesn't exist in storage, that's fine, we still deleted the metadata
          if (storageErr.code !== 'storage/object-not-found') {
            console.error("Error deleting from storage:", storageErr);
          }
        }
      }
    } catch (err: any) {
      console.error("Error deleting file:", err);
      setError(`Failed to delete ${file.name}: ${err.message}`);
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploading(true);
    setError('');
    
    for (const file of acceptedFiles) {
      try {
        // Try to upload to Firebase Storage
        let url = '';
        try {
          const storageRef = ref(storage, `deals/${dealId}/${file.name}`);
          await uploadBytes(storageRef, file);
          url = await getDownloadURL(storageRef);
        } catch (storageErr: any) {
          console.error("Storage upload failed", storageErr);
          if (storageErr.code === 'storage/unauthorized') {
            throw new Error(`Permission denied. Please update your Firebase Storage rules in the Firebase Console to allow authenticated users to read and write.`);
          }
          throw new Error(`Storage upload failed: ${storageErr.message}`);
        }

        await addDoc(collection(db, 'files'), {
          dealId,
          name: file.name,
          type: file.type || 'application/octet-stream',
          size: file.size,
          url: url,
          uploadedBy: user.uid,
          uploadedAt: new Date().toISOString()
        });
      } catch (err: any) {
        console.error("Error uploading file:", err);
        setError(`Failed to upload ${file.name}: ${err.message}`);
      }
    }
    
    setUploading(false);
  }, [dealId, user.uid]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return <FileText className="w-8 h-8 text-red-500" />;
    if (type.includes('excel') || type.includes('spreadsheet')) return <FileSpreadsheet className="w-8 h-8 text-emerald-500" />;
    if (type.includes('image')) return <FileImage className="w-8 h-8 text-blue-500" />;
    return <File className="w-8 h-8 text-muted-foreground" />;
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="p-4 md:p-6 h-full flex flex-col space-y-4 md:space-y-6 overflow-y-auto bg-white">
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b-2 border-black pb-4 gap-2 shrink-0">
        <h2 className="text-base md:text-lg font-bold uppercase tracking-wider text-black">Data Room</h2>
        <p className="text-xs md:text-sm font-bold uppercase tracking-wider text-gray-500">Upload CIMs, financial models, and technical architecture docs.</p>
      </div>

      {error && (
        <div className="p-3 bg-red-100 border-2 border-[#CC0000] text-[#CC0000] font-bold uppercase tracking-wider text-sm shadow-[2px_2px_0px_0px_rgba(204,0,0,1)] shrink-0">
          {error}
        </div>
      )}

      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed border-black p-4 md:p-6 text-center cursor-pointer transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] shrink-0 ${
          isDragActive ? 'bg-red-50' : 'bg-white hover:bg-gray-50'
        }`}
      >
        <input {...getInputProps()} />
        <UploadCloud className={`w-8 h-8 md:w-10 md:h-10 mx-auto mb-2 md:mb-3 ${isDragActive ? 'text-[#CC0000]' : 'text-black'}`} />
        {isDragActive ? (
          <p className="text-[#CC0000] font-bold uppercase tracking-wider text-sm">Drop the files here ...</p>
        ) : (
          <div>
            <p className="text-black font-bold uppercase tracking-wider mb-1 text-sm">Drag & drop files here, or click</p>
            <p className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-gray-500">Supports PDF, PPTX, XLSX, DOCX up to 50MB</p>
          </div>
        )}
        {uploading && <p className="text-[#CC0000] font-bold uppercase tracking-wider mt-2 md:mt-4 animate-pulse text-sm">Uploading files...</p>}
      </div>

      <div className="flex-1 pb-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-black mb-4">Uploaded Files ({files.length})</h3>
        {files.length === 0 ? (
          <div className="text-center py-8 font-bold uppercase tracking-wider text-gray-500 border-2 border-dashed border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            No files uploaded yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {files.map(file => (
              <div key={file.id} className="flex items-start gap-4 p-4 border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all group relative">
                {file.type.startsWith('image/') ? (
                  <div className="w-10 h-10 shrink-0 border-2 border-black overflow-hidden bg-gray-100 flex items-center justify-center">
                    <img src={file.url} alt={file.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                ) : (
                  getFileIcon(file.type)
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold uppercase tracking-wider text-black truncate" title={file.name}>{file.name}</p>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mt-1">{formatSize(file.size)} • {new Date(file.uploadedAt).toLocaleDateString()}</p>
                </div>
                <div className="flex flex-col gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="h-8 w-8 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" onClick={() => window.open(file.url, '_blank')}>
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 border-2 border-[#CC0000] text-[#CC0000] shadow-[2px_2px_0px_0px_rgba(204,0,0,1)] hover:bg-red-50" onClick={(e) => { e.stopPropagation(); setFileToDelete(file); }}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Custom Confirmation Modal */}
      {fileToDelete && (
        <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4">
          <div className="bg-white border-4 border-black p-6 max-w-md w-full shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="text-xl font-bold uppercase tracking-wider text-black mb-4">Delete File</h3>
            <p className="mb-6 font-medium text-gray-700">
              Are you sure you want to delete <span className="font-bold">{fileToDelete.name}</span>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={() => setFileToDelete(null)} className="border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                Cancel
              </Button>
              <Button onClick={confirmDelete} className="bg-[#CC0000] hover:bg-red-700 text-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
