import { html, fixture, expect } from '@open-wc/testing';
import '../loan-application';

describe('LoanApplication Component', () => {
  let element;

  beforeEach(async () => {
    element = await fixture(html`<loan-application></loan-application>`);
    await element.updateComplete;
  });

  describe('Initialization & Default Properties', () => {
    it('instantiates the component correctly', () => {
      expect(element).to.exist;
    });

    it('initializes default property values correctly', () => {
      expect(element.title).to.equal('Hey there');
      expect(element.counter).to.equal(5);
    });

    it('renders the child <dash-board> component inside shadow DOM', () => {
      const dashboard = element.shadowRoot.querySelector('dash-board');
      expect(dashboard).to.exist;
    });
  });

  describe('Methods', () => {
    it('increments counter property when __increment is called', () => {
      expect(element.counter).to.equal(5);

      element.__increment();

      expect(element.counter).to.equal(6);
    });
  });
});