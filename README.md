# satismeter-js
Javascript library for SatisMeter API

## Installation

```
npm install satismeter/satismeter-js
npm install satismeter/nps-widget
```

## Quick start

Configure SatisMeter client with your write key
```js
var satismeter = require('satismeter-js');

var client = satismeter({
  writeKey: 'ABCD'
});
```

Create a survey widget
```js
var Widget = require('nps-widget');
var widget = new Widget();
```

Identify user and get information about survey
```js
satismeter.survey({
  userId: '007',
  traits: {
    name: 'James Bond',
    email: 'james.bond@gov.uk',
    createdAt: '1953-01-01T00:00:00.000Z'
  }
}), function(err, survey) {
  if (survey.visible) {
    // visible flag says if the survey should be shown
    widget.show();
  }
});
```

Handle submit and dismiss events
```js

widget.on('submit', function() {
  survey.rating = widget.rating;
  survey.feedback = widget.feedback;
  survey.save();
});

widget.on('dismiss', function() {
  survey.dismissed = true;
  survey.save();
});
```
