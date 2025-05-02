// src/pages/Login/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import "./Login.css";

const Login = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Basic validation
    if (!email.trim()) {
      setError("Please enter your email");
      return;
    }

    if (!password) {
      setError("Please enter your password");
      return;
    }

    // Set loading state
    setIsLoading(true);
    setError("");

    // For demo purposes, we'll accept any credentials
    // In a real app, you would validate against your backend
    setTimeout(() => {
      try {
        // Save to localStorage if "Remember me" is checked
        if (rememberMe) {
          localStorage.setItem("userEmail", email);
          localStorage.setItem("isRemembered", "true");
        }

        // Save auth state
        localStorage.setItem("isLoggedIn", "true");

        // Update auth state in the parent component
        setIsLoggedIn(true);

        // Add login-mode class to body when in login mode
        document.body.classList.remove("login-mode");

        // Navigate to home page
        navigate("/");
      } catch (error) {
        setError("An error occurred during login. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }, 1000);
  };

  // Add login-mode class to body when in login mode
  document.body.classList.add("login-mode");

  // Custom WhatsApp Logo SVG
  const WhatsAppLogo = () => (
    <svg
      width="40"
      height="40"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.9 12C3.9 10.29 4.29 8.6 5.03 7.05C5.77 5.51 6.84 4.17 8.15 3.16C9.46 2.15 10.97 1.49 12.57 1.25C14.17 1.01 15.79 1.2 17.29 1.79C18.79 2.38 20.12 3.35 21.16 4.62C22.21 5.89 22.93 7.4 23.26 9.03C23.58 10.66 23.5 12.36 23.02 13.94C22.55 15.52 21.69 16.95 20.53 18.11L13.26 22.13C12.97 22.3 12.63 22.38 12.3 22.37C11.96 22.36 11.63 22.26 11.35 22.08C11.06 21.91 10.83 21.66 10.68 21.37C10.53 21.07 10.47 20.73 10.5 20.4V18.43C8.47 18.43 6.52 17.61 5.07 16.16C3.61 14.7 2.8 12.75 2.8 10.73C2.8 9.53 3.17 8.37 3.85 7.43C4.53 6.49 5.48 5.83 6.56 5.57C6.87 5.5 7.18 5.53 7.47 5.65C7.75 5.77 8 5.98 8.17 6.24C8.35 6.52 8.43 6.84 8.41 7.17C8.38 7.49 8.25 7.8 8.04 8.04C7.52 8.62 7.23 9.35 7.2 10.12C7.17 10.88 7.4 11.63 7.86 12.25C8.31 12.87 8.95 13.32 9.69 13.52C10.43 13.73 11.22 13.67 11.92 13.37C12.21 13.24 12.54 13.21 12.85 13.27C13.16 13.33 13.45 13.49 13.67 13.72L15.67 15.95C15.89 16.18 16.01 16.48 16.02 16.79C16.02 17.1 15.92 17.4 15.72 17.65C15.51 17.89 15.22 18.07 14.9 18.14C14.58 18.22 14.24 18.19 13.94 18.07C12.84 17.61 11.65 17.37 10.45 17.37V19.3L17.4 15.47C18.21 14.65 18.82 13.65 19.16 12.56C19.51 11.47 19.59 10.31 19.39 9.18C19.19 8.05 18.72 6.99 18.02 6.1C17.32 5.21 16.41 4.51 15.38 4.07C14.35 3.63 13.22 3.45 12.11 3.56C10.99 3.67 9.91 4.06 8.97 4.7C8.03 5.34 7.26 6.2 6.74 7.21C6.21 8.22 5.94 9.35 5.97 10.5C5.97 12.04 6.58 13.52 7.65 14.59C8.72 15.66 10.19 16.27 11.74 16.27H12.8C13.07 16.27 13.33 16.38 13.52 16.57C13.71 16.76 13.82 17.02 13.82 17.3C13.82 17.58 13.71 17.84 13.52 18.03C13.33 18.22 13.07 18.33 12.8 18.33H11.74C9.62 18.3 7.61 17.45 6.12 15.96C4.63 14.47 3.79 12.46 3.76 10.35"
        fill="#25D366"
      />
    </svg>
  );

  return (
    <div className="login-container1">
      <div className="login-card1">
        <div className="login-header1">
          <div className="logo-container1">
            <WhatsAppLogo />
          </div>
          <h1>WhatsApp CRM</h1>
          <p>Sign in to your account to continue</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form className="login-form1" onSubmit={handleLogin}>
          <div className="form-group1">
            <label htmlFor="email">Email</label>
            <div className="input-with-icon1">
              <Mail size={18} className="input-icon" />
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group1">
            <label htmlFor="password">Password</label>
            <div className="input-with-icon1">
              <Lock size={18} className="input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="form-options">
            <div className="remember-me">
              <input
                type="checkbox"
                id="remember-me"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
              <label htmlFor="remember-me">Remember me</label>
            </div>
            <a href="#" className="forgot-password">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className={`login-button ${isLoading ? "loading" : ""}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                <span>Signing in...</span>
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
