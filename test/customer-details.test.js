import { html, fixture, expect, aTimeout, waitUntil } from '@open-wc/testing';
import sinon from 'sinon';
import { localize } from '@lion/localize';
import { Router } from '@vaadin/router';
import { CustomerDetails } from '../src/Customer/Customer-details.js';

const ENDPOINT = 'https://loanfeapi.herokuapp.com/submit-form';

const EXPECTED_FIELDS = [
  'first_name',
  'last_name',
  'dateof_birth',
  'email',
  'mobile_number',
  'monthly_salary',
  'EMIs_amount',
  'terms',
];

const EN_LABELS = {
  first_name: 'First Name',
  last_name: 'Last Name',
  dateof_birth: 'Date of Birth',
  email: 'Email',
  mobile_number: 'Mobile Number',
  monthly_salary: 'Monthly Salary',
  EMIs_amount: 'Previous EMIs Amount',
};

describe('customer details', () => {
  const originalLocale = localize.locale;

  let el;
  let lionForm;
  let sandbox;
  let routerGo;
  let fetchStub;

  const field = name => el.shadowRoot.querySelector(`[name="${name}"]`);
  const checkbox = () => el.shadowRoot.querySelector('lion-checkbox');
  const submit = () => lionForm.submit();

  async function fillValidForm(overrides = {}) {
    const values = {
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com',
      mobile_number: '9876543210',
      monthly_salary: 50000,
      EMIs_amount: 5000,
      ...overrides,
    };
    Object.entries(values).forEach(([name, value]) => {
      field(name).modelValue = value;
    });
    checkbox().checked = true;
    await el.updateComplete;
    await waitUntil(
      () => !lionForm.hasFeedbackFor.includes('error'),
      'fillValidForm did not make the form valid - check how fields are driven',
    );
  }

  beforeEach(async () => {
    sandbox = sinon.createSandbox();

    routerGo = sandbox.stub(Router, 'go');
    fetchStub = sandbox.stub(window, 'fetch').resolves({ status: 200 });
    localize.locale = 'en-GB';

    el = await fixture(html`<customer-details></customer-details>`);

    lionForm = el.shadowRoot.querySelector('lion-form');
    await waitUntil(
      () => lionForm.hasFeedbackFor.includes('error'),
      'form should start out invalid (required fields are empty)',
    );
  });

  afterEach(() => {
    sandbox.restore();
    localize.locale = originalLocale;
  });

  describe('rendering and localization', () => {
    it('is upgraded to the CustomerDetails element', () => {
      expect(el).to.be.an.instanceOf(CustomerDetails);
    });

    it('renders the localized Customer Details heading', () => {
      expect(el.shadowRoot.querySelector('h2').textContent.trim()).to.equal(
        'Customer Details',
      );
    });

    it('registers the eight fields the loan API expects, in order', () => {
      const names = Array.from(lionForm.formElements).map(f => f.name);
      expect(names).to.deep.equal(EXPECTED_FIELDS);
    });

    it('labels every field from the en-GB locale data', () => {
      Object.entries(EN_LABELS).forEach(([name, label]) => {
        expect(field(name).label, name).to.equal(label);
      });
      expect(checkbox().label).to.equal(
        'I agree to give details and bank will contact me',
      );
    });

    it('renders localized Back and Next buttons', () => {
      expect(
        el.shadowRoot.querySelector('.backbg-btn-color').textContent.trim(),
      ).to.equal('Back');
      expect(
        el.shadowRoot.querySelector('#nextbtn').textContent.trim(),
      ).to.equal('Next');
    });

    it('re-renders when the global locale switches to nl-NL', async () => {
      localize.locale = 'nl-NL';
      await aTimeout(0);
      await el.updateComplete;
      expect(el.shadowRoot.querySelector('h2').textContent.trim()).to.equal(
        'Klant details',
      );
      expect(field('first_name').label).to.equal('Voornaam');
    });
  });

  describe('field validation', () => {
    it('pre-fills date of birth with the youngest date that is still 18', () => {
      const dob = field('dateof_birth');
      expect(dob.modelValue).to.be.an.instanceOf(Date);
      expect(dob.modelValue.getFullYear()).to.equal(
        new Date().getFullYear() - 18,
      );
      expect(dob.hasFeedbackFor).to.not.include('error');
    });

    it('rejects a date of birth under 18 or over 80', async () => {
      const dob = field('dateof_birth');
      const now = new Date();
      const [m, d] = [now.getMonth(), now.getDate()];

      dob.modelValue = new Date();
      await waitUntil(
        () => dob.hasFeedbackFor.includes('error'),
        'today should be rejected',
      );

      dob.modelValue = new Date(now.getFullYear() - 81, m, d);
      await waitUntil(
        () => dob.hasFeedbackFor.includes('error'),
        '81 years should be rejected',
      );

      dob.modelValue = new Date(now.getFullYear() - 40, m, d);
      await waitUntil(
        () => !dob.hasFeedbackFor.includes('error'),
        '40 years should be accepted',
      );
    });

    it('rejects a first name with digits or fewer than three letters', async () => {
      const firstName = field('first_name');

      firstName.modelValue = 'John3';
      await waitUntil(
        () => firstName.validationStates.error.Pattern === true,
        'digits should be rejected',
      );

      firstName.modelValue = 'Jo';
      await waitUntil(
        () => firstName.validationStates.error.MinLength === true,
        'two letters should be rejected',
      );

      firstName.modelValue = 'John Doe';
      await waitUntil(
        () => !firstName.hasFeedbackFor.includes('error'),
        'letters and a space should be accepted',
      );
    });

    it('rejects a mobile number that is not ten digits starting 6-9', async () => {
      const mobile = field('mobile_number');

      mobile.modelValue = '1234567890';
      await waitUntil(
        () => mobile.validationStates.error.Pattern === true,
        'must start with 6-9',
      );

      mobile.modelValue = '987654321';
      await waitUntil(
        () => mobile.validationStates.error.MinLength === true,
        'nine digits is too short',
      );

      mobile.modelValue = '98765432100';
      await waitUntil(
        () => mobile.validationStates.error.MaxLength === true,
        'eleven digits is too long',
      );

      mobile.modelValue = '9876543210';
      await waitUntil(
        () => !mobile.hasFeedbackFor.includes('error'),
        'ten digits starting with 9 should be accepted',
      );
    });

    it('rejects a malformed e-mail address', async () => {
      const email = field('email');

      email.modelValue = 'not-an-email';
      await waitUntil(
        () => email.hasFeedbackFor.includes('error'),
        'should be rejected',
      );

      email.modelValue = 'john.doe@example.com';
      await waitUntil(
        () => !email.hasFeedbackFor.includes('error'),
        'should be accepted',
      );
    });

    it('requires the terms checkbox and clears the error once ticked', async () => {
      const terms = field('terms');
      expect(terms.hasFeedbackFor).to.include('error');

      checkbox().checked = true;
      await waitUntil(
        () => !terms.hasFeedbackFor.includes('error'),
        'ticking the box should satisfy Required',
      );
    });

    it('shows the project-specific required message for an empty e-mail', async () => {
      const email = field('email');
      expect(email.validationStates.error).to.have.property('Required', true);

      const messages = () => {
        const node = email._feedbackNode;
        return node && node.feedbackData
          ? node.feedbackData.map(d => d.message)
          : [];
      };

      submit();
      await waitUntil(
        () => messages().length > 0,
        'feedback should become visible once the form is submitted',
      );

      expect(messages()).to.include('E-mail is a required field');
    });
  });

  describe('navigation', () => {
    it('navigates to the EMI details screen from _toEmidetails', () => {
      el._toEmidetails();
      expect(routerGo).to.have.been.calledOnceWithExactly('/emidetails');
    });

    it('navigates to the EMI details screen when Back is clicked', async () => {
      el.shadowRoot.querySelector('.backbg-btn-color').click();
      await aTimeout(0);
      expect(routerGo).to.have.been.calledWithExactly('/emidetails');
    });

    it('the Next button submits rather than navigating', async () => {
      el.shadowRoot.querySelector('#nextbtn').click();
      await aTimeout(0);
      expect(routerGo).to.have.callCount(0);
      expect(lionForm.submitted).to.be.true;
    });
  });

  describe('submitting an invalid form', () => {
    it('does not POST when any field is invalid', async () => {
      submit();
      await aTimeout(0);
      expect(fetchStub).to.have.callCount(0);
    });

    it('does not navigate away', async () => {
      submit();
      await aTimeout(0);
      expect(routerGo).to.have.callCount(0);
    });

    it('highlights the first field with an error', async () => {
      submit();
      await el.updateComplete;
      expect(field('first_name').classList.contains('error-handle')).to.be.true;
    });

    it('focuses the first field with an error', async () => {
      submit();
      await el.updateComplete;
      expect(field('first_name').contains(el.shadowRoot.activeElement)).to.be
        .true;
    });

    it('highlights the e-mail field when e-mail is the only invalid one', async () => {
      await fillValidForm();
      field('email').modelValue = '';
      await waitUntil(
        () => lionForm.hasFeedbackFor.includes('error'),
        'email should be invalid',
      );

      submit();
      await el.updateComplete;

      expect(field('email').classList.contains('error-handle')).to.be.true;
      expect(field('first_name').classList.contains('error-handle')).to.be
        .false;
    });

    it('removes the highlight again after exactly two seconds', () => {
      const clock = sandbox.useFakeTimers({
        toFake: ['setTimeout', 'clearTimeout'],
      });
      try {
        submit();
        const firstName = field('first_name');
        expect(firstName.classList.contains('error-handle')).to.be.true;

        clock.tick(1999);
        expect(firstName.classList.contains('error-handle')).to.be.true;

        clock.tick(1);
        expect(firstName.classList.contains('error-handle')).to.be.false;
      } finally {
        clock.restore();
      }
    });
  });

  describe('submitting a valid form', () => {
    it('POSTs the serialized form data to the loan API', async () => {
      await fillValidForm();

      submit();
      await aTimeout(0);

      expect(fetchStub).to.have.been.calledOnce;
      const [url, init] = fetchStub.firstCall.args;
      expect(url).to.equal(ENDPOINT);
      expect(init.method).to.equal('POST');
      expect(init.headers['Content-Type']).to.equal('application/json');

      const body = JSON.parse(init.body);
      expect(body.first_name).to.equal('John');
      expect(body.last_name).to.equal('Doe');
      expect(body.email).to.equal('john.doe@example.com');
      expect(body.mobile_number).to.equal('9876543210');
      EXPECTED_FIELDS.forEach(name => {
        expect(body, name).to.have.property(name);
      });
    });

    it('navigates to the success screen when the API answers 200', async () => {
      fetchStub.resolves({ status: 200 });
      await fillValidForm();

      submit();
      await aTimeout(0);

      expect(routerGo).to.have.been.calledOnceWithExactly('/success');
    });

    it('navigates to the error screen for any non-200 status', async () => {
      fetchStub.resolves({ status: 500 });
      await fillValidForm();

      submit();
      await aTimeout(0);

      expect(routerGo).to.have.been.calledOnceWithExactly('/error');
    });

    it('submits through the Next button, not only programmatically', async () => {
      await fillValidForm();
      el.shadowRoot.querySelector('#nextbtn').click();
      await aTimeout(0);
      expect(fetchStub).to.have.been.calledOnce;
    });
  });

  describe('accessibility and known defects', () => {
    it('is accessible, apart from two known defects', async () => {
      await expect(el).to.be.accessible({
        ignoredRules: ['duplicate-id', 'aria-allowed-attr'],
      });
    });

    it('known bug: the terms group and its checkbox share id="terms"', () => {
      expect(el.shadowRoot.querySelectorAll('#terms')).to.have.lengthOf(2);
    });

    it('known bug: the terms group name does not end in "[]"', () => {
      expect(field('terms').name).to.equal('terms');
      expect(field('terms').name).to.not.match(/\[\]$/);
    });
  });
});
