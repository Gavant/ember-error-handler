import { ConfigMixin } from '../-tools';
import EmberObject from '@ember/object';

export default EmberObject.extend(ConfigMixin, {
    // eslint-disable-next-line no-unused-vars
    listen(manager) {
      // override
    }
});
