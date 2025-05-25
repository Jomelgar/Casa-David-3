import {
  RiMailFill,
  RiLockFill,
  RiEyeFill,
  RiEyeCloseFill,
} from 'react-icons/ri';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

import logo from '../../assets/logocasadavid.png';
import authApi from '../../api/Auth.api';

import { PORT_API, URL_HOSTING } from '../../config';

function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      window.location.replace(`/`);
      //navigate('/');
    }
  }, []);


  const [data, setData] = useState({
    username: '',
    password: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await authApi.signInRequest(
        data.username,
        data.password
      );

      if (response.status === 201) {
        Cookies.set('token', response.data.token);
        window.location.href = '/'; // O la ruta que quieras
        setTimeout(() => {
          window.location.reload(); // Fuerza el refresh una vez llegada la nueva página
        }, 100);
      } else {
        setError('Credenciales Incorrectas');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setError('Internal server error', error);
    }
  };

  return (
    <div className='bg-white-100 p-8 rounded-xl shadow-2xl w-auto lg:w-[450px] text-center'>
      <div className='flex items-center justify-center py-8 px-4 mb-2'>
        <img src={logo} className='w-[170px] h-[150px]' alt='Logo' />
      </div>

      <h1 className='text-3xl uppercase font-bold tracking-[2px] bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent mb-14'>
        Iniciar Sesión
      </h1>
      <form className='bg-white-100 mb-16' onSubmit={handleSubmit}>
        <div className='relative mb-4'>
          <RiMailFill className='absolute top-1/2 -translate-y-1/2 left-2 text-blue-500' />
          <input
            type='text'
            className='py-3 px-4 pl-8 bg-white-500 w-full outline-none rounded-lg border-2 border-transparent focus:border-blue-500 transition-colors'
            placeholder='Usuario'
            value={data.username}
            onChange={(e) => setData({ ...data, username: e.target.value })}
          />
        </div>
        <div className='relative mb-10'>
          <RiLockFill className='absolute top-1/2 -translate-y-1/2 left-2 text-blue-500' />
          <input
            type={showPassword ? 'password' : 'text'}
            className='py-3 px-4 pl-8 bg-white-500 w-full outline-none rounded-lg border border-2 border-transparent focus:border-blue-500 transition-colors '
            placeholder='Contraseña'
            value={data.password}
            onChange={(e) => setData({ ...data, password: e.target.value })}
          />
          {showPassword ? (
            <RiEyeFill
              onClick={() => setShowPassword(!showPassword)}
              className='absolute top-1/2 -translate-y-1/2 right-2 hover:cursor-pointer'
            />
          ) : (
            <RiEyeCloseFill
              onClick={() => setShowPassword(!showPassword)}
              className='absolute top-1/2 -translate-y-1/2 right-2 hover:cursor-pointer'
            />
          )}
        </div>

        <div className=''>
          <button
            type='submit'
            className='bg-green-500 text-white-100  font-bold w-full mt-5 py-3 px-4 rounded-lg hover:text-green-800 transition-colors'
          >
            Ingresar
          </button>
        </div>
        {error && <p className='text-red-500 mt-2'>{error}</p>}
      </form>
      <span className="text-sm text-slate-600 italic">Versión 1.1.0</span>
    </div>
  );
}

export default Login;
