import debounce from 'lodash.debounce';
import { Timer } from '../types/timer';


const TIMERS_KEY = 'timers';

// Core save function
export const saveToLocalStorage = (timers: Timer[]) => {
  try {
    const plainTimers = timers.map(timer => ({ ...timer }));
    localStorage.setItem(TIMERS_KEY, JSON.stringify(plainTimers));
  } catch (error) {
    console.error('Failed to save timers to localStorage:', error);
  }
};



// Debounced version of saveToLocalStorage
export const saveTimersToLocalStorage = debounce((timers: Timer[]) => {
  saveToLocalStorage(timers);
}, 300); // Debounce interval in milliseconds

// Load timers from localStorage
export const loadTimersFromLocalStorage = (): Timer[] => {
  try {
    const storedTimers = localStorage.getItem(TIMERS_KEY);
    return storedTimers ? JSON.parse(storedTimers) : [];
  } catch (error) {
    console.error('Failed to load timers from localStorage:', error);
    return [];
  }
};

// Clear timers from localStorage
export const clearTimersFromLocalStorage = () => {
  try {
    localStorage.removeItem(TIMERS_KEY);
  } catch (error) {
    console.error('Failed to clear timers from localStorage:', error);
  }
};
