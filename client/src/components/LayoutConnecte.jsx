import Header from '../components/headers/Header';

function LayoutConnecte({ children }) {
  return (
    <>
      <Header />
      <main>{children}</main>
    </>
  );
}

export default LayoutConnecte;
