Note: This is work in progress.

# satismeter-js
Javascript library for SatisMeter API

## Installation

```
npm install satismeter/satismeter-js
npm install satismeter/nps-widget
```

## Quick start

Configure satismeter client with your write key and user identity
```js
var satismeter = require('satismeter-js');

var client = satismeter({
  writeKey: 'ABCD',
  userId: '007',
  traits: {
    name: 'James Bond',
    email: 'james.bond@gov.uk',
    createdAt: '1953-01-01T00:00:00.000Z'
  }
});
```
Create widget
```js
var Widget = require('nps-widget');
var widget = new Widget();
```

Get information about survey
```js
client.survey(function(err, options) {
  if (options.visible) {
    // visible flag says if the survey should be shown
    widget.show();
  }
});
```

Handle submit and dismiss events
```js
var response = client.createResponse({userId: userId, traits: traits});

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
