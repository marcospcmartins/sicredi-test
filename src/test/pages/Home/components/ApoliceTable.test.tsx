import { IApoliceFormProps } from "../../../../pages/Home/components/ApolicesForm/ApolicesForm";
import { ApoliceTable } from "../../../../pages/Home/components/ApolicesTable/ApolicesTable";
import { IApoliceForm } from "../../../../pages/Home/interfaces/IApoliceForm";
import makeServer from "../../../../server/server";
import { render } from "@testing-library/react";
import { fireEvent, screen, waitFor } from "@testing-library/dom";

vi.mock('../../../../pages/Home/components/ApolicesForm/ApolicesForm', () => ({
  ApoliceForm: ({ open, onClose, onSave, initialData }: IApoliceFormProps) => (
    open ? (
      <div data-testid="apolice-form">
        <button data-testid="save-button" onClick={() => onSave(initialData as IApoliceForm)}>Save</button>
        <button data-testid="close-button" onClick={onClose}>Close</button>
      </div>
    ) : null
  )
}));

beforeEach(() =>  makeServer());

describe('ApoliceTable Component', () => {
  it('renders the filter input', () => {
    render(<ApoliceTable />);
    expect(screen.getByLabelText('Filtro')).toBeInTheDocument();
  });

  it('renders the table headings', () => {
    render(<ApoliceTable />);
    expect(screen.getByText('Número da apólice')).toBeInTheDocument();
    expect(screen.getByText('Valor do prêmio')).toBeInTheDocument();
    expect(screen.getByText('Nome do segurado')).toBeInTheDocument();
    expect(screen.getByText('Email do segurado')).toBeInTheDocument();
  });

  it('fetches and displays policies data', async () => {
    render(<ApoliceTable />);
    await waitFor(() => {
      expect(screen.getByText('1')).toBeInTheDocument();
    });
  });

  it('handles adding a new policy', () => {
    render(<ApoliceTable />);
    fireEvent.click(screen.getByText('+'));
    expect(screen.getByTestId('apolice-form')).toBeInTheDocument();
  });

  it('handles saving a policy', () => {
    render(<ApoliceTable />);
    fireEvent.click(screen.getByText('+'));
    fireEvent.click(screen.getByTestId('save-button'));
    expect(screen.queryByTestId('apolice-form')).toBeInTheDocument();
  });

  it('handles closing the form', () => {
    render(<ApoliceTable />);
    fireEvent.click(screen.getByText('+'));
    fireEvent.click(screen.getByTestId('close-button'));
    expect(screen.queryByTestId('apolice-form')).not.toBeInTheDocument();
  });
});