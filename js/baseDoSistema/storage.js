const elementoMenu = document.getElementById('menu');
const rootMenu = ReactDOM.createRoot(elementoMenu);

function Menu() {
    const [open, setOpen] = React.useState(false);

    React.useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 768 && open) {
                setOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [open]);

    return (
        <header className="cabecalho">
            <a href="index.html">
                <h2 className="logo"><img src="img/logo.png" alt="Logo Auto History" width="100" height="100"/></h2>
            </a>

            <button
                type="button"
                className={`menu-toggle ${open ? 'active' : ''}`}
                aria-label="Abrir menu"
                aria-expanded={open}
                onClick={() => setOpen((prevOpen) => !prevOpen)}
            >
                <span />
                <span />
                <span />
            </button>

            <nav className={`menu ${open ? 'active' : ''}`} aria-hidden={!open && window.innerWidth <= 768}>
                <a href="index.html#funcionalidades">Recursos</a>
                <a href="index.html#comofunciona">Etapas</a>
                <a href="oficina.html">Oficinas Parceiras</a>
                <a href="sobreNos.html">Sobre nós</a>
                <a href="dashboard.html?login=true" id="abrir-login">Entrar</a>
            </nav>
        </header>
    );
}

rootMenu.render(<Menu />);

