import React, { useState } from 'react';
import { PromptRecord } from '../../types/prompt';
import { validateAndPrepareImport, ImportValidationReport } from '../../utils/csvParser';
import { X, Upload, FileText, CheckCircle2, AlertTriangle, AlertCircle, Download } from 'lucide-react';
import { useToast } from '../common/Toast';

interface BulkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCommitImport: (records: PromptRecord[]) => void;
  existingPrompts: PromptRecord[];
}

export const BulkImportModal: React.FC<BulkImportModalProps> = ({
  isOpen,
  onClose,
  onCommitImport,
  existingPrompts,
}) => {
  const { showToast } = useToast();

  const [rawText, setRawText] = useState('');
  const [fileName, setFileName] = useState('');
  const [autoAssignMissingIds, setAutoAssignMissingIds] = useState(true);
  const [report, setReport] = useState<ImportValidationReport | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (file: File) => {
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = e => {
      const content = e.target?.result as string;
      setRawText(content);
      runValidation(content, autoAssignMissingIds);
    };
    reader.readAsText(file);
  };

  const runValidation = (text: string, autoAssign: boolean) => {
    if (!text.trim()) {
      setReport(null);
      return;
    }

    // Try parsing as JSON first if starting with [
    if (text.trim().startsWith('[')) {
      try {
        const parsed = JSON.parse(text);
        if (Array.isArray(parsed)) {
          // Convert JSON records to CSV format for standard validator
          const simulatedCSV = [
            'id,title,prompt,category,image,status,model',
            ...parsed.map(item =>
              `"${item.id || ''}","${item.title || ''}","${(item.prompt || '').replace(/"/g, '""')}","${item.category || 'fashion'}","${item.image || ''}","${item.status || 'published'}","${item.model || ''}"`
            ),
          ].join('\n');

          const rep = validateAndPrepareImport(simulatedCSV, existingPrompts, autoAssign);
          setReport(rep);
          return;
        }
      } catch {
        // Fall back to standard CSV
      }
    }

    const rep = validateAndPrepareImport(text, existingPrompts, autoAssign);
    setReport(rep);
  };

  const handleDownloadSampleCSV = () => {
    const sample = `id,title,prompt,category,tags,image,alt,status,model
,"Ethereal Bioluminescent Bloom","Macro underwater photography of glowing neon corals --ar 4:3","nature","nature; ocean; macro","/images/07.jpg","Luminous glowing coral reef","published","Midjourney v6.1"
,"Cyberpunk Night Market","Rain slicked neo-Tokyo street with holographic ramen shop --ar 4:3","cyberpunk","cyberpunk; tokyo; neon","/images/05.jpg","Neon drenched cyberpunk alley","published","Flux.1 Dev"`;

    const blob = new Blob([sample], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample-prompt-import.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadValidationReport = () => {
    if (!report) return;

    let log = `=== BULK IMPORT VALIDATION REPORT ===\nGenerated: ${new Date().toISOString()}\nTotal Rows: ${report.totalRows}\nValid Rows: ${report.validRowsCount}\nInvalid Rows: ${report.invalidRowsCount}\nWarnings: ${report.warningsCount}\n\n`;

    report.parsedRows.forEach(r => {
      log += `[Row ${r.rowIndex}] ${r.status.toUpperCase()} - Title: "${r.data.title || 'Untitled'}" (ID: ${r.data.id || 'N/A'})\n`;
      if (r.issues.length > 0) {
        r.issues.forEach(issue => {
          log += `  -> ${issue.severity.toUpperCase()}: [${issue.field || 'general'}] ${issue.message}\n`;
        });
      }
      log += '\n';
    });

    const blob = new Blob([log], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `import-validation-report-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCommit = () => {
    if (!report || report.readyRecords.length === 0) return;
    onCommitImport(report.readyRecords);
    showToast(`Successfully imported ${report.readyRecords.length} prompt entries!`, 'success');
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in"
    >
      <div
        className="relative max-w-4xl w-full max-h-[92vh] flex flex-col rounded-3xl bg-obsidian-900 border border-obsidian-750 overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-obsidian-800 bg-obsidian-950/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">Bulk Prompt Import</h2>
              <p className="text-xs text-slate-400">Upload CSV or JSON files with full RFC 4180 validation.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-obsidian-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-grow overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* File Picker or Paste Area */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-6 flex flex-col gap-3">
              <label className="block text-xs font-mono uppercase text-slate-400">
                1. Select CSV or JSON File
              </label>

              <div
                className="border-2 border-dashed border-obsidian-750 hover:border-purple-500/50 rounded-2xl p-6 flex flex-col items-center justify-center text-center bg-obsidian-950/60 cursor-pointer transition-all"
                onClick={() => document.getElementById('bulk-file-input')?.click()}
              >
                <input
                  id="bulk-file-input"
                  type="file"
                  accept=".csv,.json"
                  className="hidden"
                  onChange={e => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileUpload(e.target.files[0]);
                    }
                  }}
                />
                <FileText className="w-8 h-8 text-purple-400 mb-2" />
                <span className="text-xs font-semibold text-slate-200">
                  {fileName ? fileName : 'Choose CSV / JSON file'}
                </span>
                <span className="text-[11px] text-slate-500 mt-1">
                  Drag and drop or browse from local drive
                </span>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  type="button"
                  onClick={handleDownloadSampleCSV}
                  className="text-brand-400 hover:underline flex items-center gap-1 font-mono text-[11px]"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Sample CSV Template</span>
                </button>
              </div>
            </div>

            <div className="md:col-span-6 flex flex-col gap-3">
              <label className="block text-xs font-mono uppercase text-slate-400">
                2. Import Settings
              </label>

              <div className="p-4 rounded-2xl bg-obsidian-950 border border-obsidian-800 space-y-3 text-xs">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoAssignMissingIds}
                    onChange={e => {
                      setAutoAssignMissingIds(e.target.checked);
                      if (rawText) runValidation(rawText, e.target.checked);
                    }}
                    className="mt-0.5 rounded bg-obsidian-900 border-obsidian-750 text-purple-600"
                  />
                  <div>
                    <span className="font-semibold text-slate-200 block">
                      Auto-assign missing IDs
                    </span>
                    <span className="text-[11px] text-slate-400 block mt-0.5 leading-relaxed">
                      Automatically allocates next unused numeric IDs (e.g. #09, #10) while preserving existing permanent IDs.
                    </span>
                  </div>
                </label>

                <div className="pt-2 border-t border-obsidian-850 text-[11px] text-slate-400 leading-relaxed">
                  ✓ Validates quotes, commas, and multiline prompts.<br />
                  ✓ Detects duplicate IDs against the live database.<br />
                  ✓ Discards no rows silently.
                </div>
              </div>
            </div>
          </div>

          {/* Validation Results Preview */}
          {report && (
            <div className="flex flex-col gap-3 pt-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-obsidian-800 pb-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold uppercase text-slate-300">
                    Validation Preview:
                  </span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {report.validRowsCount} Valid
                  </span>
                  {report.warningsCount > 0 && (
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {report.warningsCount} Warnings
                    </span>
                  )}
                  {report.invalidRowsCount > 0 && (
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      {report.invalidRowsCount} Invalid
                    </span>
                  )}
                </div>

                <button
                  onClick={handleDownloadValidationReport}
                  className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1 self-start sm:self-auto"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Validation Log</span>
                </button>
              </div>

              {/* Row-by-row table */}
              <div className="rounded-xl border border-obsidian-800 bg-obsidian-950 overflow-hidden max-h-56 overflow-y-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-obsidian-900 border-b border-obsidian-800 font-mono text-slate-400 text-[11px]">
                      <th className="p-2.5 w-16">Row</th>
                      <th className="p-2.5 w-20">ID</th>
                      <th className="p-2.5">Title</th>
                      <th className="p-2.5 w-28">Status</th>
                      <th className="p-2.5">Validation Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-obsidian-850">
                    {report.parsedRows.map((r, idx) => (
                      <tr key={idx} className="hover:bg-obsidian-900/50">
                        <td className="p-2.5 font-mono text-slate-500">#{r.rowIndex}</td>
                        <td className="p-2.5 font-mono font-semibold text-brand-300">
                          {r.data.id ? `#${r.data.id}` : '—'}
                        </td>
                        <td className="p-2.5 text-slate-200 font-medium truncate max-w-xs">
                          {r.data.title || '(Missing title)'}
                        </td>
                        <td className="p-2.5">
                          {r.status === 'valid' && (
                            <span className="inline-flex items-center gap-1 text-emerald-400 text-[11px] font-medium">
                              <CheckCircle2 className="w-3 h-3" /> Valid
                            </span>
                          )}
                          {r.status === 'has_warnings' && (
                            <span className="inline-flex items-center gap-1 text-amber-400 text-[11px] font-medium">
                              <AlertTriangle className="w-3 h-3" /> Warning
                            </span>
                          )}
                          {r.status === 'invalid' && (
                            <span className="inline-flex items-center gap-1 text-rose-400 text-[11px] font-medium">
                              <AlertCircle className="w-3 h-3" /> Error
                            </span>
                          )}
                        </td>
                        <td className="p-2.5 text-[11px] font-mono text-slate-400">
                          {r.issues.length > 0
                            ? r.issues.map(i => i.message).join(' | ')
                            : 'All checks passed'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 px-6 border-t border-obsidian-800 bg-obsidian-950/90 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-mono">
            {report ? `${report.readyRecords.length} records ready to import` : 'No file loaded'}
          </span>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-obsidian-800 text-slate-300 text-xs font-medium"
            >
              Cancel
            </button>
            <button
              disabled={!report || report.readyRecords.length === 0}
              onClick={handleCommit}
              className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs shadow-md transition-all"
            >
              Commit Import ({report?.readyRecords.length || 0})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
