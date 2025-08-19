import { html, fixture, expect } from '@open-wc/testing';
import sinon from 'sinon';
import { Router } from '@vaadin/router';
import '../src/Customer/Customer-details.js';

describe('customer-details', () => {
  let instance;

  beforeEach(async () => {
    instance = await fixture(html`<customer-details></customer-details>`);
    document.body.appendChild(instance);
  });

  it('checks form rendering', () => {
    const heading = instance.shadowRoot.querySelector('h2');
    const form = instance.shadowRoot.querySelector('lion-form');
    expect(heading).to.exist;
    expect(form).to.exist;
  });

  it('checks all required form fields', () => {
    expect(instance.shadowRoot.querySelector('#first_name')).to.exist;
    expect(instance.shadowRoot.querySelector('#last_name')).to.exist;
    expect(instance.shadowRoot.querySelector('#dateof_birth')).to.exist;
    expect(instance.shadowRoot.querySelector('#email')).to.exist;
    expect(instance.shadowRoot.querySelector('#mobile_number')).to.exist;
    expect(instance.shadowRoot.querySelector('#monthly_salary')).to.exist;
    expect(instance.shadowRoot.querySelector('#EMIs_amount')).to.exist;
    expect(instance.shadowRoot.querySelector('#terms')).to.exist;
  });

  it('checks back button navigation', () => {
    const router = sinon.stub(Router, 'go');
    const backButton = instance.shadowRoot.querySelector('.backbg-btn-color');
    backButton.click();
    expect(router.calledOnceWith('/emidetails')).to.be.true;
    router.restore();
  });

  it('checks validation errors on submit', () => {
    const form = instance.shadowRoot.querySelector('lion-form');
    const checkboxGroup = instance.shadowRoot.querySelector('lion-checkbox-group');
    form.submit();
    expect(checkboxGroup.hasFeedbackFor.includes('error')).to.be.true;
  });

  describe('customer-details - post call scenarios', () => {
    let router, fetch, instance, form;

    beforeEach(async () => {
      instance = await fixture(html`<customer-details></customer-details>`);
      router = sinon.stub(Router, 'go');
      fetch = sinon.stub(window, 'fetch');
      form = instance.shadowRoot.querySelector('lion-form');
    });

    afterEach(() => {
      router.restore();
      fetch.restore();
    });

    it('checks success navigation post call', () => {
      form.submit();
      fetch.resolves(new Response(null, { status: 200 }));
      setTimeout(() => {
        expect(router.calledOnceWith('/success')).to.be.true;
      }, 1000);
    });

    it('checks error navigation post call', () => {
      form.submit();
      fetch.resolves(new Response(null, { status: 500 }));
      setTimeout(() => {
        expect(router.calledOnceWith('/error')).to.be.true;
      }, 1000);
    });
  });
});