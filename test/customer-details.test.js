import { html, fixture, expect } from '@open-wc/testing';
import sinon, { stub } from 'sinon';
import '../src/Customer/Customer-details.js';
import { Router } from '@vaadin/router';
import { localize } from '@lion/localize';

describe('customer details', () => {
  let element;
  let fetchStub;

  beforeEach(async () => {
    element = await fixture(html`<customer-details></customer-details>`);
    fetchStub = sinon.stub(window, 'fetch');
  });

  afterEach(() => {
    if (fetchStub) {
      fetchStub.restore();
    }
    sinon.restore();
  });
  it('should check component accessibility', () => {
    const heading = element.shadowRoot.querySelector('h2');
    expect(element).to.be.accessible;
    expect(heading).to.be.accessible;
  });

  it('should render the component with correct structure', () => {
    expect(element).to.exist;
    expect(element.tagName.toLowerCase()).to.equal('customer-details');
  });

  it('should render heading with correct text', () => {
    const heading = element.shadowRoot.querySelector('h2');
    expect(heading).to.exist;
    expect(heading.textContent.trim()).to.equal(
      localize.msg('change-language:customer')
    );
  });

  it('should render lion-form element', () => {
    const form = element.shadowRoot.querySelector('lion-form');
    expect(form).to.exist;
  });

  it('should check inputs', () => {
    const firstName = element.shadowRoot.getElementById('first_name');
    const lastName = element.shadowRoot.getElementById('last_name');
    const dob = element.shadowRoot.getElementById('dateof_birth');
    const email = element.shadowRoot.getElementById('email');
    const mobile = element.shadowRoot.getElementById('mobile_number');
    const monthlysalary = element.shadowRoot.getElementById('monthly_salary');
    const emi = element.shadowRoot.getElementById('EMIs_amount');
    expect(firstName.label).to.equal(localize.msg('change-language:firstname'));
    expect(lastName.label).to.equal(localize.msg('change-language:lastname'));
    expect(dob.label).to.equal(localize.msg('change-language:dateofbirth'));
    expect(email.label).to.equal(localize.msg('change-language:email'));
    expect(mobile.label).to.equal(localize.msg('change-language:mobilenumber'));
    expect(monthlysalary.label).to.equal(
      localize.msg('change-language:monthlysalary')
    );
    expect(emi.label).to.equal(localize.msg('change-language:previousemi'));
  });

  it('should check back button click', () => {
    const spy = sinon.spy(Router, 'go');
    element.shadowRoot.querySelector('.backbg-btn-color').click();
    expect(spy).to.have.called;
    expect(spy.firstCall.args[0]).to.equal('/emidetails');
  });

  xit('should check next button click - success post request with the inputs', () => {
    const spy = sinon.spy(window, 'fetch');
    element.shadowRoot.getElementById('first_name').value = 'John';
    element.shadowRoot.getElementById('last_name').value = 'Max';
    element.shadowRoot.getElementById('dateof_birth').value = '17/01/2007';
    element.shadowRoot.getElementById('email').value = 'John-max@gmail.com';
    element.shadowRoot.getElementById('mobile_number').value = '9123456789';
    element.shadowRoot.getElementById('monthly_salary').value = '10000';
    element.shadowRoot.getElementById('EMIs_amount').value = '100';
    element.shadowRoot.getElementById('terms').value = '';

    const nextBtn = element.shadowRoot?.getElementById('nextbtn');
    nextBtn.click();
    expect(spy.args[0][1].method).to.equal('POST');
    expect(spy.args[0][1].body).deep.equal({
      first_name: 'John',
      last_name: 'Max',
      dateof_birth: '2007-01-17',
      email: 'John-max@gmail.com',
      mobile_number: '9123456789',
      monthly_salary: 10000,
      EMIs_amount: 100,
      terms: [''],
    });
    expect(spy).to.have.called;
    spy.restore();
  });

  it('should validate first name field with validators', async () => {
    const firstName = element.shadowRoot.getElementById('first_name');

    firstName.modelValue = '';
    await firstName.validate();
    expect(firstName.hasFeedbackFor).to.include('error');

    firstName.modelValue = 'Jo';
    await firstName.validate();
    expect(firstName.hasFeedbackFor).to.include('error');

    firstName.modelValue = 'John123';
    await firstName.validate();
    expect(firstName.hasFeedbackFor).to.include('error');

    firstName.modelValue = 'John';
    await firstName.validate();
    expect(firstName.hasFeedbackFor).to.not.include('error');
  });

  it('should prevent default form submission', () => {
    const form = element.shadowRoot.querySelector('form');
    const preventDefault = sinon.spy();

    const event = new Event('submit', { bubbles: true, cancelable: true });
    Object.defineProperty(event, 'preventDefault', { value: preventDefault });

    form.dispatchEvent(event);

    expect(preventDefault).to.have.been.called;
  });
});
