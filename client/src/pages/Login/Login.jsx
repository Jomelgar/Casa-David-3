import React, { useState } from 'react';
import './Login.css'; // Import CSS file for styling
import logo from '../../assets/logocasadavid.png';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simplified authentication logic (replace with actual authentication logic)
    if (username === 'admin' && password === 'password') {
      // Redirect to content page or dashboard
      window.location.href = '/content'; // Redirect to content page after successful login
    } else {
      alert('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className='login-container'>
      <div className='imgLogo'>
        <img src={logo} alt='' />
      </div>

      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <label>Username:</label>
          <input
            type='text'
            className='form-control'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className='form-group'>
          <label>Password:</label>
          <input
            type='password'
            className='form-control'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type='submit' className='btn btn-primary'>
          Login
        </button>
      </form>
      <span className="text-black font-bold">v1.1</span>
    </div>
  );
}

export default Login;
