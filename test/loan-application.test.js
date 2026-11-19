import { html, fixture, expect } from '@open-wc/testing';
import sinon from 'sinon';
import { Dashboard } from '../src/dashboard/Dashboard.js';
import { LoanApplication } from '../src/LoanApplication.js';

import '../loan-application.js';

describe('LoanApplication', () => {
  let el;
  let sandbox;

  beforeEach(async () => {
    sandbox = sinon.createSandbox();

    sandbox.stub(Dashboard.prototype, 'getOverview');

    el = await fixture(html`<loan-application></loan-application>`);
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('is registered as the loan-application custom element', () => {
    expect(customElements.get('loan-application')).to.equal(LoanApplication);
    expect(el).to.be.an.instanceOf(LoanApplication);
  });

  it('renders the dashboard, which owns the router outlet', () => {
    expect(el.shadowRoot.querySelector('dash-board')).to.exist;
  });

  it('starts with the default title and counter', () => {
    expect(el.title).to.equal('Hey there');
    expect(el.counter).to.equal(5);
  });
});
