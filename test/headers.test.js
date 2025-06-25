
import { html, fixture, expect } from '@open-wc/testing';
import sinon from 'sinon';
import '../src/header/Header.js'; 
import { localize } from '@lion/localize';

describe('Header Component', () => {
  let element;

  beforeEach(async () => {
    element = await fixture(html`<loan-header></loan-header>`);
  });

  it('renders heading and buttons correctly', () => {
    const shadow = element.shadowRoot;
    const heading = shadow.querySelector('p');
    const enBtn = shadow.querySelector('#en-GB');
    const nlBtn = shadow.querySelector('#nl-NL');
    expect(heading).to.exist;
    expect(enBtn).to.exist;
    expect(nlBtn).to.exist;
    expect(enBtn.textContent.trim()).to.equal('EN');
    expect(nlBtn.textContent.trim()).to.equal('NL');
  });

  it('initially highlights EN button and sets correct classes', () => {
    const enBtn = element.shadowRoot.querySelector('#en-GB');
    const nlBtn = element.shadowRoot.querySelector('#nl-NL');

    expect(enBtn.classList.contains('bg-btn-color')).to.be.true;
    expect(nlBtn.classList.contains('btn-cursor')).to.be.true;
  });

  it('changes locale to nl-NL when NL button is clicked', async () => {
    const enBtn = element.shadowRoot.querySelector('#en-GB');
    const nlBtn = element.shadowRoot.querySelector('#nl-NL');

    nlBtn.click();

    expect(localize.locale).to.equal('nl-NL');
    expect(nlBtn.classList.contains('bg-btn-color')).to.be.true;
    expect(enBtn.classList.contains('btn-cursor')).to.be.true;
  });

  it('changes locale back to en-GB when EN button is clicked again', async () => {
    const enBtn = element.shadowRoot.querySelector('#en-GB');
    const nlBtn = element.shadowRoot.querySelector('#nl-NL');

    nlBtn.click();

    enBtn.classList.add('btn-cursor');
    enBtn.click();

    expect(localize.locale).to.equal('en-GB');
    expect(enBtn.classList.contains('bg-btn-color')).to.be.true;
    expect(nlBtn.classList.contains('btn-cursor')).to.be.true;
  });

  it('does not switch locale if button clicked has no btn-cursor class', () => {
    const enBtn = element.shadowRoot.querySelector('#en-GB');
    const localeStub = sinon.stub(localize, 'locale').set(() => {});

    enBtn.classList.remove('btn-cursor'); 
    enBtn.click();

    expect(localeStub.called).to.be.false;
    localeStub.restore();
  });
});
