import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import TxStatusIndicator from '@/components/ui/TxStatusIndicator';

describe('TxStatusIndicator', () => {
  it('renders nothing when status is idle', () => {
    const { container } = render(React.createElement(TxStatusIndicator, { status: 'idle' }));
    expect(container.innerHTML).toBe('');
  });

  it('shows signing message', () => {
    render(React.createElement(TxStatusIndicator, { status: 'signing' }));
    expect(screen.getByText('Awaiting wallet signature…')).toBeDefined();
  });

  it('shows polling message', () => {
    render(React.createElement(TxStatusIndicator, { status: 'polling' }));
    expect(screen.getByText('Confirming on-chain…')).toBeDefined();
  });

  it('shows success message', () => {
    render(React.createElement(TxStatusIndicator, { status: 'success' }));
    expect(screen.getByText('Transaction confirmed')).toBeDefined();
  });

  it('shows custom success message when provided', () => {
    render(React.createElement(TxStatusIndicator, { status: 'success', successMessage: 'Work registered!' }));
    expect(screen.getByText('Work registered!')).toBeDefined();
  });

  it('shows failed message', () => {
    render(React.createElement(TxStatusIndicator, { status: 'failed' }));
    expect(screen.getByText('Transaction failed')).toBeDefined();
  });

  it('shows explorer link when txHash and explorerLink are provided', () => {
    render(React.createElement(TxStatusIndicator, {
      status: 'success',
      txHash: 'abc123',
      explorerLink: 'https://stellar.expert/explorer/testnet/tx/abc123',
    }));
    const link = screen.getByText('View TX →');
    expect(link).toBeDefined();
    expect(link.getAttribute('href')).toBe('https://stellar.expert/explorer/testnet/tx/abc123');
  });
});
