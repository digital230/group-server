/*
  this file contains all auth related function
*/
//service
import Auth from '../services/Auth';
import Mailer from '../services/Mailer';


export default function authentication({app, dbPromise}) {
  app.post('/register', function(req, res) {
    const mailer = new Mailer();
    const auth = new Auth(dbPromise, mailer);
    auth.register(req.body, res);
  });

  app.post('/emailVerification', function(req, res) {
    const mailer = new Mailer();
    const auth = new Auth(dbPromise, mailer);
    auth.verified(req.body, res);
  });

  app.post('/login', function(req, res) {
    const mailer = new Mailer();
    const auth = new Auth(dbPromise, mailer);
    auth.login(req.body, res);
  });
}
