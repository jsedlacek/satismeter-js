var request = require('superagent');

var DEFAULT_SERVER = 'https://app.satismeter.com';

class Client {
  constructor({
    writeKey,
    server = DEFAULT_SERVER,
    method = 'In-app',
    userId,
    traits,
    trackAnonymous = false,
    preview = false,
    referrer = ''
  } = {}) {
    this.writeKey = writeKey;
    this.server = server;
    this.method = method;
    this.userId = userId;
    this.traits = traits;
    this.trackAnonymous = trackAnonymous;
    this.preview = preview;
    this.referrer = referrer;
  }

  survey(callback) {
    request
      .post(this.server + '/api/widget')
      .send({
        writeKey: this.writeKey,
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

  createResponse() {
    return new Response({
      client: this
    });
  }
}

class Response {
  constructor({
    client
  }) {
    this.client = client;
    this.buffer = [];
    this.responseUrl = null;
    this.authToken = null;
    this.saving = false;
  }

  save() {
    var data = {
      writeKey: this.client.writeKey,
      userId: this.client.userId,
      traits: this.client.traits,
      method: this.client.method,
      trackAnonymous: this.client.trackAnonymous,
      referrer: this.client.referrer,
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
