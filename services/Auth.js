import {_} from 'underscore';
import jwt from 'jsonwebtoken';
import Random from '@mobylogix/node-random';

class Auth {
  constructor(db, mailer) {
    this.db = db;
    this.mailerService = mailer;
    this.User = db.model('User');
  }

  login(data, res) {
    const {User} = this;
    let self = this;

    User.findOne(data, function(err, resp) {
      if (err) {
        res.json({
          error: true,
          verified: undefined,
          alreadyPresent: true,
          message: 'Error',
          data: err,
          status: 200
        });
      } else {
        if (!_.isEmpty(resp) && resp.verified === true) {
          let encryptUser = jwt.sign(JSON.stringify(resp), '6A586E327235753878214125442A472D');
          res.json({
            error: false,
            verified: true,
            message: 'loged in',
            data: encryptUser,
            status: 200
          });
        } else if (!_.isEmpty(resp) && resp.verified === false) {
          self.sendVerificationEmail(resp, res);
          res.json({
            error: false,
            verified: false,
            message: 'Email sent',
            data: {},
            status: 200
          });
        } else {
          res.json({
            error: false,
            verified: undefined,
            message: 'Email sent',
            data: {},
            status: 200
          });
        }
      }
    })
  }

  register(data, res) {
    const {User} = this;
    emptyChecker(data, res);

    new Promise((resolve, reject) => {
      return this.ifUserAlreadyPresent(data, resolve, reject);
    })
    .then((user) => {
      if (user) {
        res.json({
          error: false,
          alreadyPresent: true,
          message: 'account already present',
          data: user,
          status: 200
        });
      } else {
        this.registerUser(data, res);
      }
    })
    .catch(err => console.log(err));
  }

  ifUserAlreadyPresent(data, resolve, reject){
    const {User} = this;

    User.findOne({email: data.email}, function(err, resp) {
      if (err) {
        reject(err)
      } else {
        resolve(resp)
      }
    });
  }

  registerUser(data, res) {
    const {User} = this;
    let self = this;
    data['verified'] = false;
    data['token'] = Random.id()

    User.create(data, function(err, resp) {
      if (err) {
        console.log(err);
        res.json({
          error: true,
          message: 'something went wrong',
          data: err,
          status: 500
        });
      } else {
        self.sendVerificationEmail(resp, res);
        res.json({
          error: false,
          message: 'accout created',
          data: resp,
          status: 200
        });
      }
    });
  }

  sendVerificationEmail(user, res) {
    const {mailerService} = this;
    mailerService.verificationEmail(user, res);
  }

  verified(data, res) {
    const {User} = this;
    emptyChecker(data, res);
    delete data['iat'];

    User.findOne(data, function(err, resp) {
      if (err) {
        res.json({
          error: true,
          message: 'some thing went wrong try again',
          data: err,
          status: 500
        });
      } else {
        User.update({_id: data._id}, {$set: {verified: true}}, function(err, responce) {
          if (err) {
            res.json({
              error: true,
              message: 'some thing went wrong try again',
              data: err,
              status: 500
            });
          } else {
            User.findOne({_id: data._id}, function(err, result) {
              if (err) {
                res.json({
                  error: true,
                  message: 'some thing went wrong try again',
                  data: err,
                  status: 500
                });
              } else {
                let encryptUser = jwt.sign(JSON.stringify(result), '6A586E327235753878214125442A472D');

                res.json({
                  error: false,
                  message: 'account verified',
                  data: {user: encryptUser, verified: true},
                  status: 200
                });
              }
            });
          }
        });
      }
    })
  }
}

function emptyChecker(data, res) {
  let keys = _.keys(data);
  let values = _.values(data);

  if (_.compact(keys).length !== _.compact(values).length) {
    res.status(500).json({error: true, message: 'some record missing', data});
    return;
  }

}

export default Auth;
