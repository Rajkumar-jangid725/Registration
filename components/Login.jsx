'use client'

import React, { useState, useEffect } from 'react';
import bcrypt from "bcryptjs";
import Link from "next/link";
import "bootstrap/dist/css/bootstrap.css";


function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [alert, setAlert] = useState('');
  const [error, setError] = useState('')

  const login = async () => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.error) {
          setAlert("Email or password incorrect");
          return;
        }
        setUser(data);
        return;
      }
      const errorData = await response.json();
      setError(errorData.message);
    } catch (error) {
      console.error('An error occurred during login:', error);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    login();
  };

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => {
        setAlert('');
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [alert]);

  return (
    <>
      {alert && (
        <div className="alert alert-danger my=10" role="alert">
          {alert}
        </div>
      )}

      {user ? (
        <>
          <section className="vh-100 bg-image">
            <div className="container h-100">
              <div className="row d-flex justify-content-center align-items-center h-100">
                <div className="col-12 col-md-9 col-lg-7 col-xl-6">
                  <div className="card" style={{ borderRadius: "15px" }}>
                    <div className="card-body p-5">
                      <div>
                        <h2>Welcome, {user.data.firstName + ' ' + user.data.lastName}!</h2>
                        <p>Thank you for logging in.</p>
                      </div>

                    </div>

                  </div>
                  <div class="d-flex justify-content-center">
                    <a class="btn btn-primary m-2" href="http://localhost:3000">Sign Out</a>
                  </div>
                </div>

              </div>
            </div>
          </section>
        </>
      ) : (
        <section className="vh-100 bg-image">
          <div className="container h-100">
            <div className="row d-flex justify-content-center align-items-center h-100">
              <div className="col-12 col-md-9 col-lg-7 col-xl-6">
                <div className="card" style={{ borderRadius: "15px" }}>
                  <div className="card-body p-5">
                    <h2 className="text-uppercase text-center mb-4">Login</h2>
                    <form onSubmit={handleSubmit}>
                      <div className="form-outline mb-2">
                        <label className="form-label">Your Email</label>
                        <input
                          type="text"
                          value={email}
                          className="form-control"
                          placeholder="Enter email"
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                      <div className="form-outline mb-2">
                        <label className="form-label">Password</label>
                        <input
                          type="password"
                          value={password}
                          className="form-control"
                          placeholder="Enter password"
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                      <div className="d-flex justify-content-center">
                        <button type="submit">Login</button>
                        <span style={{ "paddingLeft": "40%" }}><Link href="/reset" className="fw-bold text-body"><u>Reset Password</u></Link></span>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}

export default LoginForm;