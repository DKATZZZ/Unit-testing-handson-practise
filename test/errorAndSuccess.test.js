import { html, fixture, expect } from '@open-wc/testing';
import sinon from 'sinon';
import { Router } from '@vaadin/router';
import '../src/SuccessAndError/Success.js';
import '../src/SuccessAndError/Error.js';

describe('Success screen', () => {
  it('renders heading and description', () => {
    return fixture(html`<loan-success></loan-success>`).then(el => {
      const heading = el.shadowRoot.querySelector('h2');
      const paragraph = el.shadowRoot.querySelector('p');

      expect(heading).to.exist;
      expect(paragraph).to.exist;
    });
  });

  it('renders a button with correct class and label', () => {
    return fixture(html`<loan-success></loan-success>`).then(el => {
      const button = el.shadowRoot.querySelector('lion-button');

      expect(button).to.exist;
      expect(button.classList.contains('home-btn')).to.be.true;
    });
  });

  it('navigates to home / on button click', () => {
    return fixture(html`<loan-success></loan-success>`).then(el => {
      const routerStub = sinon.stub(Router, 'go');
      const button = el.shadowRoot.querySelector('lion-button');

      button.click();

      expect(routerStub.calledOnceWith('/')).to.be.true;
      routerStub.restore(); 
    });
  });
});

describe('error screen', () => {
  it('renders heading, paragraph, and button', () => {
    return fixture(html`<loan-error></loan-error>`).then(el => {
      const heading = el.shadowRoot.querySelector('h2');
      const paragraph = el.shadowRoot.querySelector('p');
      const button = el.shadowRoot.querySelector('lion-button');

      expect(heading).to.exist;
      expect(paragraph).to.exist;
      expect(button).to.exist;
    });
  });

  it('navigates to home / on button click', () => {
    return fixture(html`<loan-error></loan-error>`).then(el => {
      const routerStub = sinon.stub(Router, 'go');
      const button = el.shadowRoot.querySelector('lion-button');

      button.click();

      expect(routerStub.calledOnceWith('/')).to.be.true;
      routerStub.restore();
    });
  });
});
