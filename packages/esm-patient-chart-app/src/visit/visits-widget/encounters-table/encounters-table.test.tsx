import React from 'react';
import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import { renderWithSwr } from 'tools';
import { mockEncounters } from '__mocks__';
import EncountersTable from './encounters-table.component';

const defaultProps = {
  showAllEncounters: true,
  encounters: mockEncounters,
};

describe('EncounterList', () => {
  it('renders an empty state when no encounters are available', () => {
    renderEncountersTable({ encounters: [] });

    expect(screen.queryByRole('table')).not.toBeInTheDocument();
    expect(screen.getByText(/no encounters found/i)).toBeInTheDocument();
  });

  it("renders a tabular overview of the patient's clinical encounters", async () => {
    renderEncountersTable({ encounters: mockEncounters });

    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('filters the encounter list when a user types into the searchbox', async () => {
    const user = userEvent.setup();

    renderEncountersTable();

    const searchbox = screen.getByRole('searchbox');
    expect(searchbox).toBeInTheDocument();

    await user.type(searchbox, 'Consultation');
    expect(screen.getByText(/consultation/i)).toBeInTheDocument();

    await user.type(searchbox, 'Triage');

    expect(screen.getByText(/no encounters to display/i)).toBeInTheDocument();
    expect(screen.getByText(/check the filters above/i)).toBeInTheDocument();
  });
});

function renderEncountersTable(props = {}) {
  renderWithSwr(<EncountersTable {...defaultProps} {...props} />);
}
