import { useEffect } from 'react';
import { checkTokenOnAppStart } from '../utils/tokenUtils';

export const useTokenCheck = () => {
  useEffect(() => {
    // Kiểm tra token khi component mount
    const checkToken = async () => {
      await checkTokenOnAppStart();
    };

    checkToken();
  }, []);
};