import { FileText } from 'lucide-react';

export function NotesPage() {
  return (
    <div className="max-w-6xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-sm bg-tertiary/10 flex items-center justify-center">
          <FileText size={20} className="text-tertiary" strokeWidth={1.8} />
        </div>
        <h1 className="font-display text-h1 text-primary">Notes</h1>
      </div>
      <div className="bg-surface rounded-lg p-12 shadow-card text-center">
        <p className="text-body text-primary/40 font-body">Rich text editor coming soon...</p>
      </div>
    </div>
  );
}
