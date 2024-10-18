import React, { useState } from 'react';
import { Flex, Button, Input, Heading, Tabs, TabList, TabPanels, TabPanel, Tab, Text } from '@chakra-ui/react';
import axios from 'axios'; // Import Axios
import ForgotPasswordModal from './ForgotPassword';
import './LoginRegisterForm.css';
import { useContextProvider } from '../../ContextProvider';

// Define interfaces for form values and errors
interface FormValues {
  email: string; // Use email for both login and registration
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
}

function LoginRegisterForm() {
  const { token, setToken, clearToken, setUserId, setCartItems, isForgotPasswordOpen, setIsForgotPasswordOpen } = useContextProvider();

  const [formValues, setFormValues] = useState<FormValues>({
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [activeTab, setActiveTab] = useState<number>(0); // 0 for Login, 1 for Register

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPassword = (password: string) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    return passwordRegex.test(password);
  };

  const validate = (): FormErrors => {
    let errors: FormErrors = {};
    if (activeTab === 1) { // Only validate for register tab
      if (!formValues.email) {
        errors.email = 'Email is required';
      } else if (!isValidEmail(formValues.email)) {
        errors.email = 'Invalid email format';
      }

      if (!formValues.password) {
        errors.password = 'Password is required';
      } else if (!isValidPassword(formValues.password)) {
        errors.password = 'Password must be at least 6 characters long, contain an uppercase letter, a lowercase letter, a number, and a special character.';
      }

      if (formValues.confirmPassword !== formValues.password) {
        errors.confirmPassword = 'Passwords do not match';
      }
    }

    return errors;
  };

  const handleRegister = async () => {
    try {
      const response = await axios.post('https://localhost:7218/register', {
        email: formValues.email,
        password: formValues.password,
      });
      console.log('Registration successful:', response.data);
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('https://localhost:7218/login', {
        email: formValues.email,
        password: formValues.password,
      });
      
      // Check the response to see if it contains the token
      if (response.data && response.data.accessToken) {
        const accessToken = response.data.accessToken; // Get token directly from response
        setToken(accessToken); // Store token using setToken

        // Fetch user ID using the new token
        const responseUserId = await axios.get('https://localhost:7218/api/Users/UserId', {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Use the new token here
          }
        });
        if (responseUserId.data) {
          setUserId(responseUserId.data);
        } else {
          console.error("UserId not found in the response:", responseUserId.data);
        }
      } else {
        console.error("Token not found in response:", response.data);
      }

      console.log('Login successful:', response.data);
    } catch (error) {
      console.error('Login error:', error);
    }
  };
  
  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const errors = validate();
    setFormErrors(errors); // Update errors state

    if (Object.keys(errors).length === 0) {
      if (activeTab === 0) {
        handleLogin(); // Login
      } else {
        handleRegister(); // Register
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value
    });
  };

  const handleTabChange = (index: number) => {
    setActiveTab(index);
    setFormErrors({}); // Reset errors when switching tabs
  };

  const handleLogout = () => {
    clearToken(); // Clear the token
    setCartItems([]);
    setFormValues({ email: '', password: '', confirmPassword: '' }); // Reset form values
  };

  return (
    <div className='form'>
      {token ? ( // Conditional rendering based on the token state
        <Flex direction="column" alignItems="center">
          <Heading as="h2" size="lg" textAlign="center" mb="6" color="black">Welcome!</Heading>
          <Button onClick={handleLogout} colorScheme="red" background='rgb(76, 76, 255)' color="white">Logout</Button>
        </Flex>
      ) : (
        <Tabs variant="enclosed" isFitted onChange={handleTabChange} index={activeTab}>
          <TabList mb="1em" ml="5px">
            <Tab className='tab'>Login</Tab>
            <Tab className='tab'>Register</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <Heading as="h2" size="lg" textAlign="center" mb="6">Login</Heading>
              <Input 
                name="email" 
                className="input-field" 
                placeholder="Email" 
                mb="4" 
                value={formValues.email}
                onChange={handleInputChange}
              />
              <Input 
                name="password"
                className="input-field" 
                placeholder="Password" 
                type="password" 
                mb="4" 
                value={formValues.password}
                onChange={handleInputChange}
              />
              <Button 
                className="submit-btn" 
                mb="4" 
                onClick={handleSubmit}
              >
                Login
              </Button>
            </TabPanel>

            <TabPanel>
              <Heading as="h2" size="lg" textAlign="center" mb="6">Register</Heading>
              <Input 
                name="email" 
                className="input-field" 
                placeholder="Email" 
                mb="4" 
                value={formValues.email}
                onChange={handleInputChange}
              />
              {formErrors.email && <Text color="red" fontSize="sm">{formErrors.email}</Text>}
              
              <Input 
                name="password"
                className="input-field" 
                placeholder="Password" 
                type="password" 
                mb="4" 
                value={formValues.password}
                onChange={handleInputChange}
              />
              {formErrors.password && <Text color="red" fontSize="sm">{formErrors.password}</Text>}
              
              <Input 
                name="confirmPassword"
                className="input-field" 
                placeholder="Confirm Password" 
                type="password" 
                mb="4" 
                value={formValues.confirmPassword}
                onChange={handleInputChange}
              />
              {formErrors.confirmPassword && <Text color="red" fontSize="sm">{formErrors.confirmPassword}</Text>}
              
              <Button className="submit-btn" onClick={handleSubmit}>Register</Button>
            </TabPanel>
            <Button 
                onClick={() => setIsForgotPasswordOpen(true)} 
                variant="link" 
                colorScheme="blue"
                background={'transparent'}
                color={'black'}
                marginLeft={90}
              >
                Forgot Password?
              </Button>
          </TabPanels>
        </Tabs>
      )}
      {isForgotPasswordOpen && <ForgotPasswordModal />}
    </div>
  );
}

export default LoginRegisterForm;