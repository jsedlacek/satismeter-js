var satismeter = require('..');

var client = satismeter({
  writeKey: 'e149fH_6i',
  server: 'http://localhost:5000'
});

var Widget = require('nps-widget');

client.survey({
  userId: '013',
  traits: {
    email: 'james.bond@gov.uk',
    name: 'James Bond',
    createdAt: '2015-01-02T00:00:00.000Z'
  },
  referrer: window.location.href
}, function(err, survey) {
  if (survey.visible) {
    // visible flag says if the survey should be shown
    var widget = new Widget();
    widget.show();

    widget.on('ratingSelect', function() {
      survey.rating = widget.rating;
      survey.save();
    });

    widget.on('submit', function() {
      survey.rating = widget.rating;
      survey.feedback = widget.feedback;
      survey.save();
    });

    widget.on('dismiss', function() {
      survey.dismissed = true;
      survey.save();
    });
  }
});
