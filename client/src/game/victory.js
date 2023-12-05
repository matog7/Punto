import React from 'react';
import { useState, useEffect } from 'react';
import Helmet from 'react-helmet';
import { useLocation } from 'react-router-dom';
import '../static/home.css';

function Victory() {
  const [joueurs, setJoueurs] = useState(useLocation().state.winner);

  const handleClick = () => {
    window.location.href = '/';
  };

  return (
      <div className="winner">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Punto - Fin de partie</title>
      </Helmet>
          {joueurs+ ' a gagné !'}
          <button onClick={handleClick}>Rejouer</button>
      </div>
  );
}

export default Victory;
