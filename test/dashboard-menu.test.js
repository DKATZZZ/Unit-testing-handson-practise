import { html, fixture, expect } from '@open-wc/testing';
import sinon from 'sinon';
import { DashboardMenu } from '../src/dashboard/Dashboard-menu.js';
import { Router } from '@vaadin/router';

describe('DashboardMenu', () => {
  let element;

  beforeEach(async () => {
    element = await fixture(html`
      <dashboard-menu imageURL="test.jpg" title="Home Loan"></dashboard-menu>
    `);
  });

  afterEach(() => {
    sinon.restore();
    localStorage.clear();
  });

  it('should render the component correctly', () => {
    const img = element.shadowRoot.querySelector('img');
    const h4 = element.shadowRoot.querySelector('h4');

    expect(element).to.exist;
    expect(element).to.be.accessible;
    expect(img).to.exist;
    expect(img.src).to.contain('test.jpg');
    expect(img.alt).to.equal('loan type');
    expect(h4).to.exist;
    expect(h4.textContent).to.contain('Home Loan');
    expect(element.title).to.equal('Home Loan');
  });

  it('should call _setTypeInLS when button is clicked', async () => {
    const spy = sinon.spy(DashboardMenu.prototype, '_setTypeInLS');

    const el = await fixture(html`
      <dashboard-menu imageURL="test.jpg" title="Home Loan"></dashboard-menu>
    `);

    const button = el.shadowRoot.querySelector('button');
    button.click();

    expect(spy.calledOnce).to.be.true;
  });

  it('should set type in localStorage and navigate to details', () => {
    const routerGoStub = sinon.stub(Router, 'go');

    element._setTypeInLS();

    expect(localStorage.getItem('type')).to.equal('Home Loan');
    expect(routerGoStub.calledOnce).to.be.true;
    expect(routerGoStub.calledWith('/details')).to.be.true;
  });
});
