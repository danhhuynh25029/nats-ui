import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import { AppSidebar } from './components/AppSideBar'
import { SidebarProvider } from './components/ui/sidebar'
import { ListStreamTable } from './pages/ListStreamTable'
import { ListMessageTable } from './pages/ListMessageTable'
import { ListBucketTable } from './pages/ListBucketTable'
import { ListKeyTable } from './pages/ListKeyTable'
import { PublishMessage } from './pages/PublishMessage'

function App() {
  const [count, setCount] = useState(0)

  return (
        <BrowserRouter>
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "19rem",
                } as React.CSSProperties
            }
        >
          <AppSidebar onItemClicked={function (item: string): void {
          throw new Error('Function not implemented.')
        } } />
          <Routes>
              <Route path='/' element={<Home/>}></Route>
              <Route path='/streams' element={<ListStreamTable/>}></Route>
              <Route path='/streams/messages' element={<ListMessageTable/>} ></Route>
              <Route path='/buckets' element={<ListBucketTable/>}></Route>
              <Route path='/buckets/keys' element={<ListKeyTable/>} ></Route>
              <Route path='/streams/publish' element={<PublishMessage/>}></Route>
          </Routes>
          </SidebarProvider>
        </BrowserRouter>
  )
}

export default App
