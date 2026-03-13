import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function ResetPassword({ token }) {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`https://ai-code-reviewer-bice-pi.vercel.app/auth/reset-password/${token}`, { password });
      toast.success('Password reset successfully! You can now log in.');
      setTimeout(() => {
        window.location.href = '/'; // Redirects back to login screen
      }, 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#1e1e1e', color: '#fff' }}>
      <form onSubmit={handleSubmit} style={{ background: '#2d2d2d', padding: '2rem', borderRadius: '8px', width: '320px', display: 'flex', flexDirection: 'column', gap: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }}>
        <h2 style={{ textAlign: 'center', margin: '0 0 10px 0', fontSize: '24px' }}>Set New Password</h2>
        
        <input 
          type="password" 
          placeholder="Enter new password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
          style={{ padding: '12px', borderRadius: '4px', border: '1px solid #444', background: '#1e1e1e', color: '#fff', fontSize: '16px' }} 
        />
        
        <button 
          type="submit" 
          disabled={loading} 
          style={{ padding: '12px', borderRadius: '4px', border: 'none', background: '#4CAF50', color: '#fff', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', marginTop: '10px' }}
        >
          {loading ? 'Saving...' : 'Save New Password'}
        </button>
      </form>
    </div>
  );
}