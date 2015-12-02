class Client {
  constructor({writeKey, server = 'https://app.satismeter.com'}) {
    this.writeKey = writeKey;
    this.server = server;
  }

  identify({userId, traits}, callback) {
    callback(null, {visible: true});
    console.log('identify', userId, traits);
  }

  createResponse() {
    return new Response({client: this});
  }
}

class Response {
  constructor({client}) {
    this.client = client;
  }

  save() {
    console.log('save');
  }
}


function satismeter({writeKey, server}) {
  return new Client({writeKey, server});
}

module.exports = satismeter;
