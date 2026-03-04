import { useEffect, useState } from 'react'
import './styles/App.css'

function App() {
  const [programmingLanguages, setProgrammingLanguages] = useState([])
  const [refreshQuery, setRefreshQuery] = useState(0)
  const [apiQuery, setApiQuery] = useState(null)
  const [apiResult, setApiResult] = useState({})
  const [errorMsg, setErrorMsg] = useState("")

  // Status: 0 = empty, 1 = loading, 2 = succcessful, 3 = error
  const [status, setStatus] = useState(0)

  useEffect(() => {
    const fetchProgrammingLanguages = async () => {
      try {

        const data = await fetch("https://raw.githubusercontent.com/kamranahmedse/githunt/master/src/components/filters/language-filter/languages.json");

        if (!data.ok) {
          throw new Error("Unable to fetch data")
        }

        const result = await data.json();
        setProgrammingLanguages(result);
      } catch(err) {
        console.log(err)
      }
      
    }
    fetchProgrammingLanguages();
  }, [])

  useEffect(() => {
    if (!apiQuery) return
    const fetchGithubRepo = async () => {

      try {
        setStatus(1)
        const data = await fetch(`https://api.github.com/search/repositories?q=language:${apiQuery}`)

        if (!data.ok) {
          throw new Error("Unable to fetch Repository")
        }

        const result = await data.json()
        setStatus(2)
        setApiResult(result.items[Math.floor(Math.random() * result.items.length)])
      } catch(err) {
        setStatus(3)
        setErrorMsg(`Error fetching github repository: ${err}`)
      }
     
    }

    fetchGithubRepo()
  }, [apiQuery, refreshQuery])

  let repoContainer;

  if (status === 0) {
    repoContainer = (
      <>
        Please Select a Programming Language
      </>
    )
  } else if (status === 1) {
    repoContainer = (
      <>
        Loading, please wait...
      </>
    )
  } else if(status === 2) {
    repoContainer = (
      <>
        <h3>{apiResult.name}</h3>
        <p>{apiResult.description}</p>
        <div className="row">
          <p>{apiResult.language}</p><p>Stars: {apiResult.stargazers_count}</p><p>Forks: {apiResult.forks}</p><p>Open Issues: {apiResult.open_issues}</p>
        </div>
      </>
    )
  } else {
    <>
      Error fetching data: {errorMsg}
    </>
  }

  console.log(apiResult)
  console.log(status)

  return (
    <> 
    <div className='container'>
      <p>Github Repository Finder</p>
      <select value={apiQuery} onChange={(e) => setApiQuery(e.target.value)} name="programming-language" id="programming-language" required>
        <option value="" disabled hidden selected>Select Programming Language</option>
        {programmingLanguages.map((pl) => {
          return <option value={pl.value}>{pl.title}</option>
        })}
        
      </select>
      <div className='repo-container'>
        {repoContainer}
      </div>
      <button onClick={() => { setRefreshQuery(prev => prev + 1) }} hidden={status === 0 || status === 1} >{status === 2 ? "Refresh" : "Retry"}</button>
    </div>
    </>
  )
}

export default App
