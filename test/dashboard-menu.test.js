import { html, fixture, expect } from '@open-wc/testing';
import Sinon, { stub } from 'sinon';
import { Router } from '@vaadin/router';
import '../src/dashboard/Dashboard-menu.js';

describe('Dashboard Menu details', () => {
  // Write test cases inside this block
  // refer basic-details.js files
  let el;
  before( async() => {
    el = await fixture(html `<dashboard-menu><dashboard-menu>`);
  });
  
  it('is accessible', () => {
    expect(el).to.be.accessible;
  });

  it('_setTypeInLS() method called ', () => {
    const spy = Sinon.spy(el, '_setTypeInLS');
    const spy1 = Sinon.spy(el, 'navigateToDetails');
    el._setTypeInLS();
    el.navigateToDetails();
    expect(spy).to.have.called;
    expect(spy1).to.have.called;
    spy.restore();
  });

  it('navigateToDetails()- called Router global() to navigate to dashboard', () => {
    const spy = Sinon.spy(Router, 'go');
    el.navigateToDetails();
    expect(spy).to.have.called;
    expect(spy.firstCall.args[0]).to.equal('/details');
    spy.restore();
  });
});