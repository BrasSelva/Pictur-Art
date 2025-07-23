import { Link, useNavigate } from 'react-router-dom';
import '../../assets/css/Header.css'; 
function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');

    navigate('/');
  };

  return (
    <header className="header">
      <div className="logo-section">
        <img src="/img/logoPicturArt.png" alt="logo" />
      </div>

      <nav className="nav">
        <Link to="/AlbumPage">Mes Albums</Link>
        <Link to="/ProfilagePage">Mon profil</Link>
        <button onClick={handleLogout} className="logout-button">
          Déconnexion
        </button>
      </nav>
    </header>
  );
}

export default Header;
