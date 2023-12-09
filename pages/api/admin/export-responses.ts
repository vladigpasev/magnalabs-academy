//@ts-ignore
import jwt from 'jsonwebtoken';
//@ts-ignore
import cookie from 'cookie';

import { createClient } from '@vercel/postgres';
import ExcelJS from 'exceljs';
/*@ts-ignore*/
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).end('Method Not Allowed');
  }

  function auth() {
    try {
      const cookies = cookie.parse(req.headers.cookie || '');
      const token = cookies.token;
      if (!token) throw new Error();

      jwt.verify(token, process.env.JWT_SECRET);
      return true;
    } catch (err) {
      return false;
    }
  }
  
  const isAuthenticated = auth();
  if (!isAuthenticated) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const surveyId = req.query.id;
  const client = createClient();

  try {
    await client.connect();

    // Fetch questions and responses
    const responsesQuery = `
      SELECT 
        u.user_name, u.surname, u.email, u.city, u.pharmacy, u.phone,
        q.questiontext, r.answertext
      FROM responses r
      JOIN users u ON r.userid = u.id
      JOIN questions q ON r.questionid = q.questionid
      WHERE r.formid = $1
      ORDER BY u.id, r.questionid
    `;
    const { rows } = await client.query(responsesQuery, [surveyId]);

    // Organize data by user
    const userData = {};
    rows.forEach(row => {
      const userKey = `${row.user_name} ${row.surname}`;
      /*@ts-ignore*/
      if (!userData[userKey]) {
        /*@ts-ignore*/
        userData[userKey] = {
          firstName: row.user_name,
          lastName: row.surname,
          email: row.email,
          city: row.city,
          pharmacy: row.pharmacy,
          phone: row.phone,
          responses: {}
        };
      }
      /*@ts-ignore*/
      userData[userKey].responses[row.questiontext] = row.answertext;
    });

    // Create a new Excel workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Survey Responses');

    // Determine columns from questions and add user info columns
    const questions = rows.map(row => row.questiontext).filter((value, index, self) => self.indexOf(value) === index);
    worksheet.columns = [
      { header: 'First Name', key: 'firstName', width: 15 },
      { header: 'Last Name', key: 'lastName', width: 15 },
      { header: 'Email', key: 'email', width: 25 },
      { header: 'City', key: 'city', width: 20 },
      { header: 'Pharmacy', key: 'pharmacy', width: 20 },
      { header: 'Phone', key: 'phone', width: 15 },
      ...questions.map(q => ({ header: q, key: q, width: 30 }))
    ];
    worksheet.getRow(1).font = { bold: true };

    // Add rows
    Object.values(userData).forEach(user => {
      const row = {
        /*@ts-ignore*/
        ...user,
        /*@ts-ignore*/
        ...user.responses
      };
      worksheet.addRow(row);
    });

    // Write to a buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // Set headers for downloading file
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="survey-${surveyId}-responses.xlsx"`);

    // Send the buffer
    res.end(buffer);
  } catch (error) {
    console.error('Error exporting survey responses:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await client.end();
  }
}
