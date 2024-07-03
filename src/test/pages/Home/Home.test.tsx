import { render } from "@testing-library/react";
import { screen } from "@testing-library/dom";
import { Home } from '../../../pages/Home/Home';
import makeServer from "../../../server/server";

vi.mock('../../../pages/Home/components/ApolicesTable/ApolicesTable', () => ({
  ApoliceTable: () => <div data-testid="apolices-table">Mocked ApolicesTable</div>,
}));

beforeEach(() => makeServer());

describe('Home Component', () => {
  test('renders the Policies heading', () => {
    render(<Home />);
    expect(screen.getByText('Apólices')).toBeInTheDocument();
  });

  test('renders the ApolicesTable component', () => {
    render(<Home />);
    expect(screen.getByTestId('apolices-table')).toBeInTheDocument();
  });

  test('container has correct classes', () => {
    render(<Home />);
    const container = screen.getByRole('heading', { name: "Apólices" }).closest('div');
    expect(container).toHaveClass('container mx-auto p-4');
  });
});

describe("Home Component", () => {
  test("renders the Policies heading", () => {
    render(<Home />);
    expect(screen.getByText("Apólices")).toBeInTheDocument();
  });

  test("container has correct classes", () => {
    render(<Home />);
    const container = screen.getByRole("heading", { name: "Apólices"}).closest("div");
    expect(container).toHaveClass("container mx-auto p-4");
  });
});