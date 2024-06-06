import React, {useState} from 'react';
import './App.css';

const CounterApp = () => {
  const [counter, setCounter] = useState(0);

  const increaseCounter = () => {
    setCounter(counter+1);
  }

  const decreaseCounter = () => {
    setCounter(counter-1);
  }

  return (
    <>
      <h1>Ini Counter App</h1>
      <h3>Count: {counter}</h3>
      <button onClick={() => increaseCounter()}>+</button>
      <button onClick={() => decreaseCounter()}>-</button>
    </>
  )
}

const HewanItem = ({ hewan, handleHewanUpdate, handleHewanDelete }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const [showError, setShowError] = useState(false);
  const [inputValue, setInputValue] = useState(''); 

  const handleInputChange = (event) => {
    setIsChanged(true);
    setInputValue(event.target.value);
  }

  const toggleUpdate = () => {
    // Jika tombol update ditekan dan teks pernah diubah
    if (isChanged && isUpdating) {
      if (inputValue === '') {  // jika input kosong
        setShowError(true);
        return;
      } else {
        setShowError(false);
      }
      
      handleHewanUpdate(hewan.id, inputValue);
    } 

    setIsUpdating(!isUpdating);
  }

  let hewanElement;

  if (isUpdating) {
    hewanElement = (
      <div className='simple-form'>  
        <input type="text" 
          onChange={(event) => handleInputChange(event)} 
          placeholder="Masukan nama hewan" 
          value={isChanged ? inputValue : hewan.namaHewan} 
        />
      </div>
    )
  } else {
    hewanElement = (
      <p className="hewan-item">{hewan.namaHewan}</p>
    )
  }

  return (
    <div>
      {hewanElement}
      {showError ? <p class="error-message">Nama Hewan Tidak Boleh Kosong!</p> : ""}
      <button 
        onClick={() => toggleUpdate()}
        >Update</button>
      <button 
        onClick={() => {handleHewanDelete(hewan.id)}}
        >Delete</button>
    </div>
  )
  
}

const App = () => {
  const [hewanList, setHewanList] = useState([
      { id: crypto.randomUUID(), namaHewan: 'Kuda'},
      { id: crypto.randomUUID(), namaHewan: 'Gajah'},
    ]);
  const [filteredHewanList, setFilteredHewanList] = useState(hewanList);
  const [inputValue, setInputValue] = useState('');
  const [filterValue, setFilterValue] = useState('');
  const [showError, setShowError] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (inputValue === "") {  // input tidak boleh kosong
      setShowError(true);
    } else {
      let hewanItem = {
        id: crypto.randomUUID(),
        namaHewan: inputValue
      }

      hewanList.push(hewanItem);

      setHewanList([...hewanList]);
      setShowError(false);
      setInputValue('');
    }

    // update hasil filter
    handleSearch(filterValue, hewanList);
  }

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  }

  const handleFilterChange = (event) => {
    setFilterValue(event.target.value);
    handleSearch(event.target.value, hewanList);
  }

  const handleHewanUpdate = (hewanId, namaHewan) => {
    let newHewanList = hewanList.map((hewanItem) => {
      if (hewanId === hewanItem.id) {
        hewanItem.namaHewan = namaHewan;
      }

      return hewanItem;
    })

    setHewanList(newHewanList);

    // update hasil filter
    handleSearch(filterValue, hewanList);
  }

  const handleHewanDelete = (hewanId) => {
    let newHewanList = hewanList.filter((hewanItem) => {
      return hewanItem.id !== hewanId;
    })

    setHewanList([...newHewanList]);
    console.log('hewan list: ', newHewanList)

    // update hasil filter
    // paksa re-render untuk mendapatkan hewanList terbaru
    
    handleSearch(filterValue, newHewanList);
    
  }

  const handleSearch = (namaHewan, hewanList) => {
    let newFilteredHewanList;
    
    if (namaHewan === '') {
      newFilteredHewanList = hewanList;
    } else {
      newFilteredHewanList = hewanList.filter((hewanItem) => {
        return hewanItem.namaHewan.toLowerCase()
          .includes(namaHewan.toLowerCase());
      })
    }

    setFilteredHewanList([...newFilteredHewanList]);
  }

  const clearFilter = () => {
    handleSearch('', hewanList);
    setFilterValue('');
  }

  return(
    <>
    <div className='container counter-app'>
      <CounterApp  />
    </div>
    <div className="container">
      <form onSubmit={(event) => handleSubmit(event)} className="simple-form">
        <label for="input-field">Nama Hewan:</label>
        <input type="text" onChange={(event) => handleInputChange(event)} value={inputValue} id="input-field" name="input-field" placeholder="Masukan nama hewan" />
        {showError ? <p class="error-message">Nama Hewan Tidak Boleh Kosong!</p> : ""}
        <button className="submit">Submit</button>
      </form>
      {filteredHewanList.length > 0 ? (
        <div className="hewan-list">
          {filteredHewanList.map((hewanItem) => {
            return (
              <HewanItem 
              key={hewanItem.id} 
              hewan={hewanItem} 
              handleHewanUpdate={handleHewanUpdate}
              handleHewanDelete={handleHewanDelete} />
            )
          })}
        </div>
      ) : (
        <></>
      )}
      <div className='simple-form form-filter'>
        <label for="search-field">Filter Hewan:</label>
        <input type="text" onChange={(event) => handleFilterChange(event)} 
          value={filterValue} 
          id="search-field" placeholder="Masukan filter nama hewan" />
        <button className="submit" 
          onClick={() => clearFilter()}>Clear</button>
      </div>
    </div>
    </>
  )
  
}

export default App;