import { expect, test } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';

test('requires a tracking number before showing tracked vehicles', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /track your shipment/i })).toBeDefined();
  fireEvent.change(screen.getByLabelText(/tracking number/i), { target: { value: 'FL-2841' } });
  fireEvent.click(screen.getByRole('button', { name: /track vehicle/i }));
  expect(screen.getByRole('heading', { name: /vehicles in transit/i })).toBeDefined();
  expect(screen.getAllByText('FL-2841').length).toBeGreaterThan(0);
  expect(screen.getAllByText(/5 × 2025 Tesla Cybertruck/).length).toBe(2);
  expect(screen.getAllByText('5').length).toBeGreaterThan(0);
  expect(screen.getByText('Current transportation status')).toBeDefined();
  expect(screen.getAllByText('In transit').length).toBeGreaterThan(0);
  expect(screen.getByText('State 2 of 4')).toBeDefined();
  expect(screen.getByText('Arrived in Milan, Italy')).toBeDefined();
  expect(screen.getByText('Customs clearance and final delivery')).toBeDefined();
  expect(screen.queryByText(/jordan|atlas cars|admin/i)).toBeNull();
});

test('rejects tracking numbers that are not in the local database', () => {
  render(<App />);
  fireEvent.change(screen.getByLabelText(/tracking number/i), { target: { value: 'FL-9999' } });
  fireEvent.click(screen.getByRole('button', { name: /track vehicle/i }));
  expect(screen.getByRole('alert').textContent).toMatch(/tracking number not found/i);
  expect(screen.getByRole('heading', { name: /track your shipment/i })).toBeDefined();
});
