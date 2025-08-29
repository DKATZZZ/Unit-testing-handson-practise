import { html, fixture, expect } from '@open-wc/testing';
import { stub } from 'sinon';
import { localize } from '@lion/localize';
import { Router } from '@vaadin/router';

// Components under test
import '../src/SuccessAndError/Success.js';
import '../src/SuccessAndError/Error.js';

const getElements = (element) => ({
  h2: element.shadowRoot.querySelector('h2'),
  p: element.shadowRoot.querySelector('p'),
  button: element.shadowRoot.querySelector('lion-button'),
});

describe('Loan Application Screens', () => {
  describe('<loan-success>', () => {
    let element;
    let routerStub;
    let msgStub;

    beforeEach(async () => {
      element = await fixture(html`<loan-success></loan-success>`);
    });

    afterEach(() => {
      routerStub?.restore();
      msgStub?.restore();
    });

    it('renders the component', () => {
      expect(element).to.exist;
    });

    it('displays required elements', () => {
      const { h2, p, button } = getElements(element);
      expect(h2).to.exist;
      expect(p).to.exist;
      expect(button).to.exist;
    });

    it('navigates home on button click', () => {
      routerStub = stub(Router, 'go');
      const { button } = getElements(element);

      button.click();

      expect(routerStub.calledOnceWith('/')).to.be.true;
    });

    it('uses correct localization keys', async () => {
      msgStub = stub(localize, 'msg');
      msgStub.withArgs('change-language:congo').returns('Congratulations');
      msgStub.withArgs('change-language:scsDesc').returns(
        'Your loan Form is submitted successfully. Bank representative will call you for further details.'
      );
      msgStub.withArgs('change-language:home').returns('Home');

      element = await fixture(html`<loan-success></loan-success>`);
      const { h2, p, button } = getElements(element);

      expect(h2.textContent).to.equal('Congratulations!!!');
      expect(p.textContent).to.equal(
        'Your loan Form is submitted successfully. Bank representative will call you for further details.'
      );
      expect(button.textContent.trim()).to.equal('Home');
      expect(msgStub.calledWith('change-language:congo')).to.be.true;
      expect(msgStub.calledWith('change-language:scsDesc')).to.be.true;
      expect(msgStub.calledWith('change-language:home')).to.be.true;
    });
  });

  describe('<loan-error>', () => {
    let element;
    let routerStub;
    let msgStub;

    beforeEach(async () => {
      element = await fixture(html`<loan-error></loan-error>`);
    });

    afterEach(() => {
      routerStub?.restore();
      msgStub?.restore();
    });

    it('renders the component', () => {
      expect(element).to.exist;
    });

    it('displays required elements', () => {
      const { h2, p, button } = getElements(element);
      expect(h2).to.exist;
      expect(p).to.exist;
      expect(button).to.exist;
    });

    it('navigates home on button click', () => {
      routerStub = stub(Router, 'go');
      const { button } = getElements(element);
      button.click();
      expect(routerStub.calledOnceWith('/')).to.be.true;
    });

    it('uses correct localization keys', async () => {
      msgStub = stub(localize, 'msg');
      msgStub.withArgs('change-language:oop').returns('Oops');
      msgStub.withArgs('change-language:errDesc').returns(
        'Your loan Form is not submitted.Please try again.'
      );
      msgStub.withArgs('change-language:home').returns('Home');

      element = await fixture(html`<loan-error></loan-error>`);
      const { h2, p, button } = getElements(element);

      expect(h2.textContent).to.equal('Oops!!');
      expect(p.textContent).to.equal('Your loan Form is not submitted.Please try again.');
      expect(button.textContent.trim()).to.equal('Home');

      expect(msgStub.calledWith('change-language:oop')).to.be.true;
      expect(msgStub.calledWith('change-language:errDesc')).to.be.true;
      expect(msgStub.calledWith('change-language:home')).to.be.true;
    });
  });
});
