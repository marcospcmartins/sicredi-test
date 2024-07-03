import { ApoliceTable } from "./components/ApolicesTable/ApolicesTable"

export const Home = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Apólices</h1>
      <ApoliceTable />
    </div>
  )
}