import Navbar from './components/Navbar';
import ProductList from './components/ProductList';

function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <ProductList />
      </main>
    </div>
  );
}

export default App;
