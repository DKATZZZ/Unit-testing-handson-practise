import { html, fixture, expect } from '@open-wc/testing';
import sinon from 'sinon';
import '../src/header/Header.js';
import { localize } from '@lion/localize';

describe('Header Component', () => {
  let element;
  let localeChangedSpy;

  beforeEach(async () => {
    element = await fixture(html`<loan-header></loan-header>`);
    localeChangedSpy = sinon.spy(element, 'localeChanged');
  });
  afterEach(() => {
    localeChangedSpy.restore();
  });

  it('should check component accessibility', () => {
    expect(element).to.be.accessible;
  });

  it('should check header label', () => {
    const paragraph = element.shadowRoot.querySelector('p');
    expect(paragraph).to.be.accessible;
    expect(paragraph.innerText).to.equal(
      localize.msg('change-language:heading')
    );
  });

  it('should check button', () => {
    const button = element.shadowRoot.querySelectorAll('button');
    expect(button).to.be.accessible;
    expect(button.length).to.equal(2);
  });

  it('should render heading and buttons correctly', () => {
    const shadow = element.shadowRoot;
    const heading = shadow.querySelector('p');
    const enBtn = shadow.querySelector('#en-GB');
    const nlBtn = shadow.querySelector('#nl-NL');
    expect(heading).to.be.accessible;
    expect(enBtn).to.be.accessible;
    expect(nlBtn).to.be.accessible;
    expect(enBtn.textContent.trim()).to.equal('EN');
    expect(nlBtn.textContent.trim()).to.equal('NL');
  });

  it('should initially highlights EN button and sets correct classes', () => {
    const enBtn = element.shadowRoot.querySelector('#en-GB');
    const nlBtn = element.shadowRoot.querySelector('#nl-NL');

    expect(enBtn.classList.contains('bg-btn-color')).to.be.true;
    expect(nlBtn.classList.contains('btn-cursor')).to.be.true;
  });

  it('should changes locale to nl-NL when NL button is clicked', async () => {
    const enBtn = element.shadowRoot.querySelector('#en-GB');
    const nlBtn = element.shadowRoot.querySelector('#nl-NL');

    nlBtn.click();
    expect(localeChangedSpy.callCount).to.equal(1);
    expect(localize.locale).to.equal('nl-NL');
    expect(nlBtn.classList.contains('bg-btn-color')).to.be.true;
    expect(enBtn.classList.contains('btn-cursor')).to.be.true;
  });
});
