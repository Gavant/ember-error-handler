import {moduleForComponent, test} from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Component from '@ember/component';
import RSVP from 'rsvp';
import { computed } from '@ember/object';
import { getOwner, setOwner } from '@ember/application';

const wait = (timeout) => new RSVP.Promise((resolve) => setTimeout(resolve, timeout));

const renderFailing = (context) => {

    context.register(
        'template:components/failing-cmp',
        hbs`rendering failing property {{failingProperty}}`
    );

    context.register(
        'component:failing-cmp',
        Component.extend({
            failingProperty: computed(() => {
                throw new Error('Error thrown in property')
            })
        })
    );


    context.render(hbs`{{component 'failing-cmp'}}`);
};

const renderSuccess = (context) => {

    const owner = getOwner(context);
    const component = Component.create({
        layout: hbs`<div class='is-rendered'>RENDERED :)</div>`,
        renderer: owner.lookup('renderer:-dom'),

        didInsertElemenet() {
            document.body.innerHTML = 'Hello world';
        }

    });
    setOwner(component, owner);

    component.append();
};


moduleForComponent('ember-error-handler/wsod-screen', 'integration | wsod-consumer | rendering-after-error-is-possbile', {
    integration: true
});

test('programatically executed rendering should be possible', function (assert) {

    assert.expect(1);

    return RSVP.resolve()
        .then(() => renderSuccess(this))
        .then(() => wait(100))
        .then(() => assert.ok(1, 'should happen'))
        ;
});


test('rendering should be possible when thrown in computed of component', function (assert) {

    assert.expect(1);

    return RSVP.resolve()
        .then(() => renderFailing(this))
        .then(() => wait(100))
        .then(() => renderSuccess(this))

        // should render, but it also fails on same error as renderFailing. The issue here is that glimmer2 is probably trying to
        // render also previously failed component as it is in some queue

        .then(() => wait(100))
        .then(() => assert.ok(1, 'should success'))
        ;
});
