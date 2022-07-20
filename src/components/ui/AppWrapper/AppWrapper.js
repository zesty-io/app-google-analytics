

import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { Box } from '@mui/material'
import Overview from '../../Overview'
import PageContent from '../../PageContent'
import Journey from '../../Journey'
import NavBar from '../NavBar/NavBar'
import Paper from '@mui/material/Paper';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography'
import { GoogleAuthOverlay } from '../AuthOverlay'
import { useGoogle } from '../../../context/GoogleContext'
import { useEffect, useState } from 'react'
import { useFetchWrapper } from '../../../services/useFetchWrapper'

const Menu = () => (
    <Paper sx={{ width: 250, maxWidth: '100%' }}>
        <MenuList>
            <MenuItem 
                component={Link} to="/">
                <Typography sx={{ fontWeight : "bold" }}>
                    Overview
                </Typography>
            </MenuItem>
            <MenuItem component={Link} to="/content">
                <Typography sx={{ fontWeight : "bold" }}>
                    Pages
                </Typography>
            </MenuItem>
            <MenuItem component={Link} to="/journey">
                <Typography sx={{ fontWeight : "bold" }}>
                    Journey
                </Typography>
            </MenuItem>
        </MenuList>
    </Paper>
)

//https://us-central1-zesty-prod.cloudfunctions.net/authenticateGoogleAnalytics?user_id=21478568&account_id=8355176

export default function AppWrapper(props){

    const { isAuthenticated, setIsAuthenticated } = useGoogle()
    const { getUserData } = useFetchWrapper(props.instance.zuid, props.token)
    const [userId, setUserId] = useState(null)

    useEffect( async () => {

        const user = await getUserData();
        if (user.data === null) return setIsAuthenticated(false)
        setUserId(user.data);

    }, [])

    return (
        <Box p={4}>
            <GoogleAuthOverlay user={userId} instance={props.instance} isAuthenticated={isAuthenticated} />
           <NavBar zuid={props.instance.ZUID} token={props.token}/>
           <Router>
                <Box sx={{ display : "flex", gap : 4 }}>
                    <Box>
                        <Menu />
                    </Box>
                    <Box sx={{ flexGrow : 1 }}>
                        <Routes>
                            <Route path="/" element={<Overview {...props} />} />
                            <Route path="/content" element={<PageContent {...props} />} />
                            <Route path="/journey" element={<Journey {...props} />} />
                        </Routes>
                    </Box>
                </Box>
            </Router>
            
        </Box>
    )
}