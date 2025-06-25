
import { html, fixture, expect, oneEvent } from '@open-wc/testing';
import '../loan-application.js';
import '../src/dashboard/Dashboard.js';

describe('LoanApplication Component', () => {
  let element;

  beforeEach(async () => {
    element = await fixture(html`<loan-application></loan-application>`);
  });

  it('should be instantiated', () => {
    expect(element).to.exist;
  });

  //Set default title and Counter
  it('should have default title and counter', () => {
    expect(element.title).to.equal('Hey there');
    expect(element.counter).to.equal(5);
  });

  //render dashboard component
  it('should render a <dash-board> component', () => {
    const dashboard = element.shadowRoot.querySelector('dash-board');
    expect(dashboard).to.exist;
  });

  it('should increment counter when __increment is called', () => {
    element.__increment();
    expect(element.counter).to.equal(6);
  });

  it('should not throw errors on multiple increments', () => {
    expect(() => {
      for (let i = 0; i < 10; i++) element.__increment();
    }).to.not.throw();
    expect(element.counter).to.equal(15);
  });
});
