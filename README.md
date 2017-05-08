# Ember-error-logger - Error handling for ambitious web applications.

Addon handles uncatched errors. Handled error can be displayed on customizable error page
or passed through custom logic. By default addon includes consumers for local and remote logging of errors.

# How it works
Errors thrown are catched by listener bound to error producers (window, Ember ...).  
Errors handled by listeners are passed to various consumers which could log the error, render error page or
perform additional logic. Customers and listeners are fully customizable.

## Non catched error page shown in production environment  

![alt tag](https://raw.githubusercontent.com/Gavant/ember-error-logger/master/github/error-prod.png)

## Non catched error page shown in development environment  

![alt tag](https://raw.githubusercontent.com/Gavant/ember-error-logger/master/github/error-dev.png)


## Installation

* `ember install ember-error-logger`

then throw error somewhere in application and watch screen and console.

## Configuration

### configure listeners to use

Define services to use as listeners.
Definition could be based on environment.
Service must extend `base-listener` class.

```javascript
# config/environment.js

if (environment === 'development') {
  ENV['ember-error-logger'].listeners = [
      'service:ember-error-logger/listener/window-listener',
      'service:ember-error-logger/listener/ember-listener'
  ];
}
```

### configure consumers to use

Define services to use as listeners.
Definition could be based on environment.
Service must extend `base-consumer`class.
Consumers are executed in order.

```javascript
# config/environment.js

if (environment === 'development') {
   ENV['ember-error-logger'].consumers = [
     'service:ember-error-logger/consumer/wsod-consumer',
     'service:ember-error-logger/consumer/console-consumer'
   ];
}
```


### wsod-consumer - configure component shown when error is handled by environment

```javascript
# config/environment.js

{
  ember-error-logger: {
      "wsod-component-production": 'my-own-component-for-wsod-screen-production'
      "wsod-component-development": 'my-own-component-for-wsod-screen-development'
      "wsod-component-": 'my-own-component-for-wsod-screen'
  }
}
```

### api-consumer

The api-consumer allows errors to be easily sent to a backend along with some additional client information (user agent, resolution/viewport, current URL). In addition to adding the consumer to the `consumers` config array, you must define an endpoint which this information will be POST'ed to:

```javascript
# config/environment.js

if (environment === 'production') {
   ENV['ember-error-logger'].consumers = [
     'service:ember-error-logger/consumer/api-consumer'
   ];

   ENV['ember-error-logger'].logErrorsEndpoint = 'http://your-api/error-event';
}
```

To format api error payload data (from addons like ember-data and ember-ajax) so that it is readable in the error description (instead of just being logged as `[object Object]`), you can use the `ember-error-logger/mixins/api-error-logging` mixin in your Ember Data adapter and/or ajax service. This mixin will stringify the payload data if it is not already in a string format.

**IMPORTANT** The api-consumer uses ember-ajax to make the AJAX request. If you have extended the service with a custom host, you may need to adjust the `logErrorsEndpoint` accordingly.


## Extendability

TODO

## Listeners

TODO

## Consumers

TODO

## Ember-exex

Addon plays nicely with Exceptional Exceptions addon: https://github.com/janmisek/ember-exex
