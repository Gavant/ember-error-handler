import Ember from 'ember';
import {EmberErrorHandlerError} from './errors';
import BaseConsumer from './consumer/base-consumer';
import BaseListener from './listener/base-listener';
import {ConfigMixin} from './-tools';
const {computed, getOwner} = Ember;

export default Ember.Service.extend(
    ConfigMixin,
    {
        consumerKeys: computed(function() {
            const configured = this.get('config')['consumers'];
            return configured || [
                'service:ember-error-handler/consumer/wsod-consumer',
                'service:ember-error-handler/consumer/console-consumer'
            ]
        }),

        listenerKeys: computed(function() {
            const configured = this.get('config')['listeners'];
            return configured || [
                    'service:ember-error-handler/listener/window-listener',
                    'service:ember-error-handler/listener/ember-listener'
                ]            
        }),

        consumed: computed(() => []),

        listeners: computed(
            'listenersKeys.[]',
            function () {
                const owner = getOwner(this);
                const listeners = [];
                this.get('listenerKeys').forEach((listener) => {
                    const instance = owner.lookup(listener);
                    if (!instance || !(instance instanceof BaseListener)) {
                        throw new EmberErrorHandlerError(`Lookup of listener '${listener}' failed`);
                    }
                    listeners.push(instance);
                });
                return listeners;
            }),

        consumers: computed(
            'consumerKeys.[]',
            function () {
                const owner = getOwner(this);
                const consumers = [];
                this.get('consumerKeys').forEach((consumer) => {
                    const instance = owner.lookup(consumer);
                    if (!instance || !(instance instanceof BaseConsumer)) {
                        throw new EmberErrorHandlerError(`Lookup of consumer '${consumer}' failed`);
                    }
                    consumers.push(instance);
                });
                return consumers;
            }),


        listen() {
            try {
                this.get('listeners').forEach((listener) => {
                    listener.listen(this);
                })
            } catch (e) {
                throw new EmberErrorHandlerError('Listeners initialization failed').withPreviousError(e);
            }

        },

        isConsumable(descriptor) {
            return !(descriptor.get('error') instanceof EmberErrorHandlerError);
        },

        isConsumed(descriptor) {
            return this.get('consumed').indexOf(descriptor.get('error')) !== -1;
        },

        consume(descriptor) {
            try {
                if (!this.isConsumed(descriptor)) {

                    this.get('consumed').pushObject(descriptor.get('error'));

                    if (this.isConsumable(descriptor)) {
                        this.get('consumers').some((consumer) => {
                            return !consumer.consume(descriptor);
                        });
                    } else {
                        // eslint-disable-next-line no-console
                        console.error('ember-error-handler:', descriptor.get('source'), descriptor.get('error').stack);
                    }
                }
            } catch (e) {
                throw new EmberErrorHandlerError('Error consumation failed').withPreviousError(e);
            }
        }

    });
