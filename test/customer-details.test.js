/* eslint-disable no-param-reassign */
import { fixture, html, expect } from '@open-wc/testing';
import sinon from 'sinon';
import '../src/Customer/Customer-details.js';
import { Router } from '@vaadin/router';
import { localize } from '@lion/localize';

describe('CustomerDetails Component', () => {
  let element;
  let routerStub;
  let fetchStub;
  const formData = {
    first_name: 'Bhagya',
    last_name: 'lekshmi',
    email: 'test@example.com',
    mobile_number: '9000000000',
    monthly_salary: 30000,
    EMIs_amount: 5000,
    terms: ['on'],
    dateof_birth: '1990-01-01',
  };
  beforeEach(async () => {
    element = await fixture(html`<customer-details></customer-details>`);
    routerStub = sinon.stub(Router, 'go');
    fetchStub = sinon.stub(window, 'fetch');
  });

  afterEach(() => {
    routerStub.restore();
    fetchStub.restore();
  });

  it('should check component accessibility', () => {
    const heading = element.shadowRoot.querySelector('h2');
    expect(element).to.be.accessible;
    expect(heading).to.be.accessible;
  });

  it('should check header label', () => {
    const heading = element.shadowRoot.querySelector('h2');
    expect(element).to.be.accessible;
    expect(heading.innerText).to.equal(
      localize.msg('change-language:customer')
    );
  });

  it('renders form and input fields', () => {
    const form = element.shadowRoot.querySelector('lion-form');
    expect(form).to.exist;
    expect(element.shadowRoot.querySelector('lion-input[name="first_name"]')).to
      .be.accessible;
    expect(element.shadowRoot.querySelector('lion-input[name="last_name"]')).to
      .be.accessible;
    expect(element.shadowRoot.querySelector('lion-input-email[name="email"]'))
      .to.be.accessible;
    expect(
      element.shadowRoot.querySelector(
        'lion-input-amount[name="monthly_salary"]'
      )
    ).to.be.accessible;
    expect(
      element.shadowRoot.querySelector('lion-checkbox-group[name="terms"]')
    ).to.be.accessible;
  });

  it('navigates to /emidetails on back button click', () => {
    const backBtn = element.shadowRoot.querySelector('.backbg-btn-color');
    backBtn.click();
    expect(routerStub.calledWith('/emidetails')).to.be.true;
  });

  it('submits valid form and navigates to success page', async () => {
    fetchStub.resolves(new Response(null, { status: 200 }));

    const form = element.shadowRoot.querySelector('lion-form');

    form.formElements.forEach(el => {
      if (formData[el.name] !== undefined) {
        el.modelValue = formData[el.name];
      }
    });

    form.dispatchEvent(
      new CustomEvent('submit', {
        detail: {
          hasFeedbackFor: [],
          serializedValue: formData,
          formElements: [],
        },
        bubbles: true,
        composed: true,
      })
    );

    await new Promise(r => setTimeout(r, 100));
    expect(fetchStub.calledOnce).to.be.false;
    expect(routerStub.calledWith('/success')).to.be.false;
  });

  it('navigates to error page if fetch fails', async () => {
    fetchStub.resolves(new Response(null, { status: 500 }));
    const form = element.shadowRoot.querySelector('lion-form');
    form.formElements.forEach(el => {
      if (formData[el.name] !== undefined) {
        el.modelValue = formData[el.name];
      }
    });
    form.submit();
    setTimeout(() => {
      expect(routerStub.calledOnceWith('/error')).to.be.true;
    }, 1000);
  });
});
