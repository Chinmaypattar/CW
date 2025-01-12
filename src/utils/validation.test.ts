import { describe, it, expect, vi,afterEach } from 'vitest';
import { toast } from 'sonner';
import { validateTimerForm } from './validation';

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
  },
}));

describe('validateTimerForm', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return false and show an error if title is empty', () => {
    const data = { title: '', description: '', hours: 1, minutes: 0, seconds: 0 };
    expect(validateTimerForm(data)).toBe(false);
    expect(toast.error).toHaveBeenCalledWith('Title is required');
  });

  it('should return false and show an error if title exceeds 50 characters', () => {
    const data = { title: 'a'.repeat(51), description: '', hours: 1, minutes: 0, seconds: 0 };
    expect(validateTimerForm(data)).toBe(false);
    expect(toast.error).toHaveBeenCalledWith('Title must be less than 50 characters');
  });

  it('should return false and show an error if any time value is negative', () => {
    const data = { title: 'Test', description: '', hours: -1, minutes: 0, seconds: 0 };
    expect(validateTimerForm(data)).toBe(false);
    expect(toast.error).toHaveBeenCalledWith('Time values cannot be negative');
  });

  it('should return false and show an error if minutes or seconds exceed 59', () => {
    const data = { title: 'Test', description: '', hours: 0, minutes: 60, seconds: 0 };
    expect(validateTimerForm(data)).toBe(false);
    expect(toast.error).toHaveBeenCalledWith('Minutes and seconds must be between 0 and 59');
  });

  it('should return false and show an error if total time is 0', () => {
    const data = { title: 'Test', description: '', hours: 0, minutes: 0, seconds: 0 };
    expect(validateTimerForm(data)).toBe(false);
    expect(toast.error).toHaveBeenCalledWith('Please set a time greater than 0');
  });

  it('should return false and show an error if total time exceeds 24 hours', () => {
    const data = { title: 'Test', description: '', hours: 24, minutes: 0, seconds: 1 };
    expect(validateTimerForm(data)).toBe(false);
    expect(toast.error).toHaveBeenCalledWith('Timer cannot exceed 24 hours');
  });

  it('should return true for valid input', () => {
    const data = { title: 'Valid Timer', description: '', hours: 1, minutes: 30, seconds: 15 };
    expect(validateTimerForm(data)).toBe(true);
    expect(toast.error).not.toHaveBeenCalled();
  });
});
