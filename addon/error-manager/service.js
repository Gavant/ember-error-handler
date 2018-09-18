import ErrorManager from 'ember-error-handler/error-manager';
import { get, computed } from '@ember/object';
import { isNone } from '@ember/utils';

export default ErrorManager.extend({
    consumerKeys: computed('environment', function () {
        const env = get(this, 'environment');
        const configured = get(this, 'config')['consumers'];
         if(!isNone(configured)) {
            return configured;
        } else if(env === 'development') {
            return ['service:ember-error-handler/consumer/console-consumer'];
        } else {
            return ['service:ember-error-logger/consumer/api/service'];
        }
    }),
    listenerKeys: computed(function () {
        const configured = get(this, 'config')['listeners'];
        if(!isNone(configured)) {
            return configured;
        } else {
            return [
                    'service:ember-error-handler/listener/window-listener',
                    'service:ember-error-logger/listener/ember/service'
                ];
        }
    }),
});
