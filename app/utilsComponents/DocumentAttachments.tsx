"use client";

import { useRef, useState } from "react";
import { Download, Eye, FileText, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { DocumentAttachment } from "@/app/types";
import { uploadService } from "@/app/services/upload/upload.service";
import toast from "react-hot-toast";

function formatFileSize(size: number) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

interface DocumentAttachmentsFieldProps {
  attachments: DocumentAttachment[];
  onChange: (attachments: DocumentAttachment[]) => void;
  maxFiles?: number;
}

export default function DocumentAttachmentsField({
  attachments,
  onChange,
  maxFiles = 10,
}: DocumentAttachmentsFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [removingFileName, setRemovingFileName] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (attachments.length >= maxFiles) {
      toast.error(`Maximum ${maxFiles} files allowed`);
      return;
    }

    setUploading(true);
    try {
      const uploaded = await uploadService.uploadPurchaseDocument(file);
      onChange([...attachments, uploaded]);
      toast.success("Reference uploaded");
    } catch (err: unknown) {
      const ax = err as { response?: { data?: { message?: string } } };
      toast.error(ax.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async (file: DocumentAttachment) => {
    if (removingFileName) return;

    setRemovingFileName(file.fileName);
    try {
      await uploadService.deletePurchaseDocument(file.fileName);
      onChange(attachments.filter((item) => item.fileName !== file.fileName));
      toast.success("Reference removed");
    } catch (err: unknown) {
      const ax = err as { response?: { data?: { message?: string } } };
      toast.error(ax.response?.data?.message || "Could not remove file");
    } finally {
      setRemovingFileName(null);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
          Reference Documents
        </h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={uploading || attachments.length >= maxFiles}
          onClick={() => inputRef.current?.click()}
          className="gap-2"
        >
          <Upload size={14} />
          {uploading ? "Uploading..." : "Upload File"}
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,.webp,.gif,application/pdf,image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      <p className="text-xs text-gray-500 mb-4">
        Upload vendor bill, debit note, or other reference (PDF or image, max 10 MB each).
      </p>

      {attachments.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 px-4 py-8 text-center text-sm text-gray-400">
          No reference documents uploaded
        </div>
      ) : (
        <ul className="space-y-2">
          {attachments.map((file) => (
            <li
              key={file.fileName}
              className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 px-4 py-3"
            >
              <div className="flex min-w-0 items-center gap-3">
                <FileText size={18} className="shrink-0 text-gray-400" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-gray-800">
                    {file.originalName}
                  </p>
                  <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleRemove(file)}
                disabled={removingFileName === file.fileName}
                className="rounded-md border p-2 text-red-500 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Remove file"
              >
                <Trash2 size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

interface DocumentAttachmentsViewProps {
  attachments?: DocumentAttachment[];
}

export function DocumentAttachmentsView({ attachments = [] }: DocumentAttachmentsViewProps) {
  const [loadingKey, setLoadingKey] = useState<string | null>(null);

  if (!attachments.length) {
    return (
      <p className="text-sm text-gray-400">No reference documents attached.</p>
    );
  }

  const handleView = async (file: DocumentAttachment) => {
    setLoadingKey(`${file.fileName}-view`);
    try {
      await uploadService.viewPurchaseDocument(file);
    } catch {
      toast.error("Could not open document");
    } finally {
      setLoadingKey(null);
    }
  };

  const handleDownload = async (file: DocumentAttachment) => {
    setLoadingKey(`${file.fileName}-download`);
    try {
      await uploadService.downloadPurchaseDocument(file);
    } catch {
      toast.error("Could not download document");
    } finally {
      setLoadingKey(null);
    }
  };

  return (
    <ul className="space-y-2">
      {attachments.map((file) => (
        <li
          key={file.fileName}
          className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-gray-200 px-4 py-3"
        >
          <div className="flex min-w-0 items-center gap-3">
            <FileText size={18} className="shrink-0 text-gray-400" />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-gray-800">
                {file.originalName}
              </p>
              <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={loadingKey !== null}
              onClick={() => handleView(file)}
              className="gap-1"
            >
              <Eye size={14} />
              {loadingKey === `${file.fileName}-view` ? "Opening..." : "View"}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={loadingKey !== null}
              onClick={() => handleDownload(file)}
              className="gap-1"
            >
              <Download size={14} />
              {loadingKey === `${file.fileName}-download` ? "Saving..." : "Download"}
            </Button>
          </div>
        </li>
      ))}
    </ul>
  );
}
