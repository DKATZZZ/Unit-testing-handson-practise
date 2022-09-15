import { html, fixture, expect } from '@open-wc/testing';
import Sinon, { stub } from 'sinon';
import '../src/header/Header.js';

describe('loan-header', () => {
  // Write test cases inside this block
  let el;
  before( async() => {
    el = await fixture(html `<loan-header><loan-header>`);
  });

  it('is accessible', () => {
    expect(el).to.be.accessible;
  });

  it('not accessible', () => {
    expect(el).not.to.be.accessible;
  });

  // it('localeChanged() method called', () => {
  //   let hrd = [{
  //     target : { 
  //       id: 'en-GB'
  //     }
  //   }]
  //   const spy = Sinon.spy(el, 'localeChanged');
  //   el = hrd;
    
  //   // el.localeChanged();
  //   // el.shadowRoot.querySelector('.amount').value = 10000;
  //   // expect(spy).to.have.called;
  //   expect(el.classList).to.contains('btn-cursor');
  //   // expect(el.shadowRoot.getElementById('en-GB').classList).to.contains('btn-cursor');
  //   // spy.restore();
  // });
});
