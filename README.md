# ember-error-logger

ember-error-logger enables the handling and logging of uncaught errors. Handled error can be logged to a backend endpoint or passed through custom logic. By default, the addon includes consumers for local and remote logging of errors.

## How it works
Errors thrown are caught by listener bound to error producers (window, Ember ...).  
Errors handled by listeners are passed to various consumers which could log the error, render error page or
perform additional logic. Consumers and listeners are both fully extendable and customizable.


* `ember install ember-error-logger`

then throw error somewhere in application and watch the console.

## Configuration

Both `listeners` and `consumers` are enabled by defining an object with the property keys corresponding to the name/path of the object. To enable it with its default configuration, just set the property value to `true`, otherwise you may set it to a child object containing any valid configuration values.

### Error Listeners

Define an Ember Object in app/error-listeners to use as listeners.
Definition could be based on environment.
Object must extend `error-listeners/base-listener` object.

```javascript
// config/environment.js

if (environment === 'development' || environment === 'production') {
    ENV['ember-error-logger'].listeners = {
        'window-listener': true,
        'ember-listener': {
            ember: true,
            transitions: true,
            actions: true,
            rsvp: true
        }
    };
}
```
**Note:** the above configuration is the default for `development` and `production` environments.

### Error Consumers

Define services to use as listeners.
Definition could be based on environment.
Service must extend `error-consumers/base-consumer` object.
Consumers are executed in order.

```javascript
// config/environment.js

if (environment === 'development') {
    ENV['ember-error-logger'].consumers = {
        'console-consumer': true
    };
}

if (environment === 'production') {
    ENV['ember-error-logger'].consumers = [
       'api-consumer': {
           endpoint: 'http://your-api.com/error-event'
       }
    ];
}
```
**Note:** by default, only the `console-consumer` is enabled in `development`.

### api-consumer

The api-consumer allows errors to be easily sent to a backend along with some additional client information (user agent, resolution/viewport, current URL). In addition to adding the consumer to the `consumers` config object, you must define an `endpoint` in its child object which this information will be POST'ed to (see example consumers config above).

**IMPORTANT** The api-consumer uses ember-ajax to make the AJAX request. If you have extended the service with a custom host, you may need to adjust the `ember-error-logger.consumers.api-consumer.endpoint` value accordingly.

**IMPORTANT**
If you need to modify the payload that is sent to the endpoint, you can override the api consumer and change the `stringifyData` method.

### Handling all API related errors

Some API request errors may not be handled/logged by default (for example, if they are not triggered by a route transition). To log these errors, use the `ember-error-logger/mixins/log-api-errors` mixin in your ember-data adapter and/or ajax service. Additionally, this mixin will also stringify response payloads so that they can read in the error message (instead of just displaying as `[object Object]`).

## Ember-exex

Addon plays nicely with Exceptional Exceptions addon: https://github.com/janmisek/ember-exex

## Credits

Forked from and inspired by https://github.com/janmisek/ember-error-handler :-)
