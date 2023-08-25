import './App.css';
import { GlobalContext } from './components/context/GlobalContext';
import TablaEncuestaHacienda from './components/ui/TablaEncuestaHacienda';
import { useState } from 'react';

function App() {

  const [drawerNuevaEnc, setDrawerNuevaEnc] = useState(false);
  const [drawerEditarEnc, setDrawerEditarEnc] = useState(false);
  const [actualizarTableData, setActualizarTableData] = useState(false);

  // const idUserLogged = localStorage.getItem("usuario"); //Averiguar que tan necesario es esto
  // const [idUser, setIdUser] = useState(idUserLogged);

  return (
    <GlobalContext.Provider value={{ drawerNuevaEnc, setDrawerNuevaEnc, drawerEditarEnc, setDrawerEditarEnc, actualizarTableData, setActualizarTableData }}>
      <TablaEncuestaHacienda />
    </GlobalContext.Provider>
  );
}

export default App;
