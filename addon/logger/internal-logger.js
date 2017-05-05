import Ember from 'ember';

export default Ember.Service.extend({

    log(context, error) {
        if (error) {
            //eslint-disable-next-line no-console
            console.error('ember-error-logger:', error.stack);
        } else {
            //eslint-disable-next-line no-console
            console.error('ember-error-logger:', 'Failed with undefined error');
        }
    }

})
