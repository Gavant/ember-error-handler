export default {
    after: 'ember-error-handler-instance-initializer',
    name: 'ember-error-logger',
    initialize(owner) {
        const manager = owner.lookup('service:error-manager');
        manager.listen();
    }
};
