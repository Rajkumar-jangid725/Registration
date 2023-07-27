import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ResetSuccess from './ResetSuccess';

function Reset() {
    const [email, setEmail] = useState('');
    const [user, setUser] = useState(null);
    const [alert, setAlert] = useState('');
    const [error, setError] = useState('');

    const passReset = async () => {
        try {
            const response = await fetch('/api/reset', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data);
                if (data.error) {
                    setAlert("Email is incorrect");
                    return;
                }
                setUser(data);
                reset(email); // Send the reset password email
                return;
            }
            const errorData = await response.json();
            setError(errorData.message);
        } catch (error) {
            console.error('An error occurred during login:', error);
        }
    };

    const reset = async (email) => {
        try {
            const response = await fetch('/api/reset', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            if (response.ok) {
                console.log('Reset password email sent successfully');
            } else {
                console.error('Failed to send reset password email');
            }
        } catch (error) {
            console.error('An error occurred while sending reset password email:', error);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        passReset();
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
            <section className="vh-100 bg-image">
                <div className="container h-100">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col-12 col-md-9 col-lg-7 col-xl-6">
                            <div className="card" style={{ borderRadius: '15px' }}>
                                <div className="card-body p-5">
                                    {user ? (
                                        <ResetSuccess />
                                    ) : (
                                        <>
                                            <h2 className="text-uppercase text-center mb-4">Reset Password</h2>
                                            <form onSubmit={handleResetPassword}>
                                                <div className="form-outline mb-2">
                                                    <label className="form-label">Your Email</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Enter email"
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                    />
                                                </div>
                                                <div className="d-flex justify-content-center my-3">
                                                    <button type="submit">Reset</button>
                                                </div>
                                            </form>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default Reset;
