import { useEffect, useState } from 'react';
import { Plus, Clock } from 'lucide-react';
import { TimerList } from './components/TimerList';
import { Toaster } from 'sonner';
import { Button } from './components/Button';
import { useDispatch } from 'react-redux';
import { loadTimersFromLocalStorage } from './utils/localStorage';
import { useTimerStore } from './store/useTimerStore';
import { TimerModal } from './components/AddEditTimerModal';

function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toasterPosition, setToasterPosition] = useState<'top-right' | 'bottom-center'>('top-right');
  const dispatch = useDispatch();
  const { setTimersFromLocalStorage } = useTimerStore();
  useEffect(() => {
    const updateToasterPosition = () => {
      if (window.innerWidth <= 768) {
        setToasterPosition('bottom-center'); // Mobile
      } else {
        setToasterPosition('top-right'); // Desktop
      }
    };

    updateToasterPosition();
    window.addEventListener('resize', updateToasterPosition);

    return () => {
      window.removeEventListener('resize', updateToasterPosition);
    };
  }, []);

  useEffect(() => {
    // Load timers from localStorage
    const timersFromStorage = loadTimersFromLocalStorage();

    // If there are any timers in localStorage, dispatch them to Redux
    if (timersFromStorage.length > 0) {
      dispatch(setTimersFromLocalStorage(timersFromStorage));
    }
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Toaster position={toasterPosition} />
      <div className="container mx-auto px-4 py-8">
        <div className='flex justify-between'>
          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Timer</h1>
          </div>

          <Button label='Add Timer' onClick={() => setIsModalOpen(true)} variant='primary' icon={<Plus className="w-5 h-5" />} customClasses='flex items-center gap-2 px-4 py-2' />


        </div>

        <TimerList />
        {isModalOpen && (
          <TimerModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        )}

      </div>
    </div>
  );
}

export default Home;