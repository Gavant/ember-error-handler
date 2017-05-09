import Ember from 'ember';
import BaseListener from './base-listener';
import ErrorDescriptor from '../error-descriptor';

const {
    get,
    getOwner,
    computed
} = Ember;

export default BaseListener.extend({
    init() {
        this._super.apply(this, arguments);
        if (!getOwner(this)) {
            throw new Error('Application container must be defined for ember-listener');
        }
    },

    listenerConfig: computed('config.listeners.ember-listener', function() {
        const configured = this.get('config.listeners.ember-listener');

        if(configured === true) {
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
        const config = this.get('listenerConfig');
        const owner = getOwner(this);
        const listener = this;

        if(get(config, 'actions')) {
            //Capturing errors within action events
            Ember.ActionHandler.reopen({
                send: function (actionName) {
                    try {
                        this._super.apply(this, arguments);
                    } catch (error) {
                        manager.consume(
                            ErrorDescriptor.create({
                                source: `ember-action:${actionName}`,
                                listener: listener,
                                error
                            })
                        );
                    }
                }
            });
        }

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
            Ember.RSVP.onerror = function (error) {
                manager.consume(
                    ErrorDescriptor.create({
                        source: `ember-rsvp`,
                        listener: listener,
                        error
                    })
                );
            };
        }

        if(get(config, 'ember')) {
            //Capturing ember errors
            Ember.onerror = function (error) {
                manager.consume(
                    ErrorDescriptor.create({
                        source: `ember`,
                        listener: listener,
                        error
                    })
                );
            };
        }
    }
});
