import { html, fixture, expect } from '@open-wc/testing';
import { stub } from 'sinon';
import '../src/Customer/Customer-details.js';
import sinon from 'sinon';
import { Router } from '@vaadin/router';

describe('customer-details', () => {
  it('renders the form and header', () => {
    return fixture(html`<customer-details></customer-details>`).then(el => {
      const heading = el.shadowRoot.querySelector('h2');
      const form = el.shadowRoot.querySelector('lion-form');
      expect(heading).to.exist;
      expect(form).to.exist;
    });
  });

  it('contains all the required form fields', () => {
    return fixture(html`<customer-details></customer-details>`).then(el => {
      expect(el.shadowRoot.querySelector('#first_name')).to.exist;
      expect(el.shadowRoot.querySelector('#last_name')).to.exist;
      expect(el.shadowRoot.querySelector('#dateof_birth')).to.exist;
      expect(el.shadowRoot.querySelector('#email')).to.exist;
      expect(el.shadowRoot.querySelector('#mobile_number')).to.exist;
      expect(el.shadowRoot.querySelector('#monthly_salary')).to.exist;
      expect(el.shadowRoot.querySelector('#EMIs_amount')).to.exist;
      expect(el.shadowRoot.querySelector('#terms')).to.exist;
    });
  });

  it('navigates to /emidetails when back button is clicked', () => {
    return fixture(html`<customer-details></customer-details>`).then(el => {
      const routerStub = sinon.stub(Router, 'go');

      const backButton = el.shadowRoot.querySelector('.backbg-btn-color');
      backButton.click();

      expect(routerStub.calledOnceWith('/emidetails')).to.be.true;

      routerStub.restore();
    });
  });
it('shows validation error if terms checkbox is not checked on submit', () => {
  return fixture(html`<customer-details></customer-details>`).then(el => {
    const form = el.shadowRoot.querySelector('lion-form');
    const checkboxGroup = el.shadowRoot.querySelector('lion-checkbox-group');
    form.submit();
    expect(checkboxGroup.hasFeedbackFor.includes('error')).to.be.true;
  });
});

describe('customer-details - post call scenarios', () => {
  let routerStub;
  let fetchStub;

  beforeEach(() => {
    routerStub = sinon.stub(Router, 'go');
    fetchStub = sinon.stub(window, 'fetch');
  });

  afterEach(() => {
    routerStub.restore();
    fetchStub.restore();
  });

  it('navigates to /success when POST is successful', () => {
    fetchStub.resolves(new Response(null, { status: 200 }));

    return fixture(html`<customer-details></customer-details>`).then(el => {
      document.body.appendChild(el);
        el.shadowRoot.querySelector('#first_name').modelValue = 'John';
    el.shadowRoot.querySelector('#last_name').modelValue = 'Doe';
    el.shadowRoot.querySelector('#email').modelValue = 'john@example.com';
    el.shadowRoot.querySelector('#mobile_number').modelValue = '9876543210';
    el.shadowRoot.querySelector('#monthly_salary').modelValue = 50000;
    el.shadowRoot.querySelector('#EMIs_amount').modelValue = 1000;
    el.shadowRoot.querySelector('lion-checkbox').checked = true;
      const form = el.shadowRoot.querySelector('lion-form');
      form.submit();

      setTimeout(() => {
        expect(routerStub.calledOnceWith('/success')).to.be.true;
      }, 100);
    });
  });

  it('navigates to /error when POST fails', () => {
    fetchStub.resolves(new Response(null, { status: 500 }));

    return fixture(html`<customer-details></customer-details>`).then(el => {
       document.body.appendChild(el);
        el.shadowRoot.querySelector('#first_name').modelValue = 'John';
    el.shadowRoot.querySelector('#last_name').modelValue = 'Smith';
    el.shadowRoot.querySelector('#email').modelValue = 'john@example.com';
    el.shadowRoot.querySelector('#mobile_number').modelValue = '9876543210';
    el.shadowRoot.querySelector('#monthly_salary').modelValue = 45000;
    el.shadowRoot.querySelector('#EMIs_amount').modelValue = 2000;
    el.shadowRoot.querySelector('lion-checkbox').checked = true;
      const form = el.shadowRoot.querySelector('lion-form');
      form.submit();

      setTimeout(() => {
        expect(routerStub.calledOnceWith('/error')).to.be.true;
      },100);
    });
  });
});
});

