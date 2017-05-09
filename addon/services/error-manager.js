import Ember from 'ember';
import {EmberErrorLoggerError} from '../errors';
import BaseConsumer from '../error-consumers/base-consumer';
import BaseListener from '.,/error-listeners/base-listener';
import ErrorDescriptor from '../error-descriptor';
import {ConfigMixin, InternalErrorManagmentMixin} from '../-tools';

const {
    computed,
    getOwner,
    isNone
} = Ember;

export default Ember.Service.extend(ConfigMixin, InternalErrorManagmentMixin, {
    consumed: computed(() => []),

    enabled: computed('environment', function () {
        return this.get('environment') !== 'test';
    }),

    consumerConfigs: computed('environment', function () {
        const env = this.get('environment');
        const configured = this.get('config')['consumers'];

        if(!isNone(configured)) {
            return configured;
        } else if(env === 'development') {
            return {'console-consumer': true};
        } else {
            return {};
        }
    }),

    listenerConfigs: computed(function () {
        const configured = this.get('config')['listeners'];

        if(!isNone(configured)) {
            return configured;
        } else {
            return {
                'window-listener': true,
                'ember-listener': true
            };
        }
    }),

    listeners: computed('listenerConfigs.[]', function () {
        const owner = getOwner(this);
        const configs = this.get('listenerConfigs');
        const listeners = [];

        for(let key in configs) {
            if(configs.hasOwnProperty(key) && configs[key]) {
                let listener = `error-listener:${key}`;
                let instance = owner.lookup(listener);
                if (!instance || !(instance instanceof BaseListener)) {
                    throw new EmberErrorLoggerError(`Lookup of listener '${listener}' failed`);
                }
                listeners.push(instance);
            }
        }

        return listeners;
    }),

    consumers: computed('consumerConfigs.[]', function () {
        const owner = getOwner(this);
        const configs = this.get('consumerConfigs');
        const consumers = [];

        for(let key in configs) {
            if(configs.hasOwnProperty(key) && configs[key]) {
                let consumer = `error-consumer:${key}`;
                let instance = owner.lookup(consumer);
                if (!instance || !(instance instanceof BaseConsumer)) {
                    throw new EmberErrorLoggerError(`Lookup of consumer '${consumer}' failed`);
                }
                consumers.push(instance);
            }
        }

        return consumers;
    }),

    listen() {
        try {
            if (this.get('enabled')) {
                this.get('listeners').forEach((listener) => {
                    listener.listen(this);
                })
            }
        } catch (e) {
            this.logInternalError(
                this,
                new EmberErrorLoggerError('Listeners initialization failed').withPreviousError(e)
            );
        }

    },

    isConsumed(descriptor) {
        return this.get('consumed').indexOf(descriptor.get('error')) !== -1;
    },

    consume(descriptor) {
        // if descriptor is not provided we convert error to descriptor instance
        if (!(descriptor instanceof ErrorDescriptor)) {
            descriptor = ErrorDescriptor.create({
                source: 'custom',
                listener: null,
                error: descriptor
            })
        }

        try {
            if (!this.isConsumed(descriptor)) {
                this.get('consumed').pushObject(descriptor.get('error'));

                this.get('consumers').some((consumer) => {
                    try {
                        return !consumer.consume(descriptor);
                    } catch (e) {
                        this.logInternalError(
                            this,
                            new EmberErrorLoggerError(`Consumer ${consumer._debugContainerKey} failed`).withPreviousError(e)
                        );
                    }
                });
            }
        } catch (e) {
            this.logInternalError(
                this,
                new EmberErrorLoggerError('Error consumation failed').withPreviousError(e)
            );
        }
    }
});
