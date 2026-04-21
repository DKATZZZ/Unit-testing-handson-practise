import { expect } from '@open-wc/testing';
import { inWords } from '../src/utils/numToWord.js';

/**
 * Pure unit tests for the inWords() utility.
 * No DOM, no LitElement — just Mocha + Chai.
 */
describe('inWords() – Number to Words Utility', () => {

  // ── Zero ──────────────────────────────────────────────────────────────────
  describe('Zero', () => {
    it('converts 0 to "Zero"', () => {
      expect(inWords(0)).to.equal('Zero');
    });
  });

  // ── Units (1–9) ───────────────────────────────────────────────────────────
  describe('Units', () => {
    it('converts 1 to "one only "', () => {
      expect(inWords(1).trim()).to.include('one');
    });

    it('converts 5 to include "five"', () => {
      expect(inWords(5).toLowerCase()).to.include('five');
    });

    it('converts 9 to include "nine"', () => {
      expect(inWords(9).toLowerCase()).to.include('nine');
    });
  });

  // ── Teens (10–19) ─────────────────────────────────────────────────────────
  describe('Teens', () => {
    it('converts 10 to include "ten"', () => {
      expect(inWords(10).toLowerCase()).to.include('ten');
    });

    it('converts 11 to include "eleven"', () => {
      expect(inWords(11).toLowerCase()).to.include('eleven');
    });

    it('converts 15 to include "fifteen"', () => {
      expect(inWords(15).toLowerCase()).to.include('fifteen');
    });

    it('converts 19 to include "nineteen"', () => {
      expect(inWords(19).toLowerCase()).to.include('nineteen');
    });
  });

  // ── Tens (20–99) ──────────────────────────────────────────────────────────
  describe('Tens', () => {
    it('converts 20 to include "twenty"', () => {
      expect(inWords(20).toLowerCase()).to.include('twenty');
    });

    it('converts 50 to include "fifty"', () => {
      expect(inWords(50).toLowerCase()).to.include('fifty');
    });

    it('converts 99 to include "ninety" and "nine"', () => {
      const result = inWords(99).toLowerCase();
      expect(result).to.include('ninety');
      expect(result).to.include('nine');
    });
  });

  // ── Hundreds ─────────────────────────────────────────────────────────────
  describe('Hundreds', () => {
    it('converts 100 to include "one" and "hundred"', () => {
      const result = inWords(100).toLowerCase();
      expect(result).to.include('one');
      expect(result).to.include('hundred');
    });

    it('converts 500 to include "five" and "hundred"', () => {
      const result = inWords(500).toLowerCase();
      expect(result).to.include('five');
      expect(result).to.include('hundred');
    });
  });

  // ── Thousands ─────────────────────────────────────────────────────────────
  describe('Thousands', () => {
    it('converts 1000 to include "one" and "thousand"', () => {
      const result = inWords(1000).toLowerCase();
      expect(result).to.include('one');
      expect(result).to.include('thousand');
    });

    it('converts 10000 (minimum loan) to include "ten" and "thousand"', () => {
      const result = inWords(10000).toLowerCase();
      expect(result).to.include('ten');
      expect(result).to.include('thousand');
    });

    it('converts 50000 to include "fifty" and "thousand"', () => {
      const result = inWords(50000).toLowerCase();
      expect(result).to.include('fifty');
      expect(result).to.include('thousand');
    });
  });

  // ── Lakhs (Indian numbering) ──────────────────────────────────────────────
  describe('Lakhs', () => {
    it('converts 100000 to include "lakh"', () => {
      expect(inWords(100000).toLowerCase()).to.include('lakh');
    });

    it('converts 500000 (₹5 lakh loan) to include "five" and "lakh"', () => {
      const result = inWords(500000).toLowerCase();
      expect(result).to.include('five');
      expect(result).to.include('lakh');
    });

    it('converts 750000 to include "seven" and "lakh"', () => {
      const result = inWords(750000).toLowerCase();
      expect(result).to.include('seven');
      expect(result).to.include('lakh');
    });
  });

  // ── Crores ────────────────────────────────────────────────────────────────
  describe('Crores', () => {
    it('converts 10000000 (max loan: 1 crore) to include "crore"', () => {
      expect(inWords(10000000).toLowerCase()).to.include('crore');
    });

    it('converts 10000000 to include "one" and "crore"', () => {
      const result = inWords(10000000).toLowerCase();
      expect(result).to.include('one');
      expect(result).to.include('crore');
    });
  });

  // ── Overflow ──────────────────────────────────────────────────────────────
  describe('Overflow', () => {
    it('returns "overflow" for numbers with more than 9 digits', () => {
      expect(inWords(9999999999)).to.equal('overflow');
    });

    it('returns "overflow" for 1000000000 (10 digits)', () => {
      expect(inWords(1000000000)).to.equal('overflow');
    });
  });

  // ── Return Type ───────────────────────────────────────────────────────────
  describe('Return Type', () => {
    it('always returns a string for valid inputs', () => {
      expect(inWords(12345)).to.be.a('string');
    });

    it('result is non-empty for any valid positive number', () => {
      expect(inWords(42).trim()).to.not.be.empty;
    });
  });
});
