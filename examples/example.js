var satismeter = require('..');

var client = satismeter({
  writeKey: 'e149fH_6i',
  server: 'http://localhost:5000',
  userId: '011',
  traits: {
    email: 'james.bond@gov.uk',
    name: 'James Bond',
    createdAt: '2015-01-02T00:00:00.000Z'
  },
  referrer: window.location.href
});

var Widget = require('nps-widget');
var widget = new Widget();

client.survey(function(err, {visible}) {
  if (visible) {
    // visible flag says if the survey should be shown
    widget.show();
  }
});

var response = client.createResponse();

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
