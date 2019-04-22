import BaseListener from './base-listener';
import ErrorDescriptor from '../error-descriptor';
import { get, computed } from '@ember/object';
import { getOwner } from '@ember/application';
import RSVP from 'rsvp';

export default BaseListener.extend({
    init() {
        this._super.apply(this, arguments);
        if (!getOwner(this)) {
            throw new Error('Application container must be defined for ember-listener');
        }
    },

    listenerConfig: computed('config.listeners.ember-listener', function() {
        const configured = get(this, 'config.listeners.ember-listener');

        if(!configured || configured === true) {
            return {
                ember: true,
                transitions: true,
                actions: true,
                rsvp: true
            };
        } else {
            return configured;
        }
    }),

    listen(manager) {
        const config = get(this, 'listenerConfig');
        const owner = getOwner(this);
        const listener = this;

        if(get(config, 'transitions')) {
            //Capturing errors during transitions
            const ApplicationRoute = owner.lookup('route:application');
            ApplicationRoute.reopen({
                actions: {
                    error: function (error) {
                        manager.consume(
                            ErrorDescriptor.create({
                                source: `ember-route`,
                                listener: listener,
                                error
                            })
                        );

                        return this._super(...arguments);
                    }
                }
            });
        }

        if(get(config, 'rsvp')) {
            //Capturing RSVP errors
            RSVP.onerror = function (error) {
                manager.consume(
                    ErrorDescriptor.create({
                        source: `ember-rsvp`,
                        listener: listener,
                        error
                    })
                );
            };
        }
    }
});
