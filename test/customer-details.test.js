
import { fixture, html, expect } from '@open-wc/testing';
import sinon from 'sinon';
import '../src/Customer/Customer-details.js'; 
import { Router } from '@vaadin/router'; 

describe('CustomerDetails Component', () => {
  let element;

  beforeEach(async () => {
    element = await fixture(html`<customer-details></customer-details>`);
  });

  it('renders form and input fields', () => {
    const form = element.shadowRoot.querySelector('lion-form');
    expect(form).to.exist;
    expect(element.shadowRoot.querySelector('lion-input[name="first_name"]')).to.exist;
    expect(element.shadowRoot.querySelector('lion-input[name="last_name"]')).to.exist;
    expect(element.shadowRoot.querySelector('lion-input-email[name="email"]')).to.exist;
    expect(element.shadowRoot.querySelector('lion-input-amount[name="monthly_salary"]')).to.exist;
    expect(element.shadowRoot.querySelector('lion-checkbox-group[name="terms"]')).to.exist;
  });

  it('navigates to /emidetails on back button click', () => {
    const routerStub = sinon.stub(Router, 'go');
    const backBtn = element.shadowRoot.querySelector('.backbg-btn-color');
    backBtn.click();
    expect(routerStub.calledWith('/emidetails')).to.be.true;
    routerStub.restore();
  });

  it('submits valid form and navigates to success page', async () => {
    const fetchStub = sinon.stub(window, 'fetch').resolves({ status: 200 });
    const routerStub = sinon.stub(Router, 'go');

    const form = element.shadowRoot.querySelector('lion-form');

    const formData = {
      first_name: 'Shweta',
      last_name: 'Patil',
      email: 'shweta@example.com',
      mobile_number: '9876543210',
      monthly_salary: 30000,
      EMIs_amount: 5000,
      terms: ['on'],
      dateof_birth: '1990-01-01',
    };

    form.formElements.forEach(el => {
      if (formData[el.name] !== undefined) {
        el.modelValue = formData[el.name];
      }
    });

    form.dispatchEvent(new CustomEvent('submit', {
      detail: {
        hasFeedbackFor: [],
        serializedValue: formData,
        formElements: [],
      },
      bubbles: true,
      composed: true,
    }));

    await new Promise(r => setTimeout(r, 100));
    expect(fetchStub.calledOnce).to.be.true;
    expect(routerStub.calledWith('/success')).to.be.true;

    fetchStub.restore();
    routerStub.restore();
  });

  it('navigates to error page if fetch fails', async () => {
    const fetchStub = sinon.stub(window, 'fetch').resolves({ status: 500 });
    const routerStub = sinon.stub(Router, 'go');

    const form = element.shadowRoot.querySelector('lion-form');

    const formData = {
      first_name: 'Shweta',
      last_name: 'Patil',
      email: 'shweta@example.com',
      mobile_number: '9876543210',
      monthly_salary: 30000,
      EMIs_amount: 5000,
      terms: ['on'],
      dateof_birth: '1990-01-01',
    };

    form.formElements.forEach(el => {
      if (formData[el.name] !== undefined) {
        el.modelValue = formData[el.name];
      }
    });

    form.dispatchEvent(new CustomEvent('submit', {
      detail: {
        hasFeedbackFor: [],
        serializedValue: formData,
        formElements: [],
      },
      bubbles: true,
      composed: true,
    }));

    await new Promise(r => setTimeout(r, 100));
    expect(fetchStub.calledOnce).to.be.true;
    expect(routerStub.calledWith('/error')).to.be.true;

    fetchStub.restore();
    routerStub.restore();
  });
});

