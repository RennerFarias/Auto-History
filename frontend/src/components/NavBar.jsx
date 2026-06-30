import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/img/logo.png';

export default function Navbar() {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 768 && open) setOpen(false);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [open]);

    return (
        <header className="cabecalho">
            <Link to="/">
                <h2 className="logo"><img src={logo} alt="Logo Auto History" /></h2>
            </Link>

            <button
                type="button"
                className={`menu-toggle ${open ? 'active' : ''}`}
                onClick={() => setOpen(!open)}
            >
                <span /><span /><span />
            </button>

            <nav className={`menu ${open ? 'active' : ''}`}>
                <Link to="/" onClick={() => setOpen(false)}>Início</Link>
                <Link to="/dashboard" onClick={() => setOpen(false)}>Painel</Link>
                <Link to="/oficinas" onClick={() => setOpen(false)}>Oficinas Parceiras</Link>
                <Link to="/sobre-nos" onClick={() => setOpen(false)}>Sobre nós</Link>
                <Link to="/dashboard" id="abrir-login" onClick={() => setOpen(false)}>Entrar</Link>
            </nav>
        </header>
    );
}