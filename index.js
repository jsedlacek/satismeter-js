var request = require('superagent');
var xtend = require('xtend');

var DEFAULT_SERVER = 'https://app.satismeter.com';

class Client {
  constructor({
    writeKey,
    server = DEFAULT_SERVER
  } = {}) {
    this.writeKey = writeKey;
    this.server = server;
  }

  survey(options, callback) {
    var survey = new Survey(xtend(options, {client: this}));
    survey.init(function(err, res) {
      if (err) {
        callback(err);
      }
      else {
        survey.visible = res.visible;
        callback(null, survey);
      }
    });
  }
}

class Survey {
  constructor({
    client,
    method = 'In-app',
    userId,
    traits,
    trackAnonymous = false,
    preview = false,
    referrer = ''
  }) {
    this.client = client;
    this.method = method;
    this.userId = userId;
    this.traits = traits;
    this.trackAnonymous = trackAnonymous;
    this.preview = preview;
    this.referrer = referrer;

    this.buffer = [];
    this.responseUrl = null;
    this.authToken = null;
    this.saving = false;
  }

  init(callback) {
    request
    .post(this.client.server + '/api/widget')
    .send({
      writeKey: this.client.writeKey,
      method: this.method,
      trackAnonymous: this.trackAnonymous,
      userId: this.userId,
      traits: this.traits,
      preview: this.preview,
      referrer: this.referrer
    })
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .end(function(err, res) {
      if (err) {
        callback(err);
      } else {
        callback(null, res.body.widget);
      }
    });
  }

  save() {
    var data = {
      writeKey: this.client.writeKey,
      userId: this.userId,
      traits: this.traits,
      method: this.method,
      trackAnonymous: this.trackAnonymous,
      referrer: this.referrer,
      rating: this.rating,
      feedback: this.feedback,
      dismissed: this.dismissed
    };

    if (this.saving) {
      this.buffer.push(data);
      return;
    }
    this.saving = true;

    var req;

    if (this.responseUrl) {
      req = request.put(this.responseUrl).set('auth-token', this.authToken);
    } else {
      req = request.post(this.client.server + '/api/responses');
    }

    req.send(data)
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .end((err, res) => {
      this.saving = false;
      if (err) {
        return console.log(err);
      }
      this.responseUrl = res.header.location;
      this.authToken = res.header['auth-token'];
      if (this.buffer.length > 0) {
        this.saveResponse(this.buffer.shift());
      }
    });
  }
}

function satismeter(options) {
  return new Client(options);
}

module.exports = satismeter;
