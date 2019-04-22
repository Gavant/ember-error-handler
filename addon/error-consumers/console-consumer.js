import BaseConsumer from './base-consumer';
import { get } from '@ember/object';

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
