import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function ResetPassword({ onBackToLogin }) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('https://ai-code-reviewer-bice-pi.vercel.app/auth/forgot-password', { email });
      toast.success('Verification code sent to your email!');
      setStep(2);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('https://ai-code-reviewer-bice-pi.vercel.app/auth/reset-password', { email, otp, password: newPassword });
      toast.success('Password reset successfully! You can now log in.');
      setTimeout(() => {
        onBackToLogin();
      }, 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid or expired OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#1e1e1e', color: '#fff' }}>
      <div style={{ background: '#2d2d2d', padding: '2rem', borderRadius: '8px', width: '320px', display: 'flex', flexDirection: 'column', gap: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }}>
        <h2 style={{ textAlign: 'center', margin: '0 0 10px 0', fontSize: '24px' }}>Reset Password</h2>

        {step === 1 ? (
          <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <p style={{ textAlign: 'center', fontSize: '14px', color: '#aaa', margin: 0 }}>Enter your email to receive a 6-digit verification code.</p>
            <input 
              type="email" 
              placeholder="Email Address" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              style={{ padding: '12px', borderRadius: '4px', border: '1px solid #444', background: '#1e1e1e', color: '#fff', fontSize: '16px' }} 
            />
            <button 
              type="submit" 
              disabled={loading} 
              style={{ padding: '12px', borderRadius: '4px', border: 'none', background: '#4CAF50', color: '#fff', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}
            >
              {loading ? 'Sending...' : 'Send Verification Code'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <p style={{ textAlign: 'center', fontSize: '14px', color: '#aaa', margin: 0 }}>Code sent to {email}</p>
            <input 
              type="text" 
              placeholder="Enter 6-digit OTP" 
              value={otp} 
              onChange={(e) => setOtp(e.target.value)} 
              required 
              maxLength="6"
              style={{ padding: '12px', borderRadius: '4px', border: '1px solid #444', background: '#1e1e1e', color: '#fff', fontSize: '16px', letterSpacing: '2px', textAlign: 'center' }} 
            />
            <input 
              type="password" 
              placeholder="Enter New Password" 
              value={newPassword} 
              onChange={(e) => setNewPassword(e.target.value)} 
              required 
              style={{ padding: '12px', borderRadius: '4px', border: '1px solid #444', background: '#1e1e1e', color: '#fff', fontSize: '16px' }} 
            />
            <button 
              type="submit" 
              disabled={loading} 
              style={{ padding: '12px', borderRadius: '4px', border: 'none', background: '#4CAF50', color: '#fff', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}
            >
              {loading ? 'Resetting...' : 'Confirm & Reset Password'}
            </button>
          </form>
        )}

        <p style={{ textAlign: 'center', fontSize: '14px', cursor: 'pointer', color: '#888', marginTop: '10px' }} onClick={onBackToLogin}>
          Back to Login
        </p>
      </div>
    </div>
  );
}