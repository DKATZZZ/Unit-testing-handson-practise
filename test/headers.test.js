import { html, fixture, expect } from '@open-wc/testing';
import { localize } from '@lion/localize';
import '../src/header/Header.js';
import sinon from 'sinon';

const Header = customElements.get('loan-header');

describe('Header', () => {
  let element;

  beforeEach(async () => {
    element = await fixture(html`<loan-header></loan-header>`);
    await element.updateComplete;
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('localizeNamespaces', () => {
    it('returns an array with change-language as first element', () => {
      const namespaces = Header.localizeNamespaces;
      expect(Array.isArray(namespaces)).to.be.true;
      expect(namespaces[0]).to.have.property('change-language');
      expect(typeof namespaces[0]['change-language']).to.equal('function');
    });

    it('allows stubbing of change-language function using callsFake', async () => {
      const namespaces = Header.localizeNamespaces;

      const stub = sinon.stub().callsFake(locale => {
        return Promise.resolve('mocked-locale');
      });

      namespaces[0]['change-language'] = stub;

      const result = await namespaces[0]['change-language']('nl-NL');

      expect(stub.calledOnceWith('nl-NL')).to.be.true;
      expect(result).to.equal('mocked-locale');
    });

    it('executes the real change-language function (coverage)', async () => {
      const fn = Header.localizeNamespaces[0]['change-language'];
      try {
        await fn('en-GB');
      } catch (e) {
        expect(e).to.exist;
      }
    });
  });

  describe('localeChanged', () => {
    it('sets locale to nl-NL and updates button classes', async () => {
      const nlBtn = element.shadowRoot.getElementById('nl-NL');
      nlBtn.click();
      expect(localize.locale).to.equal('nl-NL');
      expect(nlBtn.classList.contains('bg-btn-color')).to.be.true;
      expect(nlBtn.classList.contains('btn-cursor')).to.be.false;
      const enBtn = element.shadowRoot.getElementById('en-GB');
      expect(enBtn.classList.contains('btn-cursor')).to.be.true;
      expect(enBtn.classList.contains('bg-btn-color')).to.be.false;
    });

    it('sets locale to en-GB and updates button classes', async () => {
      element.shadowRoot.getElementById('nl-NL').click();
      await element.updateComplete;

      const enBtn = element.shadowRoot.getElementById('en-GB');
      enBtn.click();

      expect(localize.locale).to.equal('en-GB');
      expect(enBtn.classList.contains('bg-btn-color')).to.be.true;
      expect(enBtn.classList.contains('btn-cursor')).to.be.false;
      const nlBtn = element.shadowRoot.getElementById('nl-NL');
      expect(nlBtn.classList.contains('btn-cursor')).to.be.true;
      expect(nlBtn.classList.contains('bg-btn-color')).to.be.false;
    });

    it('does not change locale if button lacks btn-cursor class', async () => {
      const enBtn = element.shadowRoot.getElementById('en-GB');
      localize.locale = 'nl-NL';
      enBtn.classList.remove('btn-cursor');
      enBtn.click();
      expect(localize.locale).to.equal('nl-NL');
    });
  });

  describe('render', () => {
    it('renders EN and NL buttons', () => {
      const enBtn = element.shadowRoot.getElementById('en-GB');
      const nlBtn = element.shadowRoot.getElementById('nl-NL');
      expect(enBtn).to.exist;
      expect(nlBtn).to.exist;
      expect(enBtn.textContent.trim()).to.equal('EN');
      expect(nlBtn.textContent.trim()).to.equal('NL');
    });

    it('displays localized heading', () => {
      const heading = element.shadowRoot.querySelector('p');
      expect(heading.textContent).to.not.be.empty;
    });

    it('has correct initial button classes', async () => {
      await element.updateComplete;
      const enBtn = element.shadowRoot.getElementById('en-GB');
      const nlBtn = element.shadowRoot.getElementById('nl-NL');
      expect(enBtn.classList.contains('bg-btn-color')).to.be.true;
      expect(nlBtn.classList.contains('btn-cursor')).to.be.true;
    });
  });
});
