import Mixin from '@ember/object/mixin';
import { get, computed } from '@ember/object';
import { getOwner } from '@ember/application';

export const getConfig = (instance) => {
    return getOwner(instance).resolveRegistration('config:environment')['ember-error-logger'] || {};
};

export const getEnvironment = (instance) => {
    return getOwner(instance).resolveRegistration('config:environment').environment;
};

export const ConfigMixin = Mixin.create({
    config: computed(function () {
        return getConfig(this);
    }),

    environment: computed(function () {
        return getEnvironment(this);
    })
});

export const InternalErrorManagmentMixin = Mixin.create({
    internalLogger: computed(function() {
        return getOwner(this).lookup('error-logger:internal-logger');
    }),

    logInternalError(context, error) {
        get(this, 'internalLogger').log(context, error)
    }
});
