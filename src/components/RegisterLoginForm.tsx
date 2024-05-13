import { useState } from 'react';

interface UserData{
  accessToken: string;
  email: string;
  id: string;
}

interface Props{
  handleUserData: (userData: UserData | undefined)=>void;
}

function RegisterLoginForm({handleUserData}: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loggedInUser, setLoggedInUser] = useState(null); // Track logged-in user
  const [errorMessage, setErrorMessage] = useState(''); // Track error message

  const [userData, setUserData] = useState<UserData>();

  const handleLogin = async (formData: any) => {
    try {
      const response = await fetch('https://localhost:7218/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        const user = await response.json();
        setUserData({accessToken: user.accessToken, email: user.email, id: user.id});
        handleUserData(userData);
        setErrorMessage('Login'); // Set success message
      } else {
        setErrorMessage('Wrong Data!'); // Set error message
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setErrorMessage('An error occurred. Please try again.'); // Set error message
    }
  };

  const handleLogout = () => {
    setLoggedInUser(null); // Clear logged-in user
    setEmail(''); // Clear email input
    setPassword(''); // Clear password input
    setErrorMessage(''); // Clear error message
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const formData = {
      email,
      password
    };

    handleLogin(formData);
  };

  return (
    <div>
      {loggedInUser ? (
        <div>
          <h2>Logged as {loggedInUser}</h2>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div>
          <h2>{errorMessage || 'Logged In :)'}</h2> {/* Display "Logged In :)" after successful login */}
          <form onSubmit={handleSubmit}>
            <label>Email:</label><br />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            /><br />
            <label>Password:</label><br />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            /><br />
            <button type="submit">Login</button>
          </form>
          <button onClick={() => handleLogin({ email, password })}>Register</button>
        </div>
      )}
    </div>
  );
}

export default RegisterLoginForm;
