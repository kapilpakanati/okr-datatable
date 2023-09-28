import logo from './logo.svg';
import './App.css';
import Table from './table.jsx'
import { Fragment, useEffect, useState } from 'react';
import KFSDK from "@kissflow/lowcode-client-sdk";


function App() {
  const [kf, setKf] = useState();

  useEffect(() => {
    setTimeout(() => {
      loadKfSdk();
    }, 300);
  }, []);

  async function loadKfSdk() {
    let kf = await KFSDK.initialize();
    window.kf = kf;
    setKf(kf);
  }

  return (
   <Fragment>{kf && <Table/>}</Fragment> 
  );
}

export default App;
