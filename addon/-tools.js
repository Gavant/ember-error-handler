import Ember from 'ember';
const {getOwner, computed} = Ember;

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
        const owner = getOwner(this);
        return owner.lookup('error-logger:internal-logger');
    }),

    logInternalError(context, error) {
        this.get('internalLogger').log(context, error)
    }
});
