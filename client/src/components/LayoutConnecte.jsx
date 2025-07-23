import Header from '../components/headers/Header';
// import "../../src/assets/css/App.css"

function LayoutConnecte({ children }) {
  return (
    <>
      <Header />
      <main>{children}</main>
    </>
  );
}

export default LayoutConnecte;
