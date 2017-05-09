import Ember from 'ember';

const {
    canInvoke,
    inject: { service }
} = Ember;

export default Ember.Mixin.create({
    errorManager: service('error-manager'),

    handleResponse(status, headers, payload, requestData) {
        let result = this._super(...arguments);

        if(this.isSuccess(status, headers, payload)) {
            return result;
        }

        //provide a more detailed message (request/response info, ect) for ALL error types
        result.message = this.formatErrorMessage(result, status, headers, payload, requestData);
        this.get('errorManager').consume(result);

        return result;
    },

    formatErrorMessage(error, status, headers, payload, requestData) {
        if(typeof payload !== 'string') {
            payload = JSON.stringify(payload);
        }

        if(canInvoke(this, 'generatedDetailedMessage')) {
            //ember-data
            return this.generatedDetailedMessage(status, headers, payload, requestData);
        } else if(canInvoke(this, 'generateDetailedMessage')) {
            //ember-ajax
            return this.generateDetailedMessage(status, headers, payload, requestData);
        } else {
            return error.message;
        }
    }
});
