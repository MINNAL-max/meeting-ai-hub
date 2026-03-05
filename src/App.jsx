import { Route, Routes } from 'react-router-dom'
import './App.css'
import Dashboard from './pages/Dashboard'
import Upload from './pages/Upload'
import MainLayout from './layout/MainLayout'
import Meetings from './pages/Meetings'
import Sentiments from './pages/Sentiments'
import Chat from './pages/Chat'
import PageNotFound from './pages/PageNotFound'
function App() {


  return (
    <>
      <Routes>
        <Route path='/' element={<MainLayout />}>
          <Route path='/' element={<Dashboard />} />
          <Route path='/upload' element={<Upload />} />
          <Route path='/meetings' element={<Meetings />} />
          <Route path='/sentiments' element={<Sentiments />} />
          <Route path='/chat' element={<Chat />} />




        </Route>
        <Route path='*' element={<PageNotFound />} />

      </Routes>
    </>
  )
}

export default App