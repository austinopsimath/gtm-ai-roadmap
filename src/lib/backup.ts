import { isBackupFile, type BackupFile, type Initiative } from '../types';

export function buildBackup(initiatives: Initiative[]): BackupFile {
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    initiatives,
  };
}

export function downloadBackup(initiatives: Initiative[]): void {
  const backup = buildBackup(initiatives);
  const json = JSON.stringify(backup, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const stamp = new Date().toISOString().slice(0, 10);
  a.download = `gtm-ai-roadmap-backup-${stamp}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function readBackupFile(file: File): Promise<BackupFile> {
  const text = await file.text();
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error('File is not valid JSON.');
  }
  if (!isBackupFile(parsed)) {
    throw new Error(
      'File does not look like a GTM AI Roadmap backup. Expected version 1 format.',
    );
  }
  return parsed;
}
