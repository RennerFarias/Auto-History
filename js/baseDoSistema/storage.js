const elementoMenu = document.getElementById('menu');
const rootMenu = ReactDOM.createRoot(elementoMenu);

rootMenu.render(
    <>
        <header className="cabecalho">
            <a href="index.html">
                <h2 className="logo"><img src="img/logo.png" alt="Logo Auto History" width="100" height="100"/></h2>
            </a>
            <nav className="menu">
                
                <a href="index.html#funcionalidades">Recursos</a>
                <a href="index.html#comofunciona">Etapas</a>
                <a href="oficina.html">Oficinas Parceiras</a>  
                <a href="dashboard.html" id="abrir-login">Entrar</a>
            </nav>
        </header>
    </>
);

