import Ember from 'ember';
const {
    get,
    getOwner,
    computed
} = Ember;

export const getConfig = (instance) => {
    return getOwner(instance).resolveRegistration('config:environment')['ember-error-logger'] || {};
};

export const getEnvironment = (instance) => {
    return getOwner(instance).resolveRegistration('config:environment').environment;
};

export const ConfigMixin = Ember.Mixin.create({
    config: computed(function () {
        return getConfig(this);
    }),

    environment: computed(function () {
        return getEnvironment(this);
    })
});

export const InternalErrorManagmentMixin = Ember.Mixin.create({
    internalLogger: computed(function() {
        return getOwner(this).lookup('error-logger:internal-logger');
    }),

    logInternalError(context, error) {
        get(this, 'internalLogger').log(context, error)
    }
});
