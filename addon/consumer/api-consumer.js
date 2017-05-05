import Ember from 'ember';
import BaseConsumer from './base-consumer';

const {
    get,
    isEmpty,
    computed: { alias },
    inject: { service }
} = Ember;

export default BaseConsumer.extend({
    endpointUrl: alias('config.logErrorsEndpoint'),
    ajax: service(),
    fastboot: service(),

    async consume(descriptor) {
        const isFastBoot = get(this, 'fastboot.isFastBoot');
        const req = get(this, 'fastboot.request');

        if(isEmpty(get(this, 'endpointUrl'))) {
            return false;
        }

        try {
            await this.get('ajax').request(get(this, 'endpointUrl'), {
                method: 'POST',
                data: JSON.stringify({
                    error: get(descriptor, 'plainText'),
                    userAgent: !isFastBoot ? get(navigator, 'userAgent') : null,
                    resolution: !isFastBoot ? `${get(window, 'screen.width')}w ${get(window, 'screen.height')}h` : null,
                    viewPort: !isFastBoot ? `${get(window, 'innerWidth')}w ${get(window, 'innerHeight')}h` : null,
                    currentURL: !isFastBoot ? window.location.href : `${get(req, 'protocol')}://${get(req, 'host')}${get(req, 'path')}`
                })
            });

            return true;
        } catch(error) {
            return false;
        }
    }
});
