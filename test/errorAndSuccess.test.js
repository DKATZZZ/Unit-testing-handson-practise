import { html, fixture, expect, aTimeout } from '@open-wc/testing';
import sinon from 'sinon';
import { localize } from '@lion/localize';
import { Router } from '@vaadin/router';
import '../locale/inline-data.js';
import '../src/SuccessAndError/Success.js';
import '../src/SuccessAndError/Error.js';

describe('Success screen ', () => {
  const originalLocale = localize.locale;

  let el;
  let sandbox;
  let routerGo;

  beforeEach(async () => {
    sandbox = sinon.createSandbox();
    routerGo = sandbox.stub(Router, 'go');
    localize.locale = 'en-GB';
    el = await fixture(html`<loan-success></loan-success>`);
  });

  afterEach(() => {
    sandbox.restore();
    localize.locale = originalLocale;
  });

  it('renders the localized congratulations heading', () => {
    expect(el.shadowRoot.querySelector('h2').textContent.trim()).to.equal(
      'Congratulations!!!',
    );
  });

  it('explains that the form was submitted', () => {
    expect(el.shadowRoot.querySelector('p').textContent.trim()).to.equal(
      'Your loan Form is submitted successfully. Bank representative will call you for further details.',
    );
  });

  it('renders a home button', () => {
    const button = el.shadowRoot.querySelector('.home-btn');
    expect(button).to.exist;
    expect(button.textContent.trim()).to.equal('Home');
  });

  it('navigates to the dashboard from _toHome', () => {
    el._toHome();
    expect(routerGo).to.have.been.calledOnceWithExactly('/');
  });

  it('navigates to the dashboard when the home button is clicked', async () => {
    el.shadowRoot.querySelector('.home-btn').click();
    await aTimeout(0);
    expect(routerGo).to.have.been.calledWithExactly('/');
  });

  it('re-renders in Dutch when the locale changes', async () => {
    localize.locale = 'nl-NL';
    await aTimeout(0);
    await el.updateComplete;
    expect(el.shadowRoot.querySelector('h2').textContent.trim()).to.equal(
      'Gefeliciteerd!!!',
    );
  });

  it('is accessible, apart from the known home-button contrast defect', async () => {
    await expect(el).to.be.accessible({ ignoredRules: ['color-contrast'] });
  });
});

describe('error screen', () => {
  const originalLocale = localize.locale;

  let el;
  let sandbox;
  let routerGo;

  beforeEach(async () => {
    sandbox = sinon.createSandbox();
    routerGo = sandbox.stub(Router, 'go');
    localize.locale = 'en-GB';
    el = await fixture(html`<loan-error></loan-error>`);
  });

  afterEach(() => {
    sandbox.restore();
    localize.locale = originalLocale;
  });

  it('renders the localized oops heading', () => {
    expect(el.shadowRoot.querySelector('h2').textContent.trim()).to.equal(
      'Oops!!',
    );
  });

  it('explains that the form was not submitted', () => {
    expect(el.shadowRoot.querySelector('p').textContent.trim()).to.equal(
      'Your loan Form is not submitted.Please try again.',
    );
  });

  it('renders a home button', () => {
    const button = el.shadowRoot.querySelector('.home-btn');
    expect(button).to.exist;
    expect(button.textContent.trim()).to.equal('Home');
  });

  it('navigates to the dashboard from _toHome', () => {
    el._toHome();
    expect(routerGo).to.have.been.calledOnceWithExactly('/');
  });

  it('navigates to the dashboard when the home button is clicked', async () => {
    el.shadowRoot.querySelector('.home-btn').click();
    await aTimeout(0);
    expect(routerGo).to.have.been.calledWithExactly('/');
  });

  it('is accessible, apart from the known home-button contrast defect', async () => {
    await expect(el).to.be.accessible({ ignoredRules: ['color-contrast'] });
  });
});
