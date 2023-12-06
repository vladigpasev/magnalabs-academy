import { useState } from 'react';
import axios from 'axios';
import Router from 'next/router';

const LoginPage = (): JSX.Element => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  //@ts-ignore
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('/api/admin/login', { username, password });
      Router.push('/admin');
    } catch (error) {
      alert('Invalid credentials');
    }
  };

  return (
    <div>
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl font-bold">Login now!</h1>
            <p className="py-6">
              You need to log in to see this admin page
            </p>
          </div>
          <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
            <form className="card-body" onSubmit={handleSubmit}>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" className="input input-bordered" required />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="input input-bordered" required />
              </div>
              <div className="form-control mt-6">
                <button className="btn btn-primary">Login</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
