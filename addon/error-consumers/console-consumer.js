import Ember from 'ember';
import BaseConsumer from './base-consumer';

const { get } = Ember;

export default BaseConsumer.extend({
    consume (descriptor) {
        // eslint-disable-next-line no-console
        console.error(
            get(descriptor, 'source'),
            get(descriptor, 'isError') ? get(descriptor, 'plainText') : get(descriptor, 'error')
        );

        const additionalData = get(descriptor, 'additionalData');
        if (additionalData) {
            // eslint-disable-next-line no-console
            console.warn('Additional data', additionalData);
        }

        return true;
    }
});
