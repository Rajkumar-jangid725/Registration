import { useState } from 'react';
import { useRouter } from 'next/router';

export default function PasswordReset() {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if the new password and confirm password match
        if (newPassword !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        // Update the password in the MongoDB database
        try {
            const response = await fetch('/api/updatePassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ newPassword, confirmPassword }),
            });

            if (response.ok) {
                alert('Password updated successfully');
                router.push('/passwordPage')
            } else {
                alert('Failed to update password');
            }
        } catch (error) {
            console.error('Error updating password:', error);
        }
    };

    return (
        <div>
            <h1>Password Reset</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    New Password:
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                </label>
                <br />
                <label>
                    Confirm New Password:
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </label>
                <br />
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}
