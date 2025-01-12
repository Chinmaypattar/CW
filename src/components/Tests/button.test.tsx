import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import  {Button}  from '../Button'; // Adjust the path to your component

describe('Button Component', () => {
  it('renders the button with the correct label', () => {
    render(<Button label="Click Me" />);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('applies primary variant styles by default', () => {
    render(<Button label="Primary Button" />);
    const button = screen.getByText('Primary Button');
    expect(button).toHaveClass('bg-blue-600 text-white');
  });

  it('applies secondary variant styles when specified', () => {
    render(<Button label="Secondary Button" variant="secondary" />);
    const button = screen.getByText('Secondary Button');
    expect(button).toHaveClass('bg-gray-100 text-gray-700');
  });

  it('triggers the onClick handler when clicked', () => {
    const handleClick = vi.fn();
    render(<Button label="Click Me" onClick={handleClick} />);
    const button = screen.getByText('Click Me');
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('does not trigger onClick when disabled', () => {
    const handleClick = vi.fn();
    render(<Button label="Disabled Button" onClick={handleClick} isDisabled />);
    const button = screen.getByText('Disabled Button');
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('renders with an icon if provided', () => {
    render(
      <Button label="With Icon" icon={<span data-testid="icon">🔔</span>} />
    );
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('applies custom classes', () => {
    render(<Button label="Custom Button" customClasses="custom-class" />);
    const button = screen.getByText('Custom Button');
    expect(button).toHaveClass('custom-class');
  });

  it('sets the correct button type', () => {
    render(<Button label="Submit Button" type="submit" />);
    const button = screen.getByText('Submit Button');
    expect(button).toHaveAttribute('type', 'submit');
  });
});
