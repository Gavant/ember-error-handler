import Ember from 'ember';

export default Ember.Mixin.create({
    generatedDetailedMessage(status, headers, payload, requestData) {
        //stringify the payload if its not already a string to make it readable in error logging
        if(typeof payload !== 'string') {
            payload = JSON.stringify(payload);
        }

        return this._super(status, headers, payload, requestData);
    }
});
