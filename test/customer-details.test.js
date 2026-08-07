import { html, fixture, expect } from '@open-wc/testing';
import sinon from 'sinon';
import { Router } from '@vaadin/router';
import '../src/Customer/Customer-details'; // Adjust relative path as needed

describe('CustomerDetails Component', () => {
  let element;
  let fetchStub;
  let routerStub;

  beforeEach(async () => {
    routerStub = sinon.stub(Router, 'go');
    fetchStub = sinon.stub(window, 'fetch');

    element = await fixture(html`<customer-details></customer-details>`);
    await element.updateComplete;
  });

  afterEach(() => {
    sinon.restore();
  });

  // 1. RENDER & DOM MOUNTING
  describe('Render', () => {
    it('renders all form input fields correctly', () => {
      expect(element).to.exist;
      expect(element.shadowRoot.querySelector('#first_name')).to.exist;
      expect(element.shadowRoot.querySelector('#last_name')).to.exist;
      expect(element.shadowRoot.querySelector('#dateof_birth')).to.exist;
      expect(element.shadowRoot.querySelector('#email')).to.exist;
      expect(element.shadowRoot.querySelector('#mobile_number')).to.exist;
      expect(element.shadowRoot.querySelector('#monthly_salary')).to.exist;
      expect(element.shadowRoot.querySelector('#EMIs_amount')).to.exist;
      expect(element.shadowRoot.querySelector('#terms')).to.exist;
    });
  });

  // 2. NAVIGATION
  describe('Navigation', () => {
    it('navigates to /emidetails when Back button is clicked', () => {
      const backBtn = element.shadowRoot.querySelector('.backbg-btn-color');
      backBtn.click();

      expect(routerStub.calledOnce).to.be.true;
      expect(routerStub.calledWith('/emidetails')).to.be.true;
    });
  });

  // 3. FORM VALIDATION & GUARD LOGIC
  describe('Form Submission Validation', () => {
    it('blocks API submission if required fields are empty', async () => {
      const lionForm = element.shadowRoot.querySelector('lion-form');

      lionForm.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

      await element.updateComplete;

      expect(fetchStub.called).to.be.false;
    });
  });

  // 4. API SUCCESS & ERROR FLOWS
  // describe('API Integration', () => {
  //   it('navigates to /success when API returns HTTP 200', async () => {
  //     fetchStub.resolves({ status: 200 });

  //     const lionForm = element.shadowRoot.querySelector('lion-form');

  //     const fakeEvent = {
  //       target: {
  //         hasFeedbackFor: [],
  //         serializedValue: { first_name: 'John', last_name: 'Doe' },
  //       },
  //     };

  //     fetch('https://loanfeapi.herokuapp.com/submit-form', { method: 'POST' })
  //       .then(res => res.status === 200 ? Router.go('/success') : Router.go('/error'));

  //     expect(routerStub.calledWith('/success')).to.be.true;
  //   });

  //   it('navigates to /error when API fails (HTTP 500)', async () => {
  //     fetchStub.resolves({ status: 500 });

  //     fetch('https://loanfeapi.herokuapp.com/submit-form', { method: 'POST' })
  //       .then(res => res.status === 200 ? Router.go('/success') : Router.go('/error'));

  //     expect(routerStub.calledWith('/error')).to.be.true;
  //   });
  // });
});