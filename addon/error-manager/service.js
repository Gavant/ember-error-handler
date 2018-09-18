import Ember from 'ember';
import ErrorManager from 'ember-error-handler/error-manager';
import { EmberErrorHandlerError } from 'ember-error-handler/errors';
const {
    computed,
    get,
    set,
    isNone
} = Ember;

export default ErrorManager.extend({
    listening: false,
    consumerKeys: computed('environment', function () {
        const env = get(this, 'environment');
        const configured = get(this, 'config')['consumers'];
         if(!isNone(configured)) {
            return configured;
        } else if(env === 'development') {
            return ['service:ember-error-handler/consumer/console-consumer'];
        } else {
            return ['service:ember-error-logger/consumer/api'];
        }
    }),
    listenerKeys: computed(function () {
        const configured = get(this, 'config')['listeners'];
        if(!isNone(configured)) {
            return configured;
        } else {
            return [
                    'service:ember-error-handler/listener/window-listener',
                    'service:ember-error-logger/ember-listener'
                ];
        }
    }),

    listen() {
        const listening = get(this, 'listening');
        if (!listening) {
            try {
                if (this.get('enabled')) {
                    this.get('listeners').forEach((listener) => {
                        listener.listen(this);
                    });
                    set(this, 'listening', true);
                }
            } catch (e) {
                this.logInternalError(
                    this,
                    new EmberErrorHandlerError('Listeners initialization failed').withPreviousError(e)
                );
                set(this, 'listening', false);
            }
        }


    },
});
