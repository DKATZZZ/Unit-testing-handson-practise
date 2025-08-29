import { html, fixture, expect } from '@open-wc/testing';
import sinon from 'sinon';
import '../src/Customer/Customer-details.js';
import { Router } from '@vaadin/router';
import { localize } from '@lion/localize';


describe('CustomerDetails', () => {
  let element;
  let msgStub;

  beforeEach(async () => {
    element = await fixture(html`<customer-details></customer-details>`);
    await element.updateComplete;

    const datepicker = element.shadowRoot.querySelector('lion-input-datepicker');
    await datepicker.updateComplete;

    if (datepicker._overlayCtrl?.contentNode && !document.body.contains(datepicker._overlayCtrl.contentNode)) {
      document.body.appendChild(datepicker._overlayCtrl.contentNode);
    }
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should define custom element', () => {
    expect(element).to.exist;
  });

  it('should render the form with correct fields', () => {
    const shadow = element.shadowRoot || element.renderRoot;
    expect(shadow.querySelector('lion-form')).to.exist;
    expect(shadow.querySelector('lion-input#first_name')).to.exist;
    expect(shadow.querySelector('lion-input#last_name')).to.exist;
    expect(shadow.querySelector('lion-input-datepicker#dateof_birth')).to.exist;
    expect(shadow.querySelector('lion-input-email#email')).to.exist;
    expect(shadow.querySelector('lion-input#mobile_number')).to.exist;
    expect(shadow.querySelector('lion-input-amount#monthly_salary')).to.exist;
    expect(shadow.querySelector('lion-input-amount#EMIs_amount')).to.exist;
    expect(shadow.querySelector('lion-checkbox-group#terms')).to.exist;
  });

  it('uses correct localization keys', async () => {
    msgStub = sinon.stub(localize, 'msg');
    msgStub.withArgs('change-language:customer').returns('Customer Details');
    msgStub.withArgs('change-language:firstname').returns('First Name');
    msgStub.withArgs('change-language:lastname').returns('Last Name');
    msgStub.withArgs('change-language:email').returns('Email');
    msgStub.withArgs('change-language:mobilenumber').returns('Mobile Number');
    msgStub.withArgs('change-language:monthlysalary').returns('Monthly Salary');
    msgStub.withArgs('change-language:previousemi').returns('Previous EMIs Amount');
    msgStub.withArgs('change-language:checkbox').returns(
      'I agree to give details and bank will contact me'
    );
    msgStub.withArgs('change-language:back').returns('Back');
    msgStub.withArgs('change-language:next').returns('Next');

    element = await fixture(html`<customer-details></customer-details>`);
    await element.updateComplete;

    const h2 = element.shadowRoot.querySelector('h2');
    const firstNameInput = element.shadowRoot.querySelector('#first_name');
    const lastNameInput = element.shadowRoot.querySelector('#last_name');
    const emailInput = element.shadowRoot.querySelector('#email');
    const mobileInput = element.shadowRoot.querySelector('#mobile_number');
    const salaryInput = element.shadowRoot.querySelector('#monthly_salary');
    const emiInput = element.shadowRoot.querySelector('#EMIs_amount');
    const checkbox = element.shadowRoot.querySelector('#terms');
    const backButton = element.shadowRoot.querySelector('.backbg-btn-color');
    const nextButton = element.shadowRoot.querySelector('.nextbg-btn-color');
    expect(firstNameInput.label).to.equal('First Name');
    expect(lastNameInput.label).to.equal('Last Name');
    expect(emailInput.label).to.equal('Email');
    expect(mobileInput.label).to.equal('Mobile Number');
    expect(salaryInput.label).to.equal('Monthly Salary');
    expect(h2.textContent).to.equal('Customer Details');
    expect(emiInput.label).to.equal('Previous EMIs Amount');
    expect(checkbox.querySelector('label').textContent).to.equal('I agree to give details and bank will contact me');
    expect(backButton.textContent.trim()).to.equal('Back');
    expect(nextButton.textContent.trim()).to.equal('Next');
  });

  it('should navigate to /emidetails when _toEmidetails is called', () => {
    const routerGoStub = sinon.stub(Router, 'go');
    const button = element.shadowRoot.querySelector('.backbg-btn-color');
    button.click();
    expect(routerGoStub.calledWith('/emidetails')).to.be.true;
    routerGoStub.restore();
  });

  it('navigates to /error on failed form submit', async () => {
    element = await fixture(html`<customer-details></customer-details>`);
    const routerGoStub = sinon.stub(Router, 'go');
    const fetchStub = sinon.stub(window, 'fetch').resolves({ status: 500 });
    const lionForm = element.shadowRoot.querySelector('lion-form');

    const ev = new Event('submit', { bubbles: true, cancelable: true });
    Object.defineProperty(ev, 'target', {
      writable: false,
      value: {
        hasFeedbackFor: [],
        serializedValue: { foo: 'bar' },
        formElements: [],
      },
    });

    await lionForm.dispatchEvent(ev);
    await fetchStub.firstCall.returnValue;

    expect(fetchStub.calledOnce).to.be.true;
    expect(routerGoStub.calledWith('/error')).to.be.true;
    routerGoStub.restore();
    fetchStub.restore();
  });

  it('does not call fetch on invalid form and focuses first error element', async () => {
    const fetchStub = sinon.stub(window, 'fetch').resolves({ status: 200 });
    const routerGoStub = sinon.stub(Router, 'go');
    const lionForm = element.shadowRoot.querySelector('lion-form');

    const firstFormEl = {
      focus: sinon.stub(),
      classList: { add: sinon.stub(), remove: sinon.stub() },
      hasFeedbackFor: ['error'],
    };

    const ev = new Event('submit', { bubbles: true, cancelable: true });
    Object.defineProperty(ev, 'target', {
      writable: false,
      value: {
        hasFeedbackFor: ['error'],
        serializedValue: {},
        formElements: [firstFormEl],
      },
    });


    await lionForm.dispatchEvent(ev);

    expect(fetchStub.called).to.be.false;
    expect(routerGoStub.called).to.be.false;

    expect(firstFormEl.focus.calledOnce).to.be.true;
    expect(firstFormEl.classList.add.calledWith('error-handle')).to.be.true;
    fetchStub.restore();
    routerGoStub.restore();
  });

  it('navigates to /success on valid form submit', async () => {
    element = await fixture(html`<customer-details></customer-details>`);
    const routerGoStub = sinon.stub(Router, 'go');
    const fetchStub = sinon.stub(window, 'fetch').resolves({ status: 200 });
    const lionForm = element.shadowRoot.querySelector('lion-form');

    const ev = new Event('submit', { bubbles: true, cancelable: true });
    Object.defineProperty(ev, 'target', {
      writable: false,
      value: {
        hasFeedbackFor: [],
        serializedValue: { first_name: 'test', last_name: 'user' },
        formElements: [],
      },
    });

    await lionForm.dispatchEvent(ev);
    expect(fetchStub.calledOnce).to.be.true;
    expect(routerGoStub.calledWith('/success')).to.be.true;
    routerGoStub.restore();
    fetchStub.restore();

  });
});
