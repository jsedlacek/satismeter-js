# satismeter-js
Javascript library for SatisMeter API

## Installation

```
npm install satismeter/satismeter-js
npm install satismeter/nps-widget
```

## Quick start

```js
// step 1 - configure satismeter client with your write key
var satismeter = require('satismeter-js');

var client = satismeter({
  writeKey: 'ABCD'
});

// step 2 - create widget
var Widget = require('nps-widget');
var widget = new Widget();

// step 3 - identify user and show widget
var userId = '007';
var traits = {
  email: 'james.bond@gov.uk',
  createdAt: '2015-01-02T00:00:00.000Z'  
};

client.identify(userId, traits, function(err, {visible}) {
  if (visible) {
    // visible flag says if the survey should be shown
    widget.show();
  }
});

// step 4 - show handle submit and dismiss events
var response = client.createResponse(userId, traits);

widget.on('submit', function() {
  response.rating = widget.rating;
  response.feedback = widget.feedback;
  response.save();
});

widget.on('dismiss', function() {
  response.dismissed = true;
  response.save();
});
```
