import { useEffect, useState } from 'react';
import './App.css';
import { getAllPokemon, getPokemon } from './utils/pokemon';
import Card from './components/Card/Card';
import Navbar from './components/Navbar/Navbar';

function App() {
  const initialURL = "https://pokeapi.co/api/v2/pokemon";
  const [loading, setLoading] = useState(true);
  const [pokemonData, setpokemonData] = useState([]);
  const [nextUrl, setNextUrl] = useState("");
  const [prevUrl, setPrevUrl] = useState("");

  useEffect(() => {
    const fetchPokemonData = async () => {
      // 全てのポケモンデータを取得
      let res = await getAllPokemon(initialURL);
      console.log(res);
      // 各ポケモンの詳細なデータを取得 sをつける理由はポケAPIがそのような構造になっているから
      loadPokemon(res.results);
      // console.log(res.results);
      setNextUrl(res.next);
      setPrevUrl(res.previous);
      setLoading(false);
    };
    fetchPokemonData();
  }, []);

  // data,pokemonの引数名は任意 dataはres.results(=URL)が入ってくる。
  const loadPokemon = async (data) => {
    let _pokemonData = await Promise.all(
      data.map((pokemon) => {
        // console.log(pokemon)
        // ポケモン1匹ずつのURLを取得する
        let pokemonRecord = getPokemon(pokemon.url);
        return pokemonRecord;
      })
    );
    setpokemonData(_pokemonData)
  };
  // console.log(pokemonData);

  const handleNextPage = async () => {
    setLoading(true);
    let data = await getAllPokemon(nextUrl);
    // console.log(data);
    setNextUrl(data.next)
    setPrevUrl(data.previous)
    // ポケモンを1匹ずつ表示させる
    await loadPokemon(data.results);
    setLoading(false);
  }
  const handlePrevPage = async() => {
    if(!prevUrl) return;
    setLoading(true);
    let data = await getAllPokemon(prevUrl);
    await loadPokemon(data.results);
    setNextUrl(data.next)
    setPrevUrl(data.previous)
    setLoading(false);
  }

  return (
    <>
      <Navbar />
      <div className="App">
        {loading ? (
          <h1>ロード中</h1>
        ) : (
          <>
            <div className='pokemonCardContainer'>
              {pokemonData.map((pokemon, i) => {
                return <Card key={i} pokemon={pokemon} />
              })}
            </div>
            <div className='btn'>
              <button onClick={handlePrevPage}>前へ</button>
              <button onClick={handleNextPage}>次へ</button>
            </div>

          </>
        )}
      </div>
    </>
  );
}

export default App;
