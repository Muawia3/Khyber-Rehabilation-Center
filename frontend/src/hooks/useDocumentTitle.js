import { useEffect } from 'react';
import { APP_NAME } from '../utils/constants';

export const useDocumentTitle = (title) => {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title ? `${title} | ${APP_NAME}, Peshawar` : `${APP_NAME} | Peshawar`;

    return () => {
      document.title = previousTitle;
    };
  }, [title]);
};
