import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {getUser} from '../../services/user';
import UserPageDisplay from './UserPageDisplay';
import Loading from '../Loading';
import PageNotFound from '../PageNotFound';


const UserPage = () => {
    
    const { userId } = useParams();
    const [ loaded, setLoaded ] = useState(false);
    const [ user, setUser ] = useState(false);

    useEffect(() => {
        (async () => {
            const response = await getUser(userId);
            if(response) setUser(response)
            setLoaded(true);
        })()
    }, [])

    return (
        <div>
            {!loaded && (<Loading />)}
            {loaded && user && (<UserPageDisplay user={user} />)}
            {loaded && !user && (<PageNotFound />)}
        </div>
    )
}

export default UserPage;