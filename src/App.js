import { useEffect, useState } from 'react';
import './App.css';
import lottery from './lottery';
import web3 from './web3';

function App() {
  const [manager, setManager] = useState('');
  const [players, setPlayers] = useState([]);
  const [balance, setBalance] = useState(0);
  const [value, setValue] = useState('0');
  const [message, setMessage] = useState('')
  useEffect(() => {
    const bootstrap = async () => {
      setManager(await lottery.methods.manager().call());
      setPlayers(await lottery.methods.getPlayers().call());
      setBalance(await web3.eth.getBalance(lottery.options.address));
    }
    bootstrap();
  }, []);

  const handleSubmit = async (evt) => {
    evt.preventDefault();

    const accounts = await web3.eth.getAccounts();

    setMessage('Waiting for transaction to complete...')
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(value, 'ether')
    })
    setMessage('')


  }

  const handleClick = async () => {
    const accounts = await web3.eth.getAccounts();

    console.log(accounts[0])

    setMessage('Waiting for transaction to complete...')
    await lottery.methods.pickWinner().send({ from: accounts[0] });
    setMessage('')
  }

  return (
    <div>
      <h2>Lottery Contract</h2>
      <p>This contract is managed by: {manager ? manager : ''}</p>
      <p>There are currently : {players ? players.length : '0'} people entered</p>
      <p>Price pool: {web3.utils.fromWei(balance, 'ether')}</p>
      <hr></hr>
      <div>
        <form onSubmit={handleSubmit}>
          <h4>Want to try your luck?</h4>
          <div>
            <label>
              Amount of ether to enter:
            </label>
            <input type='text' onChange={(evt) => setValue(evt.target.value)} value={value}></input>
            <button type='submit'>Enter</button>
          </div>
        </form>
      </div>
      <h3>{message ? message : ''}</h3>
      <hr></hr>
      <div>
        <h4>Time to pick a winner</h4>
        <button onClick={handleClick}>Pick Winner</button>
      </div>
    </div>
  );
}

export default App;
