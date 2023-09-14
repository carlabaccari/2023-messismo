import './Home.css';
import { Link } from 'react-router-dom';
import React from 'react';

function Home() {
  return (
    <div className="Home">
      <div className="NavBar">
        <h1>Moe's Bar</h1>
      </div>
      <h1 style={{alignItems: 'center'}}>Bienvenido</h1>
      <div>
      <div className='Buttons'>
      <Link to="/products" className="boton-estilizado">
        Cargar Producto
      </Link>
      <Link to="/menu" className="boton-estilizado">
        Menu
      </Link>
      <Link to="/products" className="boton-estilizado">
        Modificar carta
      </Link>
      </div>
      </div>
    </div>
  );
}

export default Home;
