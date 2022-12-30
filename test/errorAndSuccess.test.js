import { html, fixture, expect } from '@open-wc/testing';
import Sinon, { stub } from 'sinon';
import '../src/SuccessAndError/Success.js';
import '../src/SuccessAndError/Error.js';

let el;

describe('Success screen ', () => {

    beforeEach(async () => {
        el = await fixture(html`<loan-success></loan-success>`);
    });

    it('Accessible', async () => {
        expect(el).to.be.accessible();
    });

    it('checking for home method', () => {
        const myFunction = Sinon.stub(el, "_toHome");
        const button = el.shadowRoot.querySelectorAll('lion-button');
        el.requestUpdate();
        button[0].click();
        expect(myFunction).to.have.callCount(0);
    });

});

describe('error screen', () => {

    beforeEach(async () => {
        el = await fixture(html`<loan-error></loan-error>`);
    });

    it('Accessible', async () => {
        expect(el).to.be.accessible();
    });

    it('checking for home method', () => {
        const myFunction = Sinon.spy(el, "_toHome");
        const button = el.shadowRoot.querySelectorAll('lion-button');
        button[0].click();
        expect(myFunction.calledOnce).to.be.false;
    });

});