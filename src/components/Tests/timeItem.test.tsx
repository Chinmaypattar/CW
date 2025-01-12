import { render, screen, fireEvent, act, cleanup } from '@testing-library/react';
import { TimerItem } from '../TimerItem';
import { vi } from 'vitest';
import { Timer } from '../../types/timer';
import { useTimerStore } from '../../store/useTimerStore';

// Mock external modules
vi.mock('../../store/useTimerStore', () => ({
  useTimerStore: vi.fn(), // Mock the hook
}));


vi.mock('../utils/time', () => ({
  formatTime: vi.fn((time) => `Formatted: ${time}`),
}));



const mockPlay = vi.fn();
const mockStop = vi.fn();

vi.mock('../../utils/audio', () => {
  console.log('Mock applied to TimerAudio');
  return {
    TimerAudio: {
      getInstance: vi.fn(() => ({
        play: mockPlay,
        stop: mockStop,
      })),
    },
  };
});


describe('TimerItem', () => {
  const timer: Timer = {
    id: '1',
    title: 'Test Timer',
    description: 'This is a test timer.',
    duration: 100,
    remainingTime: 100,
    isRunning: false,
    createdAt: Date.now()
  };

  const mockToggleTimer = vi.fn();
  const mockDeleteTimer = vi.fn();
  const mockRestartTimer = vi.fn();

  beforeEach(() => {
    vi.useFakeTimers();

    // Set the mock implementation for `useTimerStore`
    (useTimerStore as jest.Mock).mockReturnValue({
      timers: [],
      addTimer: vi.fn(),
      deleteTimer: mockDeleteTimer,
      toggleTimer: mockToggleTimer,
      restartTimer: mockRestartTimer,
      updateTimer: vi.fn(),
      editTimer: vi.fn(),
      setTimersFromLocalStorage: vi.fn(),
    });
  });

  afterEach(() => {
    cleanup(); // Ensure clean state
    vi.clearAllMocks();
    vi.useRealTimers(); // Restore real timers
  });

  it('renders the timer title and description correctly', () => {
    render(<TimerItem timer={timer} />);
    expect(screen.getByText(timer.title)).toBeInTheDocument();
    expect(screen.getByText(timer.description)).toBeInTheDocument();
  });

  it('toggles the timer state when the toggle button is clicked', async () => {
    render(<TimerItem timer={timer} />);

    const toggleButton = screen.getByTestId(`toggle-button`);
    await act(() => {
      fireEvent.click(toggleButton);
    });

    expect(mockToggleTimer).toHaveBeenCalledWith(timer.id);
  });

  // it('toggles the timer state when the toggle button is clicked', () => {
  //   const mockToggleTimer = vi.fn();


  //   render(<TimerItem timer={timer} />);

  //   // Find the button using its title
  //   const toggleButton = screen.getByTestId(`toggle-button`);
  //   expect(toggleButton).toBeInTheDocument();

  //   // Simulate a click on the button
  //   fireEvent.click(toggleButton);

  //   act(() => {
  //     vi.advanceTimersByTime(500); // Simulate 500ms passing
  //   });
  //   expect(screen.getByTestId(/pause-button/)).toBeInTheDocument()
  //   // Assert that the toggleTimer function was called
  //   // expect(mockToggleTimer).toHaveBeenCalledWith(timer.id);
  // });

  it('restarts the timer when the restart button is clicked', () => {
    render(<TimerItem timer={timer} />);

    const restartButton = screen.getByTitle('Restart Timer');
    fireEvent.click(restartButton);

    expect(mockRestartTimer).toHaveBeenCalledWith(timer.id);
  });

  it('deletes the timer when the delete button is clicked', () => {
    render(<TimerItem timer={timer} />);

    const deleteButton = screen.getByTitle('Delete Timer');
    fireEvent.click(deleteButton);

    expect(mockDeleteTimer).toHaveBeenCalledWith(timer.id);
  });

  it('shows the edit modal when the edit button is clicked', () => {
    render(<TimerItem timer={timer} />);

    // Find and click the Edit button
    const editButton = screen.getByTitle('Edit Timer');
    fireEvent.click(editButton);

    // Assert that the modal opens
    const modalTitle = screen.getByText(/edit timer/i);
    expect(modalTitle).toBeInTheDocument();


  });



  it('plays audio when the timer ends', async () => {
    const timer = {
      id: '1',
      title: 'Test Timer',
      description: 'This is a test timer.',
      duration: 60,
      remainingTime: 1, // Timer ends after 1 second
      isRunning: true,
      createdAt: Date.now(),
    };
  
    // Enable fake timers
    vi.useFakeTimers();
  
    render(<TimerItem timer={timer} />);
  
    // Start the timer
    await act(async () => {
      fireEvent.click(screen.getByTestId('toggle-button')); // Start the timer
    });
  
    // Fast-forward the timer to trigger the end
    act(() => {
      vi.advanceTimersByTime(1000); // Advance time by 1 second
      // Run all timers to ensure the end logic is processed
    });
  
    // Assert that the play method was called
    expect(mockPlay).toHaveBeenCalled();
  });
  

  it('opens the edit modal when the edit button is clicked', () => {
    const timer = {
      id: '1',
      title: 'Test Timer',
      description: 'This is a test timer.',
      duration: 60,
      remainingTime: 30,
      isRunning: false,
      createdAt: Date.now()
    };

    render(<TimerItem timer={timer} />);

    const editButton = screen.getByRole('button', { name: /edit/i });
    fireEvent.click(editButton);

    // Assert that the modal is open
    expect(screen.getByTestId('dialog')).toBeInTheDocument();

    // Close the modal
    const closeButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(closeButton);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('updates the remaining time when onUpdate is called from TimerModal', () => {
    const timer = {
      id: '1',
      title: 'Test Timer',
      description: 'This is a test timer.',
      duration: 60,
      remainingTime: 30,
      isRunning: false,
      createdAt: Date.now(),
    };

    render(<TimerItem timer={timer} />);

    const editButton = screen.getByRole('button', { name: /edit/i });
    fireEvent.click(editButton);

    // Mock the updated time value
    const updatedTime = 45;
    act(() => {
      fireEvent.change(screen.getByTestId(/hours/i), { target: { value: 0 } });
      fireEvent.change(screen.getByTestId(/minutes/i), { target: { value: 0 } });
      fireEvent.change(screen.getByTestId(/seconds/i), { target: { value: updatedTime } });

      // Simulate form submission
      fireEvent.click(screen.getByRole('button', { name: /save changes/i }));
    });

    // Assert the updated remaining time
    const remaining = screen.getByTestId(/remainingTime/)
    expect(remaining).toHaveTextContent(`${updatedTime}`)
    // expect(screen.getByText(`${updatedTime}`)).toBeInTheDocument();
  });
});

