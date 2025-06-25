import { fixture, html, expect } from '@open-wc/testing';
import sinon from 'sinon';
import { Router } from '@vaadin/router';
import '../../src/dashboard/dashboard-menu.js'; 

describe('<dashboard-menu>', () => {
  let element;
  let routerStub;
  let localStorageStub;

  beforeEach(async () => {
    element = await fixture(html`
      <dashboard-menu
        imageURL="https://example.com/image.jpg"
        title="Personal Loan"
      ></dashboard-menu>
    `);
    document.body.appendChild(element);
    routerStub = sinon.stub(Router, 'go');
    localStorageStub = sinon.stub(window.localStorage, 'setItem');
  });

  afterEach(() => {
    routerStub.restore();
    localStorageStub.restore();
    element.remove(); 
  });

  it('renders with correct image and title', () => {
    const img = element.shadowRoot.querySelector('img');
    const title = element.shadowRoot.querySelector('h4');
    expect(img).to.exist;
    expect(img.src).to.include('https://example.com/image.jpg');
    expect(title.textContent).to.equal('Personal Loan');
  });

  it('sets localStorage and navigates when button is clicked', async () => {
    const button = element.shadowRoot.querySelector('button');
    button.click();
    await element.updateComplete;
    expect(localStorageStub.calledOnceWith('type', 'Personal Loan')).to.be.true;
    expect(routerStub.calledOnceWith('/details')).to.be.true;
  });

  it('navigateToDetails() should call Router.go("/details")', () => {
    element.navigateToDetails();
    expect(routerStub.calledOnceWith('/details')).to.be.true;
  });
});
