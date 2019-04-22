import Mixin from '@ember/object/mixin';
import { get } from '@ember/object';
import { inject as service } from '@ember/service';

export default Mixin.create({
    errorManager: service('error-manager'),

    handleResponse(status, headers, payload, requestData) {
        let result = this._super(...arguments);

        if(this.isSuccess(status, headers, payload)) {
            return result;
        }

        //provide a more detailed message (request/response info, ect) for ALL error types
        result.message = this.formatErrorMessage(result, status, headers, payload, requestData);
        get(this, 'errorManager').consume(result);

        return result;
    },

    formatErrorMessage(error, status, headers, payload, requestData) {
        if(typeof payload !== 'string') {
            payload = JSON.stringify(payload);
        }

        if(typeof this.generatedDetailedMessage === 'function') {
            //ember-data
            return this.generatedDetailedMessage(status, headers, payload, requestData);
        } else {
            return error.message;
        }
    }
});
