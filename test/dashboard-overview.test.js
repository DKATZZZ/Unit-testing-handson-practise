import { html, fixture, expect } from '@open-wc/testing';
import { stub } from 'sinon';
import '../src/dashboard/Dashboard-overview.js';

describe('Dashboard Overview details', () => {
  // Write test cases inside this block
  // refer basic-details.js files
  let el;
  before( async() => {
    el = await fixture(html `<dashboard-overview><dashboard-overview>`);
  });
  it('is accessible', () => {
    expect(el).to.be.accessible;
  });
});