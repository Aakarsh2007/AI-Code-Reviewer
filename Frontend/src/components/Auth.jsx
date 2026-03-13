import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function Auth({ setToken }) {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (isForgotMode) {
      try {
        await axios.post('https://ai-code-reviewer-bice-pi.vercel.app/auth/forgot-password', { email });
        toast.success('Reset link sent to your email!');
        setIsForgotMode(false);
        setEmail('');
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to send reset link');
      } finally {
        setLoading(false);
      }
      return;
    }

    const endpoint = isLogin ? '/auth/login' : '/auth/register';
    
    try {
      const res = await axios.post(`https://ai-code-reviewer-bice-pi.vercel.app${endpoint}`, { email, password });
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      toast.success(isLogin ? 'Logged in successfully!' : 'Account created successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setIsForgotMode(false);
    setEmail('');
    setPassword('');
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#1e1e1e', color: '#fff' }}>
      <form onSubmit={handleSubmit} style={{ background: '#2d2d2d', padding: '2rem', borderRadius: '8px', width: '320px', display: 'flex', flexDirection: 'column', gap: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }}>
        <h2 style={{ textAlign: 'center', margin: '0 0 10px 0', fontSize: '24px' }}>
          {isForgotMode ? 'Reset Password' : (isLogin ? 'Welcome Back' : 'Create Account')}
        </h2>
        
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
          style={{ padding: '12px', borderRadius: '4px', border: '1px solid #444', background: '#1e1e1e', color: '#fff', fontSize: '16px' }} 
        />
        
        {!isForgotMode && (
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            style={{ padding: '12px', borderRadius: '4px', border: '1px solid #444', background: '#1e1e1e', color: '#fff', fontSize: '16px' }} 
          />
        )}
        
        <button 
          type="submit" 
          disabled={loading} 
          style={{ padding: '12px', borderRadius: '4px', border: 'none', background: '#4CAF50', color: '#fff', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', marginTop: '10px' }}
        >
          {loading ? 'Processing...' : (isForgotMode ? 'Send Reset Link' : (isLogin ? 'Login' : 'Register'))}
        </button>
        
        {!isForgotMode && (
          <p style={{ textAlign: 'center', fontSize: '14px', cursor: 'pointer', color: '#888', marginTop: '10px' }} onClick={toggleMode}>
            {isLogin ? 'Need an account? ' : 'Already have an account? '}
            <span style={{ color: '#4CAF50', textDecoration: 'underline' }}>{isLogin ? 'Register' : 'Login'}</span>
          </p>
        )}

        {isLogin && !isForgotMode && (
           <p style={{ textAlign: 'center', fontSize: '14px', cursor: 'pointer', color: '#4CAF50', textDecoration: 'underline' }} onClick={() => setIsForgotMode(true)}>
             Forgot Password?
           </p>
        )}

        {isForgotMode && (
           <p style={{ textAlign: 'center', fontSize: '14px', cursor: 'pointer', color: '#888', marginTop: '10px' }} onClick={() => setIsForgotMode(false)}>
             Back to Login
           </p>
        )}
      </form>
    </div>
  );
}