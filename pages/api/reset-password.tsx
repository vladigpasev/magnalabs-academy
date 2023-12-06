import type { NextApiRequest, NextApiResponse } from 'next'
import { Mailer } from 'nodemailer-react'
import Translator from '../../src/modules/translator/Translator';

// TODO Complete SMTP server configuration
const transport = {
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "",
    pass: "",
  },
};

const defaults = {
  from: "",
};

const EmailTemplate = (props: {
  locale: string
}) => {
  const translator = new Translator();
  translator.locale = props.locale;
  return {
    subject: translator.t('emails.resetPassword.content'),
    body: (
      <div>
        { translator.t('emails.resetPassword.content') }
      </div>
    ),
  };
};

export const mailer = Mailer(
  { transport, defaults },
  { resetPasswordFormTemplate: EmailTemplate }
);

export default (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    return new Promise((resolve, reject) => {
      ['email', 'locale'].forEach(key => {
        if (!Object.keys(req.body).includes(key)) {
          reject({
            status: 402,
            body: {
              message: 'Error'
            }
          });
        }
      });
      const email = req.body.email;
      const locale = req.body.locale;
      mailer.send('resetPasswordFormTemplate', {
        locale
      }, {
        to: email
      }).then(() => {
        resolve({
          status: 200,
          body: {
            message: 'Success'
          }
        });
      }).catch(() => {
        reject({
          status: 500,
          body: {
            message: 'Error'
          }
        });
      });
    }).then((success: any) => {
      res.status(success.status).json(success.body);
    }).catch((error) => {
      res.status(error.status).json(error.body);
    });
  }
  else {
    res.status(500).json({ message: 'Error' });
  }
}
