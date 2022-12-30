import { html, fixture, expect } from '@open-wc/testing';
import * as Sinon from 'sinon';
import '../loan-application.js';

let el;

describe('LoanApplication', () => {
  // Write test cases inside this block
    before(async () => {
        el = await fixture(html`<loan-application></loan-application>`);
    });

    it('Accessible', async () => {
        expect(el).to.be.accessible();
    });

    it('Check for the title type', async () => {
        el = await fixture(html`<dash-board></dash-board>`);
        expect(el.title).to.be.a('string');
    });

    it('Check for the title value', async () => {
        el = await fixture(html`<dash-board></dash-board>`);
        expect(el).shadowDom.to.equal('<loan-header></loan-header><div id = "outlet"></div>')
    });

    it('spy the increment function', () => {
        setTimeout(async () => {
            const spy = Sinon.stub(el, counter);
            expect(spy.callCount).to.equal();
        }, 3000);
    })

    it('Check for counter type', () => {
        setTimeout(async () => {
            const el = await fixture(html`<dash-board></dash-board>`);
            expect(el.counter).to.be.a('Number');
        }, 2000);
    });

    it('Check for counter value', () => {
        setTimeout(async () => {
            const el = await fixture(html`<dash-board></dash-board>`);
            expect(el.counter).toBe(5);
        }, 2000);
    });

    it('check for DOM', async () => {
        const el = await fixture(html`<div><dash-board></dash-board></div>`);
        expect(el).dom.to.equal('<div><dash-board></dash-board></div>');
        expect(el).lightDom.to.equal('<dash-board></dash-board>');
    });

    it('check for static shadowDom', async () => {
        const el = (await fixture(html` <dash-board></dash-board> `));
        expect(el).shadowDom.to.equal(`
        <loan-header></loan-header>
        <div id="outlet"></div>`);
        expect(el).lightDom.to.equal(``)
    });

    it('passes the a11y audit', async () => {
        const el = await fixture(html`
        <dash-board></dash-board>`);
        expect(el).shadowDom.to.be.accessible();
    });


});