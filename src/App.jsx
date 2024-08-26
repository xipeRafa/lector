import { useState } from 'react'



function App() {


    const[arrState, setArrState]=useState([])

console.log(arrState)
   var idb = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;

    function leerArchivo(e) {

        var archivo = e.target.files[0];

        if (!archivo) {
            return;
        }

        var lector = new FileReader();

        lector.onload = function(e) {

            var contenido = e.target.result;

            

                if (!idb) {
                        console.log("This browser doesn't support IndexedDB");
                        return;
                }

                const request = idb.open('lector2');

                request.onerror = function (event) {
                        console.error("An error occurred with IndexedDB");
                        console.error(event);
                };

                request.onupgradeneeded = function (event) { //cuando se quiere abrir una base de datos que no existe
                        const db = request.result;

                        if (!db.objectStoreNames.contains("userData")) {
                                const objectStore = db.createObjectStore("userData", {keyPath: "id"});
                                objectStore.createIndex("nombreBuscar", "nombre", {unique: false,});
                        }
                };

                request.onsuccess = function () {


                        // let times = 0 
                        // const intervalID = setInterval (() => {

                        const db = request.result;

                        let tx = db.transaction("userData", "readwrite");
                        let userData = tx.objectStore("userData")



                        JSON.parse(contenido).map((el, i)=>{
                            return userData.add(el)
                        })

                        return tx.complete;
                       
                }           

        
        };

        lector.readAsText(archivo)



                // function mostrarContenido2(contenido2) {
                //     console.log(contenido2)
                //     contenido2.sort((a,b) => a.nombre.localeCompare(b.nombre)).map((el, i)=>{
                //         let nombre = document.createElement('p')
                //         nombre.innerHTML=el.nombre

                //         let a = document.getElementById('container')
                //         a.appendChild(nombre)
                //     })
                // }



                // const dbPromise2 = idb.open('lector2')

                // dbPromise2.onsuccess = () => {
                //     const db2 = dbPromise2.result

                //     let tx2 = db2.transaction("userData", "readonly")
                //     let userData2 = tx2.objectStore("userData")
                //     const users2 = userData2.getAll()

                //     users2.onsuccess = (query) => {
                //         mostrarContenido2(query.srcElement.result)
                //     }

                //     tx2.oncomplete = function () {
                //         db2.close();
                //     }
                // }



      

    }


  const[finderstate, setFinderState]=useState('')

  const handlerFinder=(e)=>{
      setFinderState(e.target.value)
      localStorage.setItem('finder', e.target.value.replace(/\b\w/g, l => l.toUpperCase()) )
  }





  function mostrarContenido(contenido) {
    console.log(contenido)
        let content = contenido.filter((el) => el.nombre.indexOf(localStorage.finder) > -1)
        setArrState(content)
  }




  const buscar =()=>{
        const dbPromise = idb.open('lector2')

        dbPromise.onsuccess = () => {
          const db = dbPromise.result

          let tx = db.transaction("userData", "readonly")
          let userData = tx.objectStore("userData")
          const users = userData.getAll()

          users.onsuccess = (query) => {
              mostrarContenido(query.srcElement.result)
          }

          tx.oncomplete = function () {
              db.close();
          }
        }
  }




  return (
    <>
        <h3>Lector de Respaldos</h3>

        <input type="file" onChange={leerArchivo}/> 

        <input type='search' value={localStorage.finder} placeholder='Buscar con Nombre' onChange={(e)=>handlerFinder(e)}/>

        <button id="buscar" onClick={buscar}>BUSCAR</button>

        <div className='container'>
            {
              arrState.map((el, i)=>(
                <div key={i}>
                    <img src={el.img64} />
                    <p>{el.nombre}</p>
                    <p className='fecha'>{el.fecha}</p>
                </div>
              ))
            }
        </div>
    </>
  )
}

export default App
