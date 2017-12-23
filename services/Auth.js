import {_} from 'underscore';

class Auth {
  constructor(db) {
    this.db = db;
    this.User = db.model('User');
  }

  login() {

  }

  register(data, res) {
    const {User} = this;
    emptyChecker(data, res);

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
        console.log(resp)
        res.json({
          error: false,
          message: 'accout created',
          data: resp,
          status: 200
        });
      }
    });
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
