Note: This is work in progress.

# satismeter-js
Javascript library for SatisMeter API

## Installation

```
npm install satismeter/satismeter-js
npm install satismeter/nps-widget
```

## Quick start

Configure satismeter client with your write key
```js
var satismeter = require('satismeter-js');

var client = satismeter({
  writeKey: 'ABCD'
});
```
Create widget
```js
var Widget = require('nps-widget');
var widget = new Widget();
```

Identify user and show widget
```js
var userId = '007';
var traits = {
  email: 'james.bond@gov.uk',
  createdAt: '2015-01-02T00:00:00.000Z'  
};

client.identify({userId: userId, traits: traits}, function(err, {visible}) {
  if (visible) {
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
