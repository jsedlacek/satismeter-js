var satismeter = require('..');

var client = satismeter({
  writeKey: 'ABCD'
});

var Widget = require('nps-widget');
var widget = new Widget();

var userId = '007';
var traits = {
  email: 'james.bond@gov.uk',
  createdAt: '2015-01-02T00:00:00.000Z'
};

client.identify({userId, traits}, function(err, {visible}) {
  if (visible) {
    // visible flag says if the survey should be shown
    widget.show();
  }
});

var response = client.createResponse({userId, traits});

widget.on('submit', function() {
  response.rating = widget.rating;
  response.feedback = widget.feedback;
  response.save();
});

widget.on('ratingSelect', function() {
  response.rating = widget.rating;
  response.save();
});

widget.on('dismiss', function() {
  response.dismissed = true;
  response.save();
});
