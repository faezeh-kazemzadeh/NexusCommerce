import { useEffect } from 'react';

const usePageTitle = (title) => {
    useEffect(() => {
        document.title = `${title} | My App`; 
    }, [title]);
};

export default usePageTitle;