export default {
  name: 'ember-error-logger-instance-initializer',
  initialize( owner ) {
    const manager = owner.lookup('service:ember-error-logger.error-manager');
    manager.listen();
  }
};
