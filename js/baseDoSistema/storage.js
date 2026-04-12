const elementoMenu = document.getElementById('menu');
const rootMenu = ReactDOM.createRoot(elementoMenu);

rootMenu.render(
    <>
        <header className="cabecalho">
            <h2 className="logo">🚗 Auto History</h2>

            <nav className="menu">
                <a href="index.html#funcionalidades">Recursos</a>
                <a href="index.html#comofunciona">Etapas</a>
                <a href="oficina.html">Oficinas Parceiras</a>  
                <a href="dashboard.html" id="abrir-login">Entrar</a>
            </nav>
        </header>
    </>
);

