import { useState } from 'react';
import { DocumentsAPI } from '../client';

export const useDocuments = () => {
  const [versions, setVersions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchVersions = async (documentId: number) => {
    setLoading(true);
    try {
      const data = await DocumentsAPI.versions(documentId);
      setVersions(data);
    } finally {
      setLoading(false);
    }
  };

  const uploadVersion = async (documentId: number, file: File, changelog?: string) => {
    const data = await DocumentsAPI.uploadVersion(documentId, file, changelog);
    setVersions(prev => [...prev, data]);
    return data;
  };

  const downloadVersion = async (versionId: number) => {
    return await DocumentsAPI.downloadVersion(versionId);
  };

  return { versions, loading, fetchVersions, uploadVersion, downloadVersion };
};
