import Ember from 'ember';
import BaseConsumer from './base-consumer';

const {
    getOwner,
    get,
    isEmpty,
    computed: { alias }
} = Ember;

export default BaseConsumer.extend({
    endpoint: alias('config.consumers.api-consumer.endpoint'),

    async consume(descriptor) {
        const ajax = getOwner(this).lookup('service:ajax');
        const fastboot = getOwner(this).lookup('service:fastboot');
        const isFastBoot = fastboot ? get(fastboot, 'isFastBoot') : false;
        const req = get(this, 'fastboot.request');
        const endpoint = get(this, 'endpoint');

        if(!ajax || isEmpty(endpoint)) {
            return false;
        }

        try {
            await ajax.request(endpoint, {
                method: 'POST',
                data: JSON.stringify({data: {
                    error: get(descriptor, 'plainText'),
                    userAgent: !isFastBoot ? get(navigator, 'userAgent') : null,
                    resolution: !isFastBoot ? `${get(window, 'screen.width')}w ${get(window, 'screen.height')}h` : null,
                    viewPort: !isFastBoot ? `${get(window, 'innerWidth')}w ${get(window, 'innerHeight')}h` : null,
                    currentURL: !isFastBoot ? window.location.href : `${get(req, 'protocol')}://${get(req, 'host')}${get(req, 'path')}`
                }})
            });

            return true;
        } catch(error) {
            return false;
        }
    }
});
