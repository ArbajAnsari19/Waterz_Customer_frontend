import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../redux/store/hook';
import { yachtAPI } from '../api/yachts';
import { handleApiError } from '../api/errorHandler';
import { Yacht } from '../types/yachts';
import { CustomError } from '../types/error';
import { setLoading } from '../redux/slices/loadingSlice';

export const useTopYachts = () => {
  const [yachts, setYachts] = useState<Yacht[]>([]);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const fetchYachts = async () => {
    try {
      dispatch(setLoading(true));
      const data = await yachtAPI.getTopYachts();
      setYachts(data);
      setError(null);
    } catch (err) {
      setError('Failed to load yachts. Please try again later.');
      handleApiError(err as CustomError, dispatch, navigate);
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchYachts();
  }, []);

  return { yachts, error, refetch: fetchYachts };
};