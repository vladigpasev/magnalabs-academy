import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from 'components/admin/Navbar';
import Router from 'next/router';
import Link from 'next/link';

export default function Admin() {
  const [forms, setForms] = useState([]);

  useEffect(() => {
    axios
      .get('/api/admin/authenticated')
      .then((response) => {
        if (!response.data.authenticated) {
          Router.push('/admin/login');
        } else {
          fetchForms();
        }
      })
      .catch(() => Router.push('/admin/login'));
  }, []);

  const fetchForms = async () => {
    try {
      const response = await axios.get('/api/admin/forms');
      console.log(response);
      setForms(response.data);
    } catch (error) {
      console.error('Error fetching forms', error);
    }
  };
/*@ts-ignore*/
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`;
  };

  return (
    <div>
      <Navbar />
        <div>
            <Link href="/admin/surveys/new"><div className='btn btn-primary rounded mt-2'>New Form</div></Link>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Title</th>
                  <th>Created at</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {forms.map((form, index) => (
                  /*@ts-ignore*/
                  <tr key={form.formid} className={form.active ? "bg-base-200" : ""}>
                    {/*@ts-ignore*/}
                    <th>{form.formid}</th>
                    {/*@ts-ignore*/}
                    <td>{form.title}</td>
                    {/*@ts-ignore*/}
                    <td>{formatDate(form.createddate)}</td>
                    {/*@ts-ignore*/}
                    <td><Link className='link' href={`/admin/surveys/${form.formid}`}>View more</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
    </div>
  );
}
