import { html, fixture, expect } from '@open-wc/testing';
import Sinon, { stub } from 'sinon';
import '../src/dashboard/Dashboard.js';

describe('Dashboard details', () => {
  // Write test cases inside this block
  // refer basic-details.js files
  let el;
  before( async() => {
    el = await fixture(html `<dash-board><dash-board>`);
  });
  it('is accessible', () => {
    expect(el).to.be.accessible;
  });
});