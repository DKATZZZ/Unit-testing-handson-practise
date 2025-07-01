import { html, fixture, expect } from '@open-wc/testing';
import { stub } from 'sinon';
import { Header } from '../src/header/Header.js';

describe('loan-header', () => {
  it(' EN and NL,correct labels', () => {
    return fixture(html`<loan-header></loan-header>`).then(el => {
      const enButton = el.shadowRoot.getElementById('en-GB');
      const nlButton = el.shadowRoot.getElementById('nl-NL');

      expect(enButton).to.exist;
      expect(nlButton).to.exist;
      expect(enButton.textContent.trim()).to.equal('EN');
      expect(nlButton.textContent.trim()).to.equal('NL');
    });
  });

  it('EN active by default', () => {
    return fixture(html`<loan-header></loan-header>`).then(el => {
      const enButton = el.shadowRoot.getElementById('en-GB');
      expect(enButton.classList.contains('bg-btn-color')).to.be.true;
    });
  });


  it('do nothing if the clicked button is not in btn-cursor state', () => {
    return fixture(html`<loan-header></loan-header>`).then(el => {
      const enButton = el.shadowRoot.getElementById('en-GB');
      enButton.click();
      expect(enButton.classList.contains('bg-btn-color')).to.be.true;
    });
  });

  it('switches to NL when NL button is clicked', () => {
    return fixture(html`<loan-header></loan-header>`).then(el => {
      const nlButton = el.shadowRoot.getElementById('nl-NL');
      const enButton = el.shadowRoot.getElementById('en-GB');

      nlButton.click();

      expect(nlButton.classList.contains('bg-btn-color')).to.be.true;
      expect(nlButton.classList.contains('btn-cursor')).to.be.false;
      expect(enButton.classList.contains('btn-cursor')).to.be.true;
      expect(enButton.classList.contains('bg-btn-color')).to.be.false;
    });
  });

  it('switches to English when EN button is clicked', () => {
    return fixture(html`<loan-header></loan-header>`).then(el => {
      const nlButton = el.shadowRoot.getElementById('nl-NL');
      const enButton = el.shadowRoot.getElementById('en-GB');

      nlButton.click();
      enButton.click();

      expect(enButton.classList.contains('bg-btn-color')).to.be.true;
      expect(enButton.classList.contains('btn-cursor')).to.be.false;
      expect(nlButton.classList.contains('btn-cursor')).to.be.true;
      expect(nlButton.classList.contains('bg-btn-color')).to.be.false;
    });
  });
});
