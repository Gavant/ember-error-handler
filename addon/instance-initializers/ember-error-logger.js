export default {
  name: '@gavant/ember-error-logger',
  initialize(owner) {
    const manager = owner.lookup('service:error-manager');
    manager.listen();
  }
};
