import BaseConsumer from './base-consumer';
import { alias } from '@ember/object/computed';
import { assert } from '@ember/debug';
import { getOwner } from '@ember/application';
import { get } from '@ember/object';
import { isEmpty } from '@ember/utils';

export default BaseConsumer.extend({
    endpoint: alias('config.consumers.api-consumer.endpoint'),

    async consume(descriptor) {
        const endpoint = get(this, 'endpoint');

        assert('Must provide an endpoint url in ember-error-logger.consumers.api-consumer.endpoint config to use the api-consumer', !isEmpty(endpoint));

        try {
            const data = this.buildData(descriptor);
            await this.makeRequest(endpoint, data);
            return true;
        } catch(error) {
            return false;
        }
    },

    buildData(descriptor) {
        const fastboot = getOwner(this).lookup('service:fastboot');
        const isFastBoot = fastboot ? get(fastboot, 'isFastBoot') : false;
        const req = get(this, 'fastboot.request');
        return {
            error: get(descriptor, 'plainText'),
            userAgent: !isFastBoot ? get(navigator, 'userAgent') : null,
            resolution: !isFastBoot ? `${get(window, 'screen.width')}w ${get(window, 'screen.height')}h` : null,
            viewPort: !isFastBoot ? `${get(window, 'innerWidth')}w ${get(window, 'innerHeight')}h` : null,
            currentURL: !isFastBoot ? window.location.href : `${get(req, 'protocol')}://${get(req, 'host')}${get(req, 'path')}`
        };
    },

    makeRequest(endpoint, data) {
        const ajax = getOwner(this).lookup('service:ajax');
        const jsonString = this.stringifyData(data);
        return ajax.request(endpoint, {
            method: 'POST',
            data: jsonString
        });
    },

    stringifyData(data) {
        return JSON.stringify({data});
    }
});
