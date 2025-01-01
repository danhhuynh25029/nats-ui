import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppSidebar } from './components/AppSideBar'
import { SidebarProvider } from './components/ui/sidebar'
import { ListStreamTable } from './pages/ListStreamTable'
import { ListMessageTable } from './pages/ListMessageTable'
import { ListBucketTable } from './pages/ListBucketTable'
import { ListKeyTable } from './pages/ListKeyTable'
import { PublishMessage } from './pages/PublishMessage'
import Dashboard from "./pages/Dashboard.tsx";

function App() {
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
              <Route path='/' element={<Dashboard/>}></Route>
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
