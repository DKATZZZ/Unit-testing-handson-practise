
import { html, fixture, expect } from '@open-wc/testing';
import sinon from 'sinon';
import { Router } from '@vaadin/router';
import '../src/SuccessAndError/Error.js'; 

describe('<loan-error>', () => {
  let element;
  let routerStub;

  beforeEach(async () => {
    routerStub = sinon.stub(Router, 'go');
    element = await fixture(html`<loan-error></loan-error>`);
    await element.updateComplete;
  });

  afterEach(() => {
    routerStub.restore();
    element.remove();
  });

  it('renders a heading and paragraph with localization text', () => {
    const heading = element.shadowRoot.querySelector('h2');
    const paragraph = element.shadowRoot.querySelector('p');
    expect(heading).to.exist;
    expect(paragraph).to.exist;
    expect(heading.textContent).to.include('!!'); 
  });

  it('renders a lion-button with class "home-btn"', () => {
    const button = element.shadowRoot.querySelector('lion-button.home-btn');
    expect(button).to.exist;
    expect(button.textContent.trim()).to.not.be.empty; 
  });

  it('calls Router.go("/") when button is clicked', async () => {
    const button = element.shadowRoot.querySelector('lion-button.home-btn');
    button.click();
    await element.updateComplete;
    expect(routerStub.calledOnceWith('/')).to.be.true;
  });

  it('should apply expected styles', () => {
    const styles = customElements.get('loan-error').styles.cssText;
    expect(styles).to.include('.home-btn');
    expect(styles).to.include('background-color: #12cbc4');
  });
});