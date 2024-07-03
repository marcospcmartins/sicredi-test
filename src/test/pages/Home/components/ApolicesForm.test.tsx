import { render } from '@testing-library/react';
import { screen, fireEvent, waitFor } from '@testing-library/dom';
import { ApoliceForm, IApoliceFormProps } from '../../../../pages/Home/components/ApolicesForm/ApolicesForm';

const initialData = {
  id: 1,
  apoliceNumber: 12345,
  prizeValue: 5000,
  insured: { name: 'John Doe', email: 'john.doe@example.com', cpfCnpj: '12345678901' },
  coverages: [{ name: 'Coverage 1', value: 1000, id: 1 }],
};

const renderComponent = (props: Partial<IApoliceFormProps> = {}) => {
  const defaultProps: IApoliceFormProps = {
    open: true,
    onClose: vi.fn(),
    onSave: vi.fn(),
    initialData: undefined,
    ...props,
  };
  return render(<ApoliceForm {...defaultProps} />);
};

describe('ApoliceForm Component', () => {
  it('renders correctly with initial data', () => {
    renderComponent({ initialData });
    expect(screen.getByLabelText('Número da apólice')).toHaveValue('12345');
    expect(screen.getByLabelText('Valor do prêmio')).toHaveValue(5000);
    expect(screen.getByLabelText('Nome do segurado')).toHaveValue('John Doe');
    expect(screen.getByLabelText('Email do segurado')).toHaveValue('john.doe@example.com');
    expect(screen.getByLabelText('CPF/CNPJ do segurado')).toHaveValue('123.456.789-01');
    expect(screen.getByLabelText('Nome da cobertura')).toHaveValue('Coverage 1');
    expect(screen.getByLabelText('Valor da cobertura')).toHaveValue(1000);
  });

  it('calls onSave with the correct data when Save button is clicked', async () => {
    const onSave = vi.fn();
    renderComponent({ onSave });

    fireEvent.change(screen.getByLabelText('Número da apólice'), { target: { value: "67890" } });
    fireEvent.change(screen.getByLabelText('Valor do prêmio'), { target: { value: "6000" } });
    fireEvent.change(screen.getByLabelText('Nome do segurado'), { target: { value: 'Jane Doe' } });
    fireEvent.change(screen.getByLabelText('Email do segurado'), { target: { value: 'jane.doe@example.com' } });
    fireEvent.change(screen.getByLabelText('CPF/CNPJ do segurado'), { target: { value: '098.765.432-10' } });

    fireEvent.click(screen.getByText('Salvar'));

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith({
        id: 0,
        apoliceNumber: "67890",
        prizeValue: "6000",
        insured: { name: 'Jane Doe', email: 'jane.doe@example.com', cpfCnpj: '098.765.432-10' },
        coverages: [],
      });
    });
  });

  it('calls onClose when Cancel button is clicked', () => {
    const onClose = vi.fn();
    renderComponent({ onClose });

    fireEvent.click(screen.getByText('Cancelar'));

    expect(onClose).toHaveBeenCalled();
  });

  it('adds a new coverage when Add Coverage button is clicked', () => {
    renderComponent();

    fireEvent.click(screen.getByText('Adicionar cobertura'));

    expect(screen.getAllByLabelText('Nome da cobertura')).toHaveLength(1);
    expect(screen.getAllByLabelText('Valor da cobertura')).toHaveLength(1);
  });

  it('removes a coverage when Remove button is clicked', () => {
    renderComponent({ initialData });

    fireEvent.click(screen.getByTestId("RemoveIcon"));

    expect(screen.queryByLabelText('Nome da cobertura')).toBeNull();
    expect(screen.queryByLabelText('Valor da cobertura')).toBeNull();
  });
});