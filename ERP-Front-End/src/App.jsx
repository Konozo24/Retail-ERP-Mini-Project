import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";

// Placeholder Components for Routes (Testing Only)

// Main
const Dashboard = () => <div className="p-4 text-2xl font-bold">Dashboard Overview</div>;

// Inventory
const Products = () => <div className="p-4 text-2xl font-bold">Product List</div>;
const CreateProduct = () => <div className="p-4 text-2xl font-bold">Create New Product</div>;
const LowStocks = () => <div className="p-4 text-2xl font-bold">Low Stock Alerts</div>;
const Category = () => <div className="p-4 text-2xl font-bold">Product Categories</div>;
const PrintBarcode = () => <div className="p-4 text-2xl font-bold">Print Barcodes</div>;

// Stock
const ManageStock = () => <div className="p-4 text-2xl font-bold">Manage Stock Adjustments</div>;
const PurchaseOrder = () => <div className="p-4 text-2xl font-bold">Purchase Orders</div>;

// Sales
const Sales = () => <div className="p-4 text-2xl font-bold">Sales History</div>;

// Peoples
const Customers = () => <div className="p-4 text-2xl font-bold">Customer List</div>;
const Suppliers = () => <div className="p-4 text-2xl font-bold">Supplier List</div>;



export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      console.log('Login submitted:', { email, password, rememberMe });
      alert('Login successful! Check console for details.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '1rem',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        width: '100%',
        maxWidth: '28rem',
        padding: '2rem'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '4rem',
            height: '4rem',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '50%',
            marginBottom: '1rem'
          }}>
            <span style={{ fontSize: '2rem', color: 'white' }}>🔒</span>
          </div>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#1f2937',
            margin: '0'
          }}>Welcome Back</h1>
          <p style={{
            color: '#6b7280',
            marginTop: '0.5rem'
          }}>Sign in to your account</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label htmlFor="email" style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute',
                left: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '1.25rem'
              }}>📧</span>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                style={{
                  width: '100%',
                  paddingLeft: '2.5rem',
                  paddingRight: '1rem',
                  paddingTop: '0.75rem',
                  paddingBottom: '0.75rem',
                  border: errors.email ? '2px solid #ef4444' : '2px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'all 0.2s',
                  boxSizing: 'border-box'
                }}
                placeholder="you@example.com"
                onFocus={(e) => {
                  if (!errors.email) e.target.style.borderColor = '#667eea';
                }}
                onBlur={(e) => {
                  if (!errors.email) e.target.style.borderColor = '#d1d5db';
                }}
              />
            </div>
            {errors.email && (
              <p style={{
                marginTop: '0.25rem',
                fontSize: '0.875rem',
                color: '#ef4444'
              }}>{errors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute',
                left: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '1.25rem'
              }}>🔑</span>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                style={{
                  width: '100%',
                  paddingLeft: '2.5rem',
                  paddingRight: '3rem',
                  paddingTop: '0.75rem',
                  paddingBottom: '0.75rem',
                  border: errors.password ? '2px solid #ef4444' : '2px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'all 0.2s',
                  boxSizing: 'border-box'
                }}
                placeholder="Enter your password"
                onFocus={(e) => {
                  if (!errors.password) e.target.style.borderColor = '#667eea';
                }}
                onBlur={(e) => {
                  if (!errors.password) e.target.style.borderColor = '#d1d5db';
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '1.25rem',
                  padding: '0.25rem'
                }}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            {errors.password && (
              <p style={{
                marginTop: '0.25rem',
                fontSize: '0.875rem',
                color: '#ef4444'
              }}>{errors.password}</p>
            )}
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{
                  width: '1rem',
                  height: '1rem',
                  cursor: 'pointer'
                }}
              />
              <label htmlFor="remember" style={{
                marginLeft: '0.5rem',
                fontSize: '0.875rem',
                color: '#374151',
                cursor: 'pointer'
              }}>
                Remember me
              </label>
            </div>
            <a href="#" style={{
              fontSize: '0.875rem',
              color: '#667eea',
              textDecoration: 'none'
            }}
            onMouseEnter={(e) => e.target.style.color = '#5a67d8'}
            onMouseLeave={(e) => e.target.style.color = '#667eea'}>
              Forgot password?
            </a>
          </div>

          <button
            onClick={handleSubmit}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              padding: '0.75rem',
              borderRadius: '0.5rem',
              fontWeight: '600',
              fontSize: '1rem',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.02)';
              e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
            }}
          >
            Sign In
          </button>
        </div>

        <div style={{
          marginTop: '1.5rem',
          textAlign: 'center'
        }}>
          <p style={{
            color: '#6b7280',
            fontSize: '0.875rem'
          }}>
            Don't have an account?{' '}
            <a href="#" style={{
              color: '#667eea',
              fontWeight: '600',
              textDecoration: 'none'
            }}
            onMouseEnter={(e) => e.target.style.color = '#5a67d8'}
            onMouseLeave={(e) => e.target.style.color = '#667eea'}>
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
