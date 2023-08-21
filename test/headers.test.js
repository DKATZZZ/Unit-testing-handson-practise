import { html, fixture, expect } from '@open-wc/testing';
//import { stub } from 'sinon';
import '../src/header/Header.js';

describe('loan-header', () => {
  it('renders the component', async () => {
    const el = await fixture(html`<loan-header></loan-header>`);
    expect(el).shadowDom.to.be.accessible();
  });

  it('changes locale to en-GB', async () => {
    const el = await fixture(html`<loan-header></loan-header>`);
    const enGBButton = el.shadowRoot.querySelector('#en-GB');
    enGBButton.click();

    expect(localize.locale).to.equal('en-GB');

    expect(enGBButton.classList).to.contain('bg-btn-color');

    expect(el.shadowRoot.querySelector('#nl-NL').classList).to.contain('btn-cursor');
  });

  it('changes locale to nl-NL', async () => {
    const el = await fixture(html`<loan-header></loan-header>`);
    const nlNLButton = el.shadowRoot.querySelector('#nl-NL');
    nlNLButton.click();

    expect(localize.locale).to.equal('nl-NL');

    expect(nlNLButton.classList).to.contain('bg-btn-color');

    expect(el.shadowRoot.querySelector('#en-GB').classList).to.contain('btn-cursor');
  });
});
