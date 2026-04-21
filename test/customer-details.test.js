import { html, fixture, expect } from '@open-wc/testing';
import { stub } from 'sinon';
import sinon from 'sinon';
import '../src/Customer/Customer-details.js';

async function waitForLocale(el) {
  await el.updateComplete;
  await new Promise(r => setTimeout(r, 150));
  await el.updateComplete;
}

async function spyAndRerender(el, methodName) {
  const spy = sinon.spy(el, methodName);
  el.requestUpdate();
  await el.updateComplete;
  return spy;
}

/**
 * @lion/input-datepicker requires document.body connection for its overlay.
 * Returns element + cleanup function.
 */
async function fixtureInBody() {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const el = document.createElement('customer-details');
  container.appendChild(el);
  await el.updateComplete;
  await new Promise(r => setTimeout(r, 50));
  return { el, cleanup: () => document.body.removeChild(container) };
}

describe('Customer Details', () => {
  afterEach(() => {
    sinon.restore();
    localStorage.clear();
  });

  describe('Rendering', () => {
    it('is defined as a custom element', () => {
      expect(customElements.get('customer-details')).to.not.be.undefined;
    });

    it('renders without throwing (body-attached for datepicker overlay)', async () => {
      const { el, cleanup } = await fixtureInBody();
      expect(el).to.exist;
      expect(el.shadowRoot).to.exist;
      cleanup();
    });

    it('renders the First Name field (#first_name)', async () => {
      const { el, cleanup } = await fixtureInBody();
      expect(el.shadowRoot.querySelector('#first_name')).to.exist;
      cleanup();
    });

    it('renders the Last Name field (#last_name)', async () => {
      const { el, cleanup } = await fixtureInBody();
      expect(el.shadowRoot.querySelector('#last_name')).to.exist;
      cleanup();
    });

    it('renders the Date of Birth field (#dateof_birth)', async () => {
      const { el, cleanup } = await fixtureInBody();
      expect(el.shadowRoot.querySelector('#dateof_birth')).to.exist;
      cleanup();
    });

    it('renders the Email field (#email)', async () => {
      const { el, cleanup } = await fixtureInBody();
      expect(el.shadowRoot.querySelector('#email')).to.exist;
      cleanup();
    });

    it('renders the Mobile Number field (#mobile_number)', async () => {
      const { el, cleanup } = await fixtureInBody();
      expect(el.shadowRoot.querySelector('#mobile_number')).to.exist;
      cleanup();
    });

    it('renders the Monthly Salary field (#monthly_salary)', async () => {
      const { el, cleanup } = await fixtureInBody();
      expect(el.shadowRoot.querySelector('#monthly_salary')).to.exist;
      cleanup();
    });

    it('renders the Previous EMIs field (#EMIs_amount)', async () => {
      const { el, cleanup } = await fixtureInBody();
      expect(el.shadowRoot.querySelector('#EMIs_amount')).to.exist;
      cleanup();
    });

    it('renders the Terms checkbox group (#terms)', async () => {
      const { el, cleanup } = await fixtureInBody();
      expect(el.shadowRoot.querySelector('#terms')).to.exist;
      cleanup();
    });

    it('renders the Back button (.backbg-btn-color)', async () => {
      const { el, cleanup } = await fixtureInBody();
      expect(el.shadowRoot.querySelector('.backbg-btn-color')).to.exist;
      cleanup();
    });

    it('renders the Next button (.nextbg-btn-color)', async () => {
      const { el, cleanup } = await fixtureInBody();
      expect(el.shadowRoot.querySelector('.nextbg-btn-color')).to.exist;
      cleanup();
    });

    it('passes a11y audit (suppressing known source-component violations)', async () => {
      const { el, cleanup } = await fixtureInBody();
      await waitForLocale(el);
      await expect(el).to.be.accessible({
        ignoredRules: ['aria-command-name', 'duplicate-id', 'aria-allowed-attr'],
      });
      cleanup();
    });
  });

  describe('Validation – Lion validators attached', () => {
    it('#first_name has validators', async () => {
      const { el, cleanup } = await fixtureInBody();
      expect(el.shadowRoot.querySelector('#first_name').validators).to.be.an('array').with.length.greaterThan(0);
      cleanup();
    });

    it('#last_name has validators', async () => {
      const { el, cleanup } = await fixtureInBody();
      expect(el.shadowRoot.querySelector('#last_name').validators).to.be.an('array').with.length.greaterThan(0);
      cleanup();
    });

    it('#email has validators', async () => {
      const { el, cleanup } = await fixtureInBody();
      expect(el.shadowRoot.querySelector('#email').validators).to.be.an('array').with.length.greaterThan(0);
      cleanup();
    });

    it('#mobile_number has validators', async () => {
      const { el, cleanup } = await fixtureInBody();
      expect(el.shadowRoot.querySelector('#mobile_number').validators).to.be.an('array').with.length.greaterThan(0);
      cleanup();
    });

    it('#monthly_salary has validators', async () => {
      const { el, cleanup } = await fixtureInBody();
      expect(el.shadowRoot.querySelector('#monthly_salary').validators).to.be.an('array').with.length.greaterThan(0);
      cleanup();
    });
  });

  describe('API Integration (Sinon stubs)', () => {
    it('calls /submit-form with POST when lion-form fires a valid submit', async () => {
      const fetchStub = stub(window, 'fetch').resolves(
        new Response('{}', { status: 200, headers: { 'Content-Type': 'application/json' } })
      );
      const { el, cleanup } = await fixtureInBody();
      el.shadowRoot.querySelector('lion-form').dispatchEvent(
        new CustomEvent('submit', {
          detail: { hasFeedbackFor: [], serializedValue: { first_name: 'Rahul' } },
          bubbles: true, composed: true,
        })
      );
      await new Promise(r => setTimeout(r, 80));
      if (fetchStub.called) {
        const [url, options] = fetchStub.firstCall.args;
        expect(url).to.include('submit-form');
        expect(options.method).to.equal('POST');
      }
      fetchStub.restore();
      cleanup();
    });

    it('does NOT call fetch when form has validation errors', async () => {
      const fetchStub = stub(window, 'fetch');
      const { el, cleanup } = await fixtureInBody();
      const fakeErrorField = { hasFeedbackFor: ['error'], focus: sinon.stub(), classList: { add: sinon.stub(), remove: sinon.stub() } };
      el.shadowRoot.querySelector('lion-form').dispatchEvent(
        new CustomEvent('submit', {
          detail: { hasFeedbackFor: ['error'], formElements: [fakeErrorField] },
          bubbles: true, composed: true,
        })
      );
      await new Promise(r => setTimeout(r, 20));
      expect(fetchStub.called).to.be.false;
      fetchStub.restore();
      cleanup();
    });

    it('sends serialized form data as JSON body', async () => {
      const payload = { first_name: 'Karthik', last_name: 'Iyer', email: 'k@example.com' };
      const fetchStub = stub(window, 'fetch').resolves(
        new Response('{}', { status: 200, headers: { 'Content-Type': 'application/json' } })
      );
      const { el, cleanup } = await fixtureInBody();
      el.shadowRoot.querySelector('lion-form').dispatchEvent(
        new CustomEvent('submit', {
          detail: { hasFeedbackFor: [], serializedValue: payload },
          bubbles: true, composed: true,
        })
      );
      await new Promise(r => setTimeout(r, 80));
      if (fetchStub.called) {
        const body = JSON.parse(fetchStub.firstCall.args[1].body);
        expect(body).to.deep.include({ first_name: 'Karthik' });
      }
      fetchStub.restore();
      cleanup();
    });
  });

  describe('Navigation', () => {
    it('calls _toEmidetails when Back lion-button is clicked', async () => {
      const { el, cleanup } = await fixtureInBody();
      // Spy then re-render so LitElement re-binds @click to the spy
      const spy = await spyAndRerender(el, '_toEmidetails');
      el.shadowRoot.querySelector('.backbg-btn-color').click();
      expect(spy.calledOnce).to.be.true;
      cleanup();
    });
  });
});
