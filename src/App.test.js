import React from 'react';
import { render, fireEvent ,waitFor} from '@testing-library/react';
import Registration from './components/Registration';
describe('Registration Component', () => {
  it('renders the registration form correctly', () => {
    const { getByPlaceholderText, getByText } = render(<Registration />);
    
    expect(getByPlaceholderText('Username')).toBeInTheDocument();
    expect(getByPlaceholderText('Password')).toBeInTheDocument();
    expect(getByPlaceholderText('Confirm Password')).toBeInTheDocument();
    expect(getByPlaceholderText('Display Name')).toBeInTheDocument();
    expect(getByText('Register')).toBeInTheDocument();
  });
  it('initializes form fields with empty values', () => {
    const { getByPlaceholderText } = render(<Registration />);
    
    expect(getByPlaceholderText('Username')).toHaveValue('');
    expect(getByPlaceholderText('Password')).toHaveValue('');
    expect(getByPlaceholderText('Confirm Password')).toHaveValue('');
    expect(getByPlaceholderText('Display Name')).toHaveValue('');
  });
  it('initializes with no error messages displayed', () => {
    const { queryByText } = render(<Registration />);
    
    expect(queryByText('All fields are required')).toBeNull();
    expect(queryByText('Passwords do not match')).toBeNull();
    expect(queryByText('Password must be at least 8 characters long')).toBeNull();
  });
  it('submits the form when all fields are valid', () => {
    const { getByPlaceholderText, getByText } = render(<Registration />);
    
    fireEvent.change(getByPlaceholderText('Username'), { target: { value: 'testuser' } });
    fireEvent.change(getByPlaceholderText('Password'), { target: { value: 'validpassword' } });
    fireEvent.change(getByPlaceholderText('Confirm Password'), { target: { value: 'validpassword' } });
    fireEvent.change(getByPlaceholderText('Display Name'), { target: { value: 'Test User' } });
  
    fireEvent.click(getByText('Register'));
  
    // Add expectation for what happens after successful registration, such as redirection or alert
  });
      
  it('submits the form with valid input', () => {
    // Mock URL.createObjectURL
    const createObjectURLMock = jest.fn();
    global.URL.createObjectURL = createObjectURLMock.mockReturnValue('dummyURL');
  
    const { getByPlaceholderText, getByText, getByLabelText } = render(<Registration />);
    
    fireEvent.change(getByPlaceholderText('Username'), { target: { value: 'testuser' } });
    fireEvent.change(getByPlaceholderText('Password'), { target: { value: 'password123' } });
    fireEvent.change(getByPlaceholderText('Confirm Password'), { target: { value: 'password123' } });
    fireEvent.change(getByPlaceholderText('Display Name'), { target: { value: 'Test User' } });
    
    // Simulate image upload
    const file = new File(['dummy image'], 'test.png', { type: 'image/png' });
    fireEvent.change(getByLabelText('File Upload'), { target: { files: [file] } });
  
    fireEvent.click(getByText('Register'));
  
    // Assert that no error message is displayed
    expect(() => getByText('All fields are required')).toThrow();
    expect(() => getByText('Passwords do not match')).toThrow();
    expect(() => getByText('Password must be at least 8 characters long')).toThrow();
  });  
  it('displays error if fields are missing', () => {
    const { getByText } = render(<Registration />);
    
    fireEvent.click(getByText('Register'));

    // Assert that error message for required fields is displayed
    expect(getByText('All fields are required')).toBeInTheDocument();
  });
  it('displays error if password is too short', async () => {
    const { getByPlaceholderText, getByText } = render(<Registration />);
    
    fireEvent.change(getByPlaceholderText('Password'), { target: { value: 'short' } });
    fireEvent.change(getByPlaceholderText('Confirm Password'), { target: { value: 'short' } });
  
    fireEvent.click(getByText('Register'));
  
    // Wait for the error message to appear
     waitFor(() => {
      expect(getByText('Password must be at least 8 characters long')).toBeInTheDocument();
    });
  });
})