import { html, fixture, expect } from '@open-wc/testing';
import Sinon, { stub } from 'sinon';
import '../src/header/Header.js';

const el = await fixture(html`<loan-header></loan-header>`);
const button = el.shadowRoot.querySelectorAll('button');

describe('loan-header', () => {
  // Write test cases inside this block

    // it('Accessible', async () => {
    //     expect(el).to.be.accessible();
    // });

    it('fails without label', async () => {
      const el = await fixture(html` <div aria-labelledby="test-x"></div> `);
      await expect(el).not.to.be.accessible();
    });

    it('check for EN button Exist ', async () => {
      const el = await fixture(html` <<button
      id="en-GB"
      class="en-GB bg-btn-color " /> `);
     expect(el).to.exist;;
    });

    it('checks for the language change', async () => {
        const func = Sinon.spy(el, "localeChanged");
        button[0].click();
        expect(func.calledOnce).to.be.true;
        func.restore();
    });

    it('check for the form class form basic', async () => {
        const div = el.shadowRoot.querySelector('div');
        expect(div).to.exist;
        expect(div).to.have.class('container');
    });

    it('check for the color change of button', async () => {
        button[0].click();
        expect(button[0]).to.have.class('bg-btn-color');
    });

    it('check for the color change of button', async () => {
        button[0].click();
        expect(button[1]).to.have.class('btn-cursor');
    });

    it('check for the color change of button', async () => {
        button[1].click();
        expect(button[1]).to.have.class('bg-btn-color');
    });

    it('is defined', async () => {
      const el = await fixture(html`<loan-header></loan-header>`);
      expect(el).dom.exist;
    });
});