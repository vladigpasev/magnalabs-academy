import { useEffect } from 'react';
import Router from 'next/router';
import axios from 'axios';
import Navbar from 'components/admin/Navbar';

export default function Admin() {
  useEffect(() => {
    axios
      .get('/api/admin/authenticated')
      .then((response) => {
        if (!response.data.authenticated) {
          Router.push('/admin/login');
        }
      })
      .catch(() => Router.push('/admin/login'));
  }, []);

  return (
    <div>
     <Navbar />
    </div>
  );
}
