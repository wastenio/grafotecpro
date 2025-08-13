import { useState } from 'react';
import { CommentsAPI } from '../client';

export const useComments = () => {
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchComments = async (params?: any) => {
    setLoading(true);
    try {
      const data = await CommentsAPI.list(params);
      setComments(data);
    } finally {
      setLoading(false);
    }
  };

  const createComment = async (payload: any) => {
    const data = await CommentsAPI.create(payload);
    setComments(prev => [...prev, data]);
    return data;
  };

  const updateComment = async (id: number, payload: any) => {
    const data = await CommentsAPI.update(id, payload);
    setComments(prev => prev.map(c => (c.id === id ? data : c)));
    return data;
  };

  const removeComment = async (id: number) => {
    await CommentsAPI.remove(id);
    setComments(prev => prev.filter(c => c.id !== id));
  };

  return { comments, loading, fetchComments, createComment, updateComment, removeComment };
};
