import { useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import toast from 'react-hot-toast';
import { Megaphone, AlertTriangle } from 'lucide-react';
import { SharedData } from '@/types';

const FlashMessages = () => {
    const { flash } = usePage<SharedData>().props;

  useEffect(() => {
    if (flash.success) {
      toast.success(flash.success);
    }
    
    if (flash.error) {
      toast.error(flash.error);
    }
    
    if (flash.warning) {
      toast(flash.warning, {
        duration: 5000,
        icon: <AlertTriangle className="h-5 w-5 text-white" />,
        style: {
          background: '#F59E0B',
          color: 'white',
          borderRadius: '6px',
          padding: '12px 16px',
        },
      });
    }
    
    if (flash.info) {
      toast(flash.info, {
        duration: 4000,
        icon: <Megaphone className="h-5 w-5 text-white" />,
        style: {
          background: '#3B82F6',
          color: 'white',
          borderRadius: '6px',
          padding: '12px 16px',
        },
      });
    }
  }, [flash]);

  return null;
}

export default FlashMessages;